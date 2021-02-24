import React from 'react';
import { BrowserRouter as Router, useLocation } from "react-router-dom";

import SentimentGauge from "../components/SentimentGauge";
import ReviewCategoryBox from "../components/ReviewCategoryBox";
import ProductBox from "../components/productBox";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import RatingDetails from "../components/RatingDetails";

import "./productDetailsPage.css";

function QueryParamsDemo() {
  let query = new URLSearchParams(useLocation().search);
  let demo = query.get("url");
  return demo;
}

function getUrl() {
  const newUrl = QueryParamsDemo();
  return newUrl;
}

export default class ProductDetailsPage extends React.Component {
  productURL = null;

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
    };
  }

  async update() {
    this.productURL = getUrl();
  }

  async componentDidMount() {
    const hello = this.productURL;
    const url =
      "https://shopee.sg/%E3%80%90Same-Day-Delivery%E3%80%91-ASUS-Zenbook-14-UM425IA-AM092T-14inch-FHD-IPS-Ryzen-7-4700U-1TB-SSD-67Wh-2Y-ASUS-Warranty-i.51678844.7148374888";
    const requestOptionsDetails = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: hello,
        nrOfPages: 1,
        commands: [
          {
            description: null,
            locatorCss: null,
            type: "getItemDetails",
          },
        ],
      }),
    };
    const requestOptionsReviews = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: hello,
        nrOfPages: 1,
        commands: [
          {
            description: null,
            locatorCss: ".shopee-product-rating",
            type: "getItemReviews",
          },
        ],
      }),
    };
    Promise.all([
      fetch(
        "http://localhost:5000/api/product/product-details",
        requestOptionsDetails
      ),
      fetch(
        "http://localhost:5000/api/product/product-reviews",
        requestOptionsReviews
      ),
    ])
      .then(function (responses) {
        // Get a JSON object from each of the responses
        return Promise.all(
          responses.map(function (response) {
            return response.json();
          })
        );
      })
      .then((data) => {
        this.setState((prevState) => ({
          product: {
            ...prevState.product,
            title: data[0].details.title,
            urlProduct: data[0].details.productUrl,
            urlPicture: data[0].details.imageUrl,
            price: data[0].details.price,
            rating: data[0].details.rating,
            numOfRatings: data[1].results.numOfRatings,
            ratingDetail: data[1].results.ratings,
          },
        }));
      })
      .catch(function (error) {
        // if there's an error, log it
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <QueryParamsDemo />
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
        )}
      </div>
    );
  }
}