import React from "react";
import "./SentimentGauge.css";
import styled, { css, keyframes } from 'styled-components';
import { normalizeRange } from './Utility';



const TickAnimation = (deg) => keyframes`
	0% {
		transform-origin: right center;
		transform: rotate(0deg);
	}
	100% {
		transform-origin: right center;
		transform: rotate(${deg}deg);
	}
`;

const IndicatorTick = styled.div`
    position: absolute;
    top: 40%;
    left: -250%;
    width: 300%;
    height: 5px;
    background-color: #000000;
    animation: ${props => props.value ? TickAnimation(props.value) : TickAnimation(0)} ${props => props.duration ? `${props.duration}s` : `1s`} linear;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
    border-top-right-radius: 5%;
    border-bottom-right-radius: 5%;
`;



const SentimentGauge = (props) => {
    const scoreRange = [-1, 1];
    const degreeRange = [0, 180];
	return (
		<div class="layout-align">
			<div id="score-meter-1" class="layout-align">
				<div id="scorer-1-inner-div">
					<div id="scorer-1-inner-div-5">
						<IndicatorTick value={normalizeRange(props.score, scoreRange, degreeRange)} duration={props.duration} />
					</div>
				</div>
				<div id="scorer-1-inner-div-2"></div>
				<div id="scorer-1-inner-div-3"></div>
				<div id="scorer-1-inner-div-4"></div>
			</div>
		</div>
	);
};

export default SentimentGauge;
