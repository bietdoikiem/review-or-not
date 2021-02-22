import React from 'react';
import './SearchBar.css';


// search bar component
export default function SearchBar(props) {

    function searchSubtitle() {
        if(props.searchResult) {
            return (
                <>
                    <p>Search results for "{props.staticValue}"</p>
                </>
            )
        } else {
            return (
                <>
                    <p>Ex: Shirt, pants, purple shirt</p>
                </>
            )
        }
    }
    // please do handle this time;

	return (
		<div className="search-bar">
			<form onSubmit={props.submitHandler}>
				<input
					id="product-search"
					name="keyword"
					type="search"
					value={props.value}
					onChange={props.handler}
				/>
			</form>
			<div className="search-example">
                {searchSubtitle()}
			</div>
		</div>
	);
}
