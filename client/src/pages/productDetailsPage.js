import React from 'react'

import SentimentGauge from "../components/SentimentGauge";
import ReviewCategoryBox from "../components/ReviewCategoryBox";
import ProductBox from "../components/productBox"
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import RatingDetails from "../components/RatingDetails";

import "./productDetailsPage.css"

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
        ratingDetail: null
      },
    };
  }

  async componentDidMount() {
    const url =
      "https://shopee.sg/-SG-Shipping-Ladybird-Key-Words-with-Peter-and-Jane-Box-Set-(36-Books)-i.147508069.2228555546";
    const requestOptionsDetails = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: url,
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
        url: url,
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
      fetch("http://localhost:5000/api/product/product-details", requestOptionsDetails),
      fetch("http://localhost:5000/api/product/product-reviews", requestOptionsReviews),
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
            ratingDetail: data[1].results.ratings
          },
        }));
      })
      .catch(function (error) {
        // if there's an error, log it
        console.log(error);
      });
    // await fetch(
    //   "http://localhost:5000/api/product/product-details",
    //   requestOptions
    // )
    // .then(async (response) => {
    //   const data = await response.json();

    //   // check for error response
    //   if (!response.ok) {
    //     // get error message from body or default to response status
    //     const error = (data && data.message) || response.status;
    //     return Promise.reject(error);
    //   }
    // })
    // .catch((error) => {
    //   this.setState({ errorMessage: error.toString() });
    //   console.error("There was an error!", error);
    // });
  }

  render() {
    return(
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

            <section className="product-section">
              <ProductBox product={this.state.product} />
            </section>
            <section className="product-section">
              <SentimentGauge score={0.6} duration={1} />{" "}
              {/* Input score in range [-1, 1], input duration is in second */}
              <br />
              <RatingDetails
                rating = {this.state.product.rating}
                numOfRatings = {this.state.product.numOfRatings}
                ratingDetail = {this.state.product.ratingDetail}
              />
              <br />
            </section>
            <section className="product-section">
              <ReviewCategoryBox style={{ margin: "0 auto" }} />
            </section>
          </React.Fragment>
        ) : (
          <h1>Waiting...</h1>
        )}
      </div>
    )
  }
}