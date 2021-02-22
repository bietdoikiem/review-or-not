import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Grid } from "@material-ui/core";
import "./RatingDetails.css";

const RatingWrapper = styled.div`
	background-color: #f2f2f2;
	box-sizing: border-box;
	width: 550px;
	height: 150px;
`;

const DivideBorder = styled.div`
	width: 1px;
	height: 150px;
	border-left: 1.5px solid rgba(0, 0, 0, 0.09);
`;

const BarWrapper = styled.div`
	box-sizing: border-box;
	width: 100%;
	height: 100px;
	padding-right: 8px;
	margin-top: 0px;
	margin-bottom: 10px;
`;

const TotalWrapper = styled.div`
	width: 100%;
	height: 50px;
	line-height: 50px;
	text-align: center;
	margin-top: 40px;
`;

const NumOfRatingWrapper = styled.div`
	width: 100%;
	height: 10px;
	line-height: 5px;
	text-align: center;
`;


const RatingBar = styled.div`
	background-color: #dbdbdb;
	border-radius: 0px;
	padding: 0px;
	> div {
		background-color: #F57200;
		width: ${(props) => (props.pct ? `${props.pct}%` : `0%`)};
		height: 5px;
		border-radius: 0px;
		margin-bottom: 0px;
	}
`;

const SolidStar = () => {
	return (
		<div style={{ display: "inline-block", marginTop: "2px", boxSizing: 'border-box'}}>
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
		</div>
	);
};

const EmptyStar = () => {
	return (
		<div style={{ display: "inline-block" }}>
			<svg enableBackground="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0" className="icon-rating">
				<polygon
					fill="none"
					points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeMiterlimit="10"
				></polygon>
			</svg>
		</div>
	);
};

/* Generate star bar by number of stars params */
const DynamicStar = (star) => { 
	switch (star) {
		case "rating5":
			return (
				<React.Fragment>
					<SolidStar />
					<SolidStar />
					<SolidStar />
					<SolidStar />
					<SolidStar />
				</React.Fragment>
			);
		case "rating4":
			return (
				<React.Fragment>
					<SolidStar />
					<SolidStar />
					<SolidStar />
					<SolidStar />
					<EmptyStar />
				</React.Fragment>
			);
		case "rating3":
			return (
				<React.Fragment>
					<SolidStar />
					<SolidStar />
					<SolidStar />
					<EmptyStar />
					<EmptyStar />
				</React.Fragment>
			);
		case "rating2":
			return (
				<React.Fragment>
					<SolidStar />
					<SolidStar />
					<EmptyStar />
					<EmptyStar />
					<EmptyStar />
				</React.Fragment>
			);
		case "rating1":
			return (
				<React.Fragment>
					<SolidStar />
					<EmptyStar />
					<EmptyStar />
					<EmptyStar />
					<EmptyStar />
				</React.Fragment>
			);
		default:
			return (
				<React.Fragment>
					<EmptyStar />
					<EmptyStar />
					<EmptyStar />
					<EmptyStar />
					<EmptyStar />
				</React.Fragment>
			);
	}
};

const getMockRatingMap = () => {
	let mapObj = {
		rating1: {
			numOfRatings: 1,
			percentage: 16.666,
		},
		rating2: {
			numOfRatings: 0,
			percentage: 0,
		},
		rating3: {
			numOfRatings: 1,
			percentage: 16.666,
		},
		rating4: {
			numOfRatings: 1,
			percentage: 16.666,
		},
		rating5: {
			numOfRatings: 3,
			percentage: 50,
		},
	};
	return mapObj;
};

const RatingDetails = (props) => {
	const [mapRating, setMapRating] = useState(null);

	/* fetch mock rating details */
	useEffect(() => {
		let mapObj = getMockRatingMap();
		setMapRating(mapObj);
	}, []);
	useEffect(() => {
		if (mapRating) {
			console.log(mapRating.rating1["percentage"]);
		}
	}, [mapRating]);

	/* Calculate average and total number of ratings */
	const getAvgAndTotalRatings = (ratingObj) => {
		let total = 0;
		let sum = 0;
		let re = /\D+/ // get only digits from strings
		Object.keys(ratingObj).map((r) => {
			let count = 0;
			count += ratingObj[r]['numOfRatings']
			total += count
			let multiplier = parseInt(r.split(re)[1]);
			sum += multiplier * count;
		})
		let avg = sum / total;
		avg = avg.toFixed(1)
		return {total, avg};
	}
	return (
		<React.Fragment>
			<RatingWrapper>
				<Grid container spacing={0}>
					<Grid item xs={3}>
						{mapRating ? (
							<React.Fragment>
								<TotalWrapper>
									<span style={{ fontSize: "42px" }}>{getAvgAndTotalRatings(mapRating).avg}</span>
								</TotalWrapper>
								<NumOfRatingWrapper>
									<span style={{ fontSize: "14px" }}>
										{" "}
										{`(${getAvgAndTotalRatings(mapRating).total} ratings)`}
									</span>
								</NumOfRatingWrapper>
							</React.Fragment>
						) : (
							"undefined"
						)}
					</Grid>
					<Grid item xs={1} style={{ maxWidth: "5%" }}>
						<DivideBorder />
					</Grid>
					<Grid item xs={8}>
						<BarWrapper>
							{mapRating // Loop through reverse order from 5 to 1
								? Object.keys(mapRating)
										.slice(0)
										.reverse()
										.map((r) => {
											return (
												<React.Fragment>
													{DynamicStar(r)} {/* Rating bar specified by dict key */}
													<span style={{ color: "#787878", fontSize: "13px", marginLeft: "4px" }}>
														({mapRating[r]["numOfRatings"]})
													</span>
													<RatingBar key={r} pct={mapRating[r]["percentage"]}>
														<div></div>
													</RatingBar>
												</React.Fragment>
											);
										})
								: "undefined"}
						</BarWrapper>
					</Grid>
				</Grid>
			</RatingWrapper>
		</React.Fragment>
	);
};

export default RatingDetails;
