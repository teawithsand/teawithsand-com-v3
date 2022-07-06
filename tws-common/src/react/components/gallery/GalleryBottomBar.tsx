import React, {
	ReactNode,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react"
import styled from "styled-components"

const InnerGalleryBottomBar = styled.div.attrs(
	({
		$visible,
		$itemHeight,
	}: {
		$itemHeight: number | null
		$visible: boolean
	}) => ({
		style: {
			"--gallery-item-height": $itemHeight ? `${$itemHeight}px` : "0px",
			...(!$visible ? { display: "none" } : {}),
		},
	}),
)`
	grid-row: 3;
	grid-column: 1;

	padding-top: 0.8rem;
	padding-bottom: 0.8rem;

	overflow-x: visible;
	overflow-y: hidden;

	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: minmax(100px, 1fr);
	gap: 0.8rem;

	// Make items non selectable and prevent fancy stuff with touch-action: none
	& * {
		user-select: none;
		::selection {
			background: transparent;
		}
		touch-action: none;

		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
		user-drag: none;
	}

	// Make all scrollbar pretty
	& {
		&::-webkit-scrollbar {
			height: 6px;
			width: 6px;
			background: black;
		}

		&::-webkit-scrollbar-thumb {
			background: white;
			border-radius: 12px;
			box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.75);
		}

		&::-webkit-scrollbar-corner {
			background: black;
		}

		scrollbar-color: white black;
		scrollbar-width: thin;

		scroll-behavior: smooth;
	}
`

// TODO(teawithsand): optimize it so it does not has to generate classes for each screen size
//  that being said, it's ok to leave it as is, since users do not resize their screens that often(I guess...)
const GalleryBottomBarItemContainer = styled.div.attrs(
	({ $clickable, $active }: { $clickable: boolean; $active: boolean }) => ({
		style: {
			cursor: $clickable ? "pointer" : "initial",
			...($active
				? {
						boxShadow: "0px 0px 12px 3px rgba(255, 255, 255, 1)",
				  }
				: {}),
		},
	}),
)`
	margin: auto;
	padding: 0; // this is required for proper usage of $itemHeight
	box-sizing: content-box;

	max-height: 100%;
	max-width: 100%;

	text-align: center;

	overflow: hidden; // just for safety, in case something goes wrong or image decides to ignore our max height

	& > * {
		box-sizing: border-box;
		max-height: var(--gallery-item-height);
	}
`

// Apparently eslint thinks that this react fn has no name
// eslint-disable-next-line react/display-name
const GalleryBottomBarItem = React.forwardRef(
	(
		props: {
			entry: ReactNode
			onClick?: () => void
			index: number
			active: boolean
		},
		ref,
	) => {
		const { entry, onClick, index, active } = props
		return (
			<GalleryBottomBarItemContainer
				data-index={index}
				ref={ref}
				onClick={onClick}
				{...({ $clickable: !!onClick, $active: active } as any)}
			>
				{entry}
			</GalleryBottomBarItemContainer>
		)
	},
)

const GalleryBottomBar = (props: {
	entries: ReactNode[]
	currentEntryIndex: number
	onElementClick?: (index: number) => void
	visible?: boolean // defaults to true
}) => {
	const { entries, onElementClick, visible, currentEntryIndex } = props
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [dimensions, setDimensions] = useState<[number, number] | null>(null)

	const newTargetScroll = useRef(0)

	const isContainerVisibleRef = useRef(false)

	useEffect(() => {
		const { current } = containerRef
		if (current) {
			const observer = new ResizeObserver(() => {
				const width = current.clientWidth
				const height = current.clientHeight
				setDimensions([width, height])
			})
			observer.observe(current)

			newTargetScroll.current = current.scrollLeft

			const listener = (e: any) => {
				e.preventDefault()

				// or make single scroll pull single image to view
				// can be easily done using scrollToView method
				newTargetScroll.current = Math.max(
					0,
					Math.min(
						newTargetScroll.current + e.deltaY,
						current.scrollWidth,
					),
				)
				current.scrollLeft = newTargetScroll.current
			}

			current.addEventListener("wheel", listener)

			return () => {
				current.removeEventListener("wheel", listener)
				observer.unobserve(current)
			}
		}
	}, [containerRef, containerRef.current])

	// TODO(teawithsand): this is not perfect, we would like to scroll to current element if we didn't do so
	//  *once* we make it visible, but not when we already did so and user has scrolled away the bar
	//  this requires special consideration when auto moving gallery elements is implemented
	useEffect(() => {
		const { current } = containerRef
		isContainerVisibleRef.current = false
		if (current) {
			const observer = new IntersectionObserver(
				entries => {
					isContainerVisibleRef.current = entries[0].isIntersecting
				},
				{
					threshold: [1],
				},
			)

			observer.observe(current)

			return () => {
				isContainerVisibleRef.current = false
				observer.unobserve(current)
			}
		}
	}, [containerRef, containerRef.current])

	useLayoutEffect(() => {
		const { current } = containerRef
		if (current && isContainerVisibleRef.current) {
			const res = current.querySelector(
				`*[data-index="${currentEntryIndex}"]`,
			)
			if (res) {
				res.scrollIntoView({
					behavior: "smooth",
					block: "end",
					inline: "center",
				})
			}
		}
	}, [currentEntryIndex, containerRef, containerRef.current])

	return (
		<InnerGalleryBottomBar
			ref={containerRef}
			{...({
				$itemHeight: dimensions ? dimensions[1] : null,
				$visible: visible ?? true,
			} as any)}
		>
			{entries.map((v, i) => (
				<GalleryBottomBarItem
					entry={v}
					index={i}
					key={i}
					active={i === currentEntryIndex}
					onClick={
						onElementClick ? () => onElementClick(i) : undefined
					}
				/>
			))}
		</InnerGalleryBottomBar>
	)
}
export default GalleryBottomBar
