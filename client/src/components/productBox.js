import React from "react";
import "./productBox.css";
import { Grid } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";

export default function ProductBox(props) {

    return (
      <React.Fragment>
          {/* Start the Product Infor */}
          <CssBaseline />
          <div className="product_infor">
              <Grid lg={12} container>
                {/* Start the image */}
                <Grid item lg={4} sm={12}>
                  <img
                    id="img_product"
                    src={props.product.urlPicture}
                    alt="product pic"
                  ></img>
                </Grid>
                {/* End the image */}
                {/* Start the infor */}
                <Grid item lg={8} sm={12}>
                  <p id="title">{props.product.title}</p>
                  <p id="price">{props.product.price}</p>
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
                  <form action={props.product.urlProduct} method="get">
                    <button id="btn_buy" type="submit">
                      <span style={{ color: "white" }}>Buy Now</span>
                    </button>
                  </form>
                </Grid>
                {/* End the infor */}

              </Grid>
          </div>
          {/* End the Product Infor */}
      </React.Fragment>
    );
}
