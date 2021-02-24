import React, { useState, useEffect, useCallback } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SearchBar from "../components/SearchBar";
import { createMuiTheme, makeStyles, ThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./product.css";
import queryString from "query-string";
import axios from "axios";

const useStyles = makeStyles(() => ({
	/* Styles applied to root element */
	root: {
		// default root styles
		color: 'inherit',
		display: 'table-row',
		verticleAlign: 'middle',
		// Disable focus ring
		outline: 0,
		'&$hover:hover': {
			// set hover color
			backgroundColor: '#FFE9D6'
		}
	},
	/* Pseudo-class applied to root element if hover = true */
	hover: {},
}));
  

function feedback(value) {
	switch (value) {
		case "Positive":
			return (
				<TableCell className="overall-feedback" style={{ color: "#27AE61" }} align="right">
					{value}
				</TableCell>
			);
		case "Negative":
			return (
				<TableCell className="overall-feedback" style={{ color: "#E84C3D" }} align="right">
					{value}
				</TableCell>
			);
		case "Neutral":
			return (
				<TableCell className="overall-feedback" style={{ color: "#F1C40F" }} align="right">
					{value}
				</TableCell>
			);
		default:
			return (
				<TableCell className="overall-feedback" style={{ color: "#F1C40F" }} align="right">
					Unknown
				</TableCell>
			);
	}
}

const theme = createMuiTheme({
	typography: {
		fontFamily: ["Athiti"].join(","),
	},
});

const URL = "https://shopee.sg/search?keyword=";

export default function Product(props) {
	
	const classes = useStyles();

	// keyword input in the search bar
	const [keyword, setKeyword] = useState("");
	// current statical keyword param from fetched query
	const [staticParam, setStaticParam] = useState("");
	// results fetch from api
	const [fetchResult, setFetchResult] = useState(null);

	// handle input for input search results
	function handleKeywordChange(e) {
		e.preventDefault();
		setKeyword(e.target.value);
	}

	// handle submit for re-inputting the keyword to search bar
	async function handleReSubmit(e) {
		e.preventDefault();
		await props.history.push(`/search?keyword=${keyword}`);
		// set static
		setStaticParam(keyword);
		// empty current fetch result
		setFetchResult(null);
	}

	// POST method by axios to search products by keyword
	// url example format: "https://shopee.sg/search?keyword=";
	const fetchProductsByKeyword = useCallback(
		async (url) => {
			try {
				const result = await axios.post("/api/products/keyword", {
					url: `${url}${staticParam}`,
					commands: [
						{
							type: "getItems",
							locatorCss: ".col-xs-2-4.shopee-search-item-result__item",
						},
					],
					nrOfPages: 1,
				});
				return result;
			} catch (error) {
				console.log(error);
			}
		},
		[staticParam]
	);

	// fetch query parameters on URL and return keyword params
	const fetchQueryParam = () => {
		const obj = queryString.parse(props.location.search);
		setKeyword(obj.keyword);
		setStaticParam(obj.keyword);
	};

	// fetch product by URL and set result to component's state
	const fetchAndSetState = useCallback(async () => {
		const result = await fetchProductsByKeyword(URL);
		setFetchResult(result.data);
	}, [fetchProductsByKeyword]);

	// USE EFFECT HANDLERS //
	// fetch current keyword search results
	useEffect(() => {
		// fetch params query for keyword
		fetchQueryParam();
	}, []);

	// fetch result and set states on component mount
	useEffect(() => {
		if (staticParam !== "") {
			console.log(staticParam);
			// const result = fetchProductsByKeyword(URL);
			// setFetchResult(result.data);
			fetchAndSetState();
		} else {
		}
	}, [staticParam, fetchAndSetState]);

	// log fetch results
	useEffect(() => {
		if (typeof fetchResult !== undefined && fetchResult !== null) {
			console.log(fetchResult);
		}
	}, [fetchResult]);
	// set State on keyword change

	return (
		<ThemeProvider theme={theme}>
			<section id="search-result-section">
				<SearchBar
					value={keyword}
					searchResult={true}
					handler={handleKeywordChange}
					submitHandler={handleReSubmit}
					staticValue={staticParam}
				/>
			</section>
			<TableContainer className="table-container" component={Paper}>
				<Table id="product-table" aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell className="table-head">Product</TableCell>
							<TableCell className="table-head" align="right">
								Price
							</TableCell>
							<TableCell className="table-head" align="right">
								Rating
							</TableCell>
							<TableCell className="table-head" align="right">
								Sold
							</TableCell>
							<TableCell className="table-head" align="right">
								Site
							</TableCell>
							<TableCell className="table-head" align="right">
								Discount
							</TableCell>
							<TableCell className="table-head" align="right">
								Feedback
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{fetchResult ? (
							<React.Fragment>
								{fetchResult.products.map((row, index) => (
									<TableRow classes={classes} hover key={index}>
										<TableCell className="product-cell" scope="row">
											<div style={{ width: "100%" }}>
												<a
													style={{ color: "#000", textDecoration: "none" }}
													href={row.link}
													target="_"
												>
													<div>
														<img
															className="product-image"
															src={row.imageUrl}
															alt={row.productTitle}
														/>
													</div>
													<div>
														<p className="product-name">{row.productTitle}</p>
													</div>
												</a>
											</div>
										</TableCell>

										<TableCell align="right">${row.price}</TableCell>
										<TableCell align="right">{row.ratings}</TableCell>
										<TableCell align="right">{row.soldUnit}</TableCell>
										<TableCell align="right">Shopee (SG)</TableCell>
										<TableCell align="right">{row.discount}</TableCell>
										{feedback("Positive")}
									</TableRow>
								))}
							</React.Fragment>
						) : (
							<>
								<tr>
									<td>
										<CircularProgress color="secondary" />
										<div>
											<p>Your content is loading...</p>
										</div>
									</td>
								</tr>
							</>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</ThemeProvider>
	);
}
