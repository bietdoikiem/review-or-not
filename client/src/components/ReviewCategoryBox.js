import React, { useState, useEffect } from 'react';
import './ReviewCategoryBox.css';
import CommentCard from './CommentCard';


const ReviewCategoryBox = (props) => {

    /* Initial Category before fetching */
    const initialCategory = [''];

    /* Initial Category after fetching */
    const allowedCmtCategory = [
        'Quality',
        'Packaging',
        'Price',
        'Shipment',
        'Other'
    ];

    /* === Define states === */
    const [cmtCategory, setCmtCategory] = useState(initialCategory); // list of cmt categoires
    const [selectedCategory, setSelectedCategory] = useState(''); // current selected category of comment
    const [commentContent, setCommentContent] = useState(''); // placeholder for cmt content
    const [filteredCategoryContent, setFilteredCategoryContent] = useState(''); // placeholder for filtered content by category

    /* === Define methods and handlers === */
    const handleOnCategorySelect = (e) => {
        e.preventDefault();
        setSelectedCategory(e.target.name);
        return false;
    }

    /* === Changes events for components === */

    /* Fetch comment categories */
    useEffect(() => {
        // Should not ever set state during rendering, so do this in useEffect instead.
        const fetchCategory = async () => {
            setCmtCategory(allowedCmtCategory)
        };
        fetchCategory();
      }, []);
    
    /* Update initial value for comment categories */
    useEffect(() => {
        if(cmtCategory.length > 0) {
            setSelectedCategory(cmtCategory[0])
        }
    }, [commentContent]);

    /* Fetch list of comments by product's id (For ex: ID 1)*/
    useEffect(() => {
        setCommentContent(
            {
                'product_id': '1',
                'comment': [
                    {
                        'cmt_id': '101',
                        'user_id': '3812649',
                        'category': ['quality'],
                        'rating': 1,
                        'content': 'this has shit quality omfg'
                    },
                    {
                        'cmt_id': '102',
                        'user_id': '3812650',
                        'category': ['packaging'],
                        'rating': 5,
                        'content': 'The package is quite nice and handled carefully'
                    },
                    {
                        'cmt_id': '103',
                        'user_id': '3812651',
                        'category': ['price', 'quality'],
                        'rating': 3,
                        'content': 'The price is quite high but the cloth material is acceptable'
                    },
                    {
                        'cmt_id': '104',
                        'user_id': '3812652',
                        'category': ['shipment'],
                        'rating': 4,
                        'content': 'OK ! But shipping takes too long !!!'
                    },
                    {
                        'cmt_id': '105',
                        'user_id': '3812653',
                        'category': ['other'],
                        'rating': 5,
                        'content': 'Nice mixture of color btw, it would be even better if the shirt has bigger shoulder since im quite big'
                    },
                    {
                        'cmt_id': '106',
                        'user_id': '3812654',
                        'category': ['quality', 'package', 'price', 'shipment', 'other'],
                        'rating': 5,
                        'content': 'Everything is perfect !!'
                    }
                ]
            }
        )
    }, [])

    /* Listen on category changes and filter content by category */
    useEffect(() => {
        if(commentContent) { // if exists contents
            if(commentContent.comment) { // if exists comments
                let filteredContent = commentContent.comment.filter((c) => { // filter content by categories
                    let ctgs = [];
                    c.category.map(ctg => ctgs.push(ctg));
                    return ctgs.includes(selectedCategory.toLowerCase());
                })
                setFilteredCategoryContent(filteredContent);
            }
        }
    }, [selectedCategory])

    return (
			<React.Fragment>
					<div className="review-box">
						<nav id="single-nav" className="single-nav menu" role="navigation">
							<ul>
                                {/* Map comment categories */}
                                {allowedCmtCategory.map((category, index) => {
                                    return (
                                            <li  key={index.toString()} >
									            <a name={category} className={category === selectedCategory ? 'single-nav-link active' : 'single-nav-link'} href={`#${category}`} onClick={(e) => handleOnCategorySelect(e)}>{category}</a>
								            </li>
                                        /* {category === selectedCategory ? 'single-nav-link active' : 'single-nav-link'} */
                                    )
                                })}
							</ul>
						</nav>
                        <div className="review-box-content">
                            {/* Handle loading category content */}
                            {filteredCategoryContent && selectedCategory ? 
                            filteredCategoryContent.map((c, i) => {
                                return (
                                    <CommentCard key={i}>
                                        <li><b>User ID:</b> {c.user_id}</li>
                                        <li><b>Rating:</b> {c.rating}</li>
                                        <li><b>Category:</b> {c.category.map(category => {
                                            if(c.category.length > 1) {
                                            return `${category} | `
                                            }
                                            return `${category}`
                                            }
                                            )}</li>
                                        <li><b>Comment:</b> {c.content}</li>
                                    </CommentCard>
                                )
                            }) : 'undefined'
                        }
                        </div>
					</div>
			</React.Fragment>
		);
}

export default ReviewCategoryBox;