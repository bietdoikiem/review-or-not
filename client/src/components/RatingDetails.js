import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Grid } from "@material-ui/core";
import "./RatingDetails.css";

const RatingWrapper = styled.div`
	background-color: #f2f2f2;
	box-sizing: border-box;
	width: 470px;
	height: 130px;
`;

const DivideBorder = styled.div`
	width: 1px;
	height: 125px;
	border-left: 1.5px solid rgba(0, 0, 0, 0.09);
`;

const BarWrapper = styled.div`
	box-sizing: border-box;
	width: 100%;
	height: 100px;
	padding-right: 20px;
	margin-top: 20px;
	margin-bottom: 10px;
`;

const RatingBar = styled.div`
	background-color: #dbdbdb;
	border-radius: 0px;
	padding: 0px;
	> div {
		background-color: #ee4d2d;
		width: ${(props) => (props.pct ? `${props.pct}%` : `0%`)};
		height: 5px;
		border-radius: 0px;
		margin-bottom: 15px;
	}
`;

const SolidStar = () => {
	return (
		<svg
			enableBackground="new 0 0 15 15"
			viewBox="0 0 15 15"
			x="0"
			y="0"
			className="icon-rating-solid"
		>
			<polygon
				points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
			></polygon>
		</svg>
	);
};

const EmptyStar = () => {
	return (
		<svg enableBackground="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0" className="icon-rating">
			<polygon
				fill="none"
				points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
			></polygon>
		</svg>
	);
};

/* Generate star bar by props */
const DynamicStar = (star) => {
	return (
		<React.Fragment>
			<RatingBar pct={50}>
				<div></div>
			</RatingBar>
			<RatingBar pct={50}>
				<div></div>
			</RatingBar>
			<RatingBar pct={50}>
				<div></div>
			</RatingBar>
			<RatingBar pct={50}>
				<div></div>
			</RatingBar>
			<RatingBar pct={50}>
				<div></div>
			</RatingBar>
		</React.Fragment>
	);
};

const getMockRatingMap = () => {
    let mapObj = {
        'rating1': {
            numOfRatings: 1,
            percentage: 16.666
        },
        'rating2': {
            numOfRatings: 0,
            percentage: 0
        },
        'rating3': {
            numOfRatings: 1,
            percentage: 16.666
        },
        'rating4': {
            numOfRatings: 1,
            percentage: 16.666
        },
        'rating5': {
            numOfRatings: 3,
            percentage: 50
        }
    }
    return mapObj
}


const RatingDetails = (props) => {
    const [mapRating, setMapRating] = useState(null)

    /* fetch mock rating details */
    useEffect(() => {   
        let mapObj = getMockRatingMap();
        setMapRating(mapObj);
	}, [])
	useEffect(() => {
		if(mapRating){
			console.log(mapRating.rating1['percentage']);
		}
	}, [mapRating])
	return (
		<React.Fragment>
			<RatingWrapper>
				<Grid container spacing={0}>
					<Grid item xs={3}>
						<SolidStar />
						<EmptyStar />
					</Grid>
					<Grid item xs={1}>
						<DivideBorder />
					</Grid>
					<Grid item xs={8}>
						<BarWrapper>
                            {mapRating ? // Loop through reverse order from 5 to 1
                                Object.keys(mapRating).slice(0).reverse().map((r, i) => {
                                    return (
                                        <RatingBar key={i} pct={mapRating[r]['percentage']}>
                                            <div></div>
                                        </RatingBar>
                                    )
                                }) : 'undefined'
                            }
						</BarWrapper>
					</Grid>
				</Grid>
			</RatingWrapper>
		</React.Fragment>
	);
};

export default RatingDetails;
