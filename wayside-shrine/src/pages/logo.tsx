import * as React from "react"
import { Helmet } from "react-helmet"
import styled from "styled-components"

import PageContainer from "@app/components/layout/PageContainer"

const height = 400
const width = 400
const mainFontSize = 200
const textSkewX = -20
const textSkewY = -20

const circleStrokeWidth = 3

const textFontSize = 45

const Container = styled.div`
	height: ${height}px;
	width: ${width}px;
	position: relative;
`
const LogoPage = () => {
	return (
		<main>
			<PageContainer>
				<Helmet>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Tangerine"
					/>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Pacifico"
					/>
				</Helmet>
				<Container>
					<svg width={width} height={height} style={{
                        background: "#B8DBD9",
                    }}>
						<text
							fontSize={mainFontSize + "px"}
							fontFamily="pacifico, serif"
							x={width / 2 - mainFontSize / 4 + textSkewX}
							y={height / 2 - mainFontSize / 4 + textSkewY}
							textAnchor="middle"
							dominantBaseline="central"
						>
							S
						</text>
						<text
							fontSize={mainFontSize + "px"}
							fontFamily="pacifico, serif"
							x={width / 2 + mainFontSize / 4 + textSkewX}
							y={height / 2 + mainFontSize / 4 + textSkewY}
							textAnchor="middle"
							dominantBaseline="central"
						>
							K
						</text>
                        		<text
							fontSize={textFontSize + "px"}
							fontFamily="pacifico, serif"
							x={width / 2}
							y={height / 23 * 19 + 20}
							textAnchor="middle"
							dominantBaseline="central"
						>
							SzlakiemKapliczek
						</text>
					</svg>
				</Container>
			</PageContainer>
		</main>
	)
}

export default LogoPage
