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
      },
    };
  }

  async componentDidMount() {
    // POST request using fetch with error handling
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url:
          "https://shopee.sg/Phone-12-11-Pro-XR-Max-PD-Charger-Cable-20W-Wall-Quick-Charger-USB-C-Power-Adapter-Type-C-to-Lightning-Cable-i.170352800.5262854188",
        nrOfPages: 1,
        commands: [
          { description: null, locatorCss: null, type: "getItemDetails" },
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
          },
        }));

        console.log(this.state.product.title);
        console.log(data.details.title);
      })
      .catch((error) => {
        this.setState({ errorMessage: error.toString() });
        console.error("There was an error!", error);
      });
  }

  render() {
    if (this.state.product.title == null) {
      // Render loading state ...
      return(
        <div>
          <p>Waiting...</p>
        </div>
      )
    } else {
      // Render real UI 
      return (
        <div>
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
            <RatingDetails />
            <br />
          </section>
          <section className="product-section">
            <ReviewCategoryBox style={{ margin: "0 auto" }} />
          </section>
        </div>
      );
    }
  }
}