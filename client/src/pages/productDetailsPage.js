import React from 'react';
import { BrowserRouter as Router, useLocation } from "react-router-dom";

import SentimentGauge from "../components/SentimentGauge";
import ReviewCategoryBox from "../components/ReviewCategoryBox";
import ProductBox from "../components/productBox";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import RatingDetails from "../components/RatingDetails";
import queryString from 'query-string'
import "./productDetailsPage.css";

const LoadingUI = () => {
  return (
    <div>
            <div className="loader">
              <div className="l_main">
                <div className="l_square">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="l_square">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="l_square">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="l_square">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="preloader-2" style={{ padding: "200px" }}>
                <span className="line line-1"></span>
                <span className="line line-2"></span>
                <span className="line line-3"></span>
                <span className="line line-4"></span>
                <span className="line line-5"></span>
                <span className="line line-6"></span>
                <span className="line line-7"></span>
                <span className="line line-8"></span>
                <span className="line line-9"></span>
                <div>Loading</div>
              </div>
            </div>
          </div>
  );
};

export default class ProductDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {
        title: null,
        urlProduct: null,
        urlPicture: null,
        price: null,
        rating: null,
        numOfRatings: null,
        ratingDetail: null,
      },
      productURL: ""
    };
  }

  async componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const url = query.get('url')
    await this.setState({productURL:url})
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: this.state.productURL,
        nrOfPages: 1,
        commands: [
          {
            description: null,
            locatorCss: ".shopee-product-rating",
            type: "getItemDetails",
          },
        ],
      }),
    };
    await fetch(
      "http://localhost:5000/api/product/product-details",
      requestOptions
    )
      .then(async (response) => {
        const data = await response.json();
        console.log(data.details);

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        this.setState((prevState) => ({
        product: {
          ...prevState.product,
          title: data.details.title,
          urlPicture: data.details.imageUrl,
          price: data.details.price,
          rating: data.details.rating,
          numOfRatings: data.details.numOfRatings,
          ratingDetail: data.details.ratingDetail
        },
      }));
    })
    .catch((error) => {
      this.setState({ errorMessage: error.toString() });
      console.error("There was an error!", error);
    });
  }

  render() {
    return (
      <div>
        {this.state.product.title ? (
          <React.Fragment>
            {/* Start Breadcrumb */}
            <div className="product_infor">
              <Breadcrumbs>
                <Link color="inherit" href="/">
                  Homepage
                </Link>
                <p color="textPrimary">{this.state.product.title}</p>
              </Breadcrumbs>
            </div>
            {/* End Breadcrumb */}

            {/* Start Product Details */}
            <section className="product-section">
              <ProductBox product={this.state.product} />
            </section>
            {/* End Product Details */}

            {/* Start Customer Sentiment Analyzer */}
            <section className="product-section">
              <SentimentGauge score={0.6} duration={1} />{" "}
              {/* Input score in range [-1, 1], input duration is in second */}
              <br />
              <RatingDetails
                rating={this.state.product.rating}
                numOfRatings={this.state.product.numOfRatings}
                ratingDetail={this.state.product.ratingDetail}
              />
              <br />
            </section>
            <section className="product-section">
              <ReviewCategoryBox style={{ margin: "0 auto" }} />
            </section>
            {/* End Customer Sentiment Analyzer */}
          </React.Fragment>
        ) : (
          // UI loading
          <LoadingUI />
        )}
      </div>
    );
  }
}