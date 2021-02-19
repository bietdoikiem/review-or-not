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
        urlPicture: null,
        price: null,
        rating: null,
        numOfRatings: null,
        ratingDetail: null
      },
    };
  }

  async componentDidMount() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url:
          "https://shopee.sg/%E8%87%AA%E5%97%A8%E9%94%85%E8%87%AA%E7%83%AD%E7%B1%B3%E9%A5%AD-Zi-Hai-Guo-Self-Heating-Rice-(zihaiguo)-i.254050224.6946878734",
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