import React from 'react'

import SentimentGauge from "../components/SentimentGauge";
import ReviewCategoryBox from "../components/ReviewCategoryBox";
import ProductBox from "../components/productBox"
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";


import "./productDetailsPage.css"


export default class ProductDetailsPage extends React.Component {

    state = {
        product: {
          title: "Men Summer Retro Short Sleeve Loose Fit Shirt",
          urlProduct:
            "https://shopee.sg/Men-Summer-Retro-Short-Sleeve-Loose-Fit-Shirt-i.27121667.2166110314?",
          urlPicture: "https://cf.shopee.sg/file/13534526cbb9ee6ed37f4696919b7756",
          price: "$10.59",
        },
      };

    render() {
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
                <ProductBox product={this.state.product}/>
            </section>
            <section className="product-section">
                <SentimentGauge score={0.6} duration={1} /> {/* Input score in range [-1, 1], input duration is in second */}
            </section>
            <section className="product-section">
                <ReviewCategoryBox style={{margin: "0 auto"}} />
            </section>
        </div>
        )
    }
}