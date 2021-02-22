import React, { useState, useEffect } from "react";
import { withRouter, Redirect, BrowserRouter as Router } from "react-router-dom";
import "./homepage.css";
import SearchBar from '../components/SearchBar';

/* JS component for homepage */


// Export Homepage
function Homepage(props) {
	// declare states
	const [input, setInput] = useState("");
	// declare functions
	function handleInputChange(e) {
		e.preventDefault();
		setInput(e.target.value);
	}

	function handleSubmit(e) {
		e.preventDefault();
		if(input !== "") {
        	props.history.push(`/search?keyword=${input}`);
		}
	}
	return (
			<div id="homepage">
				<section id="app-name-section">
					<div id="logo">
						<p className="logo-text">ReviewOrNot</p>
					</div>
				</section>
				<section id="search-section">
					<SearchBar value={input} handler={handleInputChange} submitHandler={handleSubmit} />
				</section>
			</div>
	);
}

export default withRouter(Homepage);
