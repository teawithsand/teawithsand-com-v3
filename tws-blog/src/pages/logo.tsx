import PageContainer from "@app/components/layout/PageContainer"
import * as React from "react"
import styled from "styled-components"

const width = 400
const height = 400
const avgSize = (width + height) / 2
const fontSize = 20

const LogoContainer = styled.div`
	position: relative;

	width: ${width}px;
	height: ${height}px;
	border: 2px solid red;
	overflow: hidden;
`

const LogoPage = () => {
	return (
		<main>
			<PageContainer>
				<LogoContainer>
					<svg
						style={{
							position: "absolute",
							left: 0,
							top: 0,
							background:
								"linear-gradient(45deg, rgba(115,136,244,1) 0%, rgba(9,6,170,1) 100%)",
						}}
						height={height}
						width={width}
					>
						<text
							x={width / 2}
							y={(height / 9) * 4}
							text-anchor="middle"
							stroke="white"
							stroke-width="16px"
							fontSize={`${height / 3}px`}
							style={{
								letterSpacing: `20px`,
							}}
						>
							TWS
						</text>
						<path
							id="MyPath"
							fill="none"
							stroke="transparent"
							d={`M${width / 6},${height / 2} a60,60 0 0,0 ${
								(width / 3) * 2
							},0`}
							strokeWidth={"10px"}
							style={{
								display: "none",
							}}
						/>
						<text
							stroke="white"
							fill="white"
							stroke-width="3px"
							fontSize={`${height / 5}px`}
							style={{
								letterSpacing: `20px`,
							}}
						>
							<textPath
								href="#MyPath"
								textAnchor="middle"
								startOffset="50%"
							>
								BLOG
							</textPath>
						</text>
					</svg>
				</LogoContainer>
			</PageContainer>
		</main>
	)
}

export default LogoPage
