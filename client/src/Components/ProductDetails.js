import React from 'react';
import './productDetails.css';
import {Grid} from '@material-ui/core';

export default function ProductDetails() {
    return (
      <>
        {/* Head */}
        <div id="head"></div>
        {/* Start the Product Infor */}
        <Grid lg={12} item container spacing={8} id="container">
          {/* Start the image */}
          <Grid item lg={5} sm={5}>
            <img id="img_product" src="https://cf.shopee.sg/file/13534526cbb9ee6ed37f4696919b7756"></img>
          </Grid>
          {/* End the image */}
          {/* Start the infor */}
          <Grid item lg={7} sm={7}>
            <p id="title">Men Summer Retro Short Sleeve Loose Fit Shirt</p>
            <p id="price">$10.59</p>
            <div style={{ paddingTop: "30px" }}>
              <img id="guarantee" src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/bca2e6323e918c445dfe0279ebbc2c39.png"/>
              <span id="text_guarantee">Shopee Guarantee</span>
            </div>
            <form action="https://shopee.sg/Men-Summer-Retro-Short-Sleeve-Loose-Fit-Shirt-i.27121667.2166110314" method="get">
              <button id="btn_buy" type="submit">
                <span style={{ color: "white" }}>Buy Now</span>
              </button>
            </form>
          </Grid>
          {/* End the infor */}
        </Grid>
        {/* End the Product Infor */}
      </>
    );
}