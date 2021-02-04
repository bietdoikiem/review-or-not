import React from "react";
import './productDetails.css';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import {Grid} from '@material-ui/core';
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from '@material-ui/core/Container';

export default class ProductDetails extends React.Component {
    
  state = {
    product: {
      title: "Men Summer Retro Short Sleeve Loose Fit Shirt",
      urlProduct:
        "https://shopee.sg/Men-Summer-Retro-Short-Sleeve-Loose-Fit-Shirt-i.27121667.2166110314?",
      urlPicture: "https://cf.shopee.sg/file/13534526cbb9ee6ed37f4696919b7756",
      price: "$10.59",
    },
  };

  async getProductDetails() {
    //   Take JSON data from API and fetch into state
    const url = "";
    const response = await fetch(url);
    this.setState({ product:  data.results});
    const data = await response.json();
  }

  render() {
    return (
      <React.Fragment>
        {/* Head */}
        <div id="head"></div>

        {/* Start Breadcrumb */}
        <Container id="product_infor" fixed>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              Homepage
            </Link>
            <Typography color="textPrimary">
              {this.state.product.title}
            </Typography>
          </Breadcrumbs>
        </Container>
        {/* End Breadcrumb */}

        {/* Start the Product Infor */}
        <CssBaseline />
        <Container id="product_infor" fixed>
          <Typography component="div" style={{ backgroundColor: "white" }}>
            <Grid lg={12} item container spacing={8}>
              {/* Start the image */}
              <Grid item lg={5} sm={5}>
                <img
                  id="img_product"
                  src={this.state.product.urlPicture}
                  alt="product pic"
                ></img>
              </Grid>
              {/* End the image */}
              {/* Start the infor */}
              <Grid item lg={7} sm={7}>
                <p id="title">{this.state.product.title}</p>
                <p id="price">{this.state.product.price}</p>
                <div style={{ paddingTop: "50px" }}>
                  <a
                    id="normal_text"
                    href="https://help.shopee.sg/s/article/What-is-Shopee-Guarantee-1542975959578"
                  >
                    <img
                      id="guarantee"
                      src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/bca2e6323e918c445dfe0279ebbc2c39.png"
                      alt="Shopee Guarantee"
                    />
                    <span id="text_guarantee">Shopee Guarantee</span>
                  </a>
                </div>
                <form action={this.state.product.urlProduct} method="get">
                  <button id="btn_buy" type="submit">
                    <span style={{ color: "white" }}>Buy Now</span>
                  </button>
                </form>
              </Grid>
              {/* End the infor */}
            </Grid>
          </Typography>
        </Container>
        {/* End the Product Infor */}
      </React.Fragment>
    );
  }
}