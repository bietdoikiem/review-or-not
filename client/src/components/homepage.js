import React from "react";
import "./homepage.css";

/* JS component for homepage */

// search bar component
function SearchBar() {
  return (
    <div className="search-bar">
      <input id="product-search" name="product-name" type="name" />
        <div className="search-example">
            <p>Ex: Shirt, pants, purple shirt</p>
        </div>
    </div>
  );
}

// Export Homepage
export default function Homepage() {
  return (
    <div>
      <section id="app-name-section">
          <div id="logo">
                <p className="logo-text">ReviewOrNot</p>
          </div>
      </section>
      <section id="search-section">
        <SearchBar />
      </section>
    </div>
  );
}
