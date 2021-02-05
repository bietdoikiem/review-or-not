import React from 'react'

import SentimentGauge from "../components/SentimentGauge";
import ReviewCategoryBox from "../components/ReviewCategoryBox";
import ProductBox from "../components/productBox"


export default function ProductDetailsPage() {
    return (
        <div>
            <ProductBox/>
            <div style={{textAlign: "center"}}>
                <SentimentGauge score={0.6} duration={1} /> {/* Input score in range [-1, 1], input duration is in second */}
            </div>
            <div>
                <ReviewCategoryBox style={{margin: "0 auto"}} />
            </div>
        </div>
    );
}