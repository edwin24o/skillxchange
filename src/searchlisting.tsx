import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./searchlisting.css"; // Import the CSS file

const SearchListing: React.FC = () => {
    const [typeFilter, setTypeFilter] = useState<string>(""); // 'job' or 'exchange'
    const [location, setLocation] = useState<string>(""); // Location input
    const [wantedSkill, setWantedSkill] = useState<string>(""); // For skill exchange
    const [results, setResults] = useState([]); // Results from search
    const [defaultListings, setDefaultListings] = useState([]); // Default listings
    const navigate = useNavigate();
  
    // Fetch default job listings on component mount
    useEffect(() => {
      const fetchDefaultListings = async () => {
        try {
          const response = await fetch(`http://localhost:5000/listings`);
          const data = await response.json();
          setDefaultListings(data);
        } catch (error) {
          console.error("Error fetching default listings:", error);
        }
      };
      fetchDefaultListings();
    }, []);
  
    const handleSearch = async () => {
      const params = new URLSearchParams();
  
      if (typeFilter) params.append("type", typeFilter);
      if (location) params.append("location", location);
      if (typeFilter === "exchange") {
        if (wantedSkill) params.append("wanted_skill", wantedSkill);
      }
  
      try {
        const response = await fetch(`http://localhost:5000/listings/search?${params.toString()}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const handleListingClick = (id: number) => {
      navigate(`/listings/${id}`); // Navigate to the ListingDetail page with the listing ID
    };
  
    return (
      <div className="searchlisting-page">
        <div className="searchlist-bar-container">
        <div className="searchlisting-breadcrumb">
          <a href="/">Home</a> &gt; <a href="/messages">Messages</a> &gt; <a href="/listings">Post</a>
        </div>
          <h1 className="searchlist-title">Find Listings</h1>
  
          <button
            onClick={() => navigate("/searchpage")}
            className="searchlist-button"
            style={{ marginBottom: "20px" }}
          >
            Switch to User Search
          </button>
  
          {/* Search Bar */}
          <div className="searchlist-form">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="searchlist-select"
            >
              <option value="">Select Type</option>
              <option value="job">Listings</option>
              <option value="exchange">Skill Xchange</option>
            </select>
  
            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="searchlist-input"
            />
  
            {typeFilter === "exchange" && (
              <input
                type="text"
                placeholder="Wanted Skill"
                value={wantedSkill}
                onChange={(e) => setWantedSkill(e.target.value)}
                className="searchlist-input"
              />
            )}
  
            <button onClick={handleSearch} className="searchlist-button">
              Search
            </button>
          </div>
        </div>
  
        {/* Results */}
        <div className="results-section">
          <h2>Listings</h2>
          <ul className="results-list">
            {(results.length > 0 ? results : defaultListings).map(
              (listing: any) => (
                <li
                  key={listing.id}
                  className="result-item"
                  onClick={() => handleListingClick(listing.id)}
                >
                  <strong>{listing.title}</strong>
                  <span>{listing.location}</span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    );
  };
  
  export default SearchListing;

