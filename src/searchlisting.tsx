import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./searchlisting.css";

const SearchListing: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>(""); // 'job' or 'skill_exchange'
  const [city, setCity] = useState<string>(""); // City for location
  const [state, setState] = useState<string>(""); // State for location
  const [zip_code, setZipCode] = useState<string>(""); // ZIP code for location
  const [wantedSkill, setWantedSkill] = useState<string>(""); // For skill exchange
  const [offeredSkill, setOfferedSkill] = useState<string>("");
  const [proximity, setProximity] = useState<string>("20");
  const [results, setResults] = useState<any[]>([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
  const [defaultListings, setDefaultListings] = useState<any[]>([]); // Initialize as an empty array
  const navigate = useNavigate();

  // Fetch default listings
  useEffect(() => {
    const fetchDefaultListings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/listings`);
        const data = await response.json();
        setDefaultListings(data); // Populate default listings
        setResults(data); // Also set results to default listings initially
      } catch (error) {
        console.error("Error fetching default listings:", error);
      }
    };
    fetchDefaultListings();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("http://localhost:5000/skills"); // Replace with your API endpoint
        const data = await response.json();
        setSkills(data); // Assuming the response is an array of skills
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
  
    fetchSkills();
  }, []);

   
  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value;

    // Allow only numeric values up to 5 digits
    if (/^\d{0,5}$/.test(zip)) {
        setZipCode(zip);
    }

    if (zip.length === 5) {
        setIsLoading(true);
        try {
            const response = await fetch(`http://api.zippopotam.us/us/${zip}`);
            if (response.ok) {
                const data = await response.json();
                if (data.places && data.places.length > 0) {
                    setCity(data.places[0]["place name"]);
                    setState(data.places[0]["state"]);
                } else {
                    setCity("Unknown City");
                    setState("Unknown State");
                }
            } else {
                setCity("Unknown City");
                setState("Unknown State");
            }
        } catch (error) {
            console.error(`Failed to fetch data for ZIP code: ${zip}`, error);
        } finally {
            setIsLoading(false);
        }
    } else {
        setCity("");
        setState("");
    }
};


  const handleSearch = async () => {
    const params = new URLSearchParams();
  
    if (typeFilter) params.append("type", typeFilter); // 'job' or 'skill_exchange'
    if (city) params.append("city", city);
    if (state) params.append("state", state);
    if (zip_code) params.append("zip_code", zip_code);
    if (wantedSkill) params.append("wanted_skill", wantedSkill);
    if (offeredSkill) params.append("offered_skill", offeredSkill);
    if (proximity) params.append("proximity", proximity);
  
    console.log("Search Params:", params.toString()); // Debugging line
  
    try {
      setIsLoading(true);
  
      const url = params.toString()
        ? `http://localhost:5000/listings/search?${params.toString()}`
        : `http://localhost:5000/listings`;
  
      console.log("Search URL:", url); // Debugging line
  
      const response = await fetch(url);
      const data = await response.json();
  
      console.log("Search Results:", data); // Debugging line
  
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleListingClick = (id: number) => {
    navigate(`/listings/${id}`); // Navigate to the ListingDetail page with the listing ID
  };

  return (
    <div className="searchlisting-page">
      <div className="searchlist-bar-container">
      <button className="nav-home-btn" onClick={() => navigate("/")}>
        Home
      </button>
        <h1 className="searchlist-title">Find Listings</h1>
  
        {/* Search Form */}
        <div className="searchlist-form">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="searchlist-select"
          >
            <option value="">Select Type</option>
            <option value="job">Listings</option>
            <option value="skill_exchange">Skill Exchange</option>
          </select>
  
          {/* ZIP Code Input */}
          {/* <input
            type="text"
            value={zip_code}
            onChange={handleZipCodeChange}
            placeholder="Enter your ZIP code"
            required
            className="searchlist-input"
          /> */}
  
          {/* City and State (Read-Only) */}
          {/* <input
            type="text"
            value={city}
            readOnly
            placeholder="City will auto-populate"
            className="searchlist-input"
          /> */}
          {/* <input */}
            {/* type="text"
            value={state}
            readOnly
            placeholder="State will auto-populate"
            className="searchlist-input"
          /> */}
  
          {/* Skill Filters */}
          {typeFilter === "job" && (
            <select
              value={wantedSkill}
              onChange={(e) => setWantedSkill(e.target.value)}
              className="searchlist-select"
            >
              <option value="">Select Wanted Skill</option>
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          )}
  
          {typeFilter === "skill_exchange" && (
            <>
              {/* Offered Skill for Skill Exchange */}
              <select
                value={offeredSkill}
                onChange={(e) => setOfferedSkill(e.target.value)}
                className="searchlist-select"
              >
                <option value="">Select Offered Skill</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
  
              {/* Wanted Skill for Skill Exchange */}
              <select
                value={wantedSkill}
                onChange={(e) => setWantedSkill(e.target.value)}
                className="searchlist-select"
              >
                <option value="">Select Wanted Skill</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </>
          )}
  
          {/* Proximity Input */}
          {/* <input
            type="number"
            placeholder="Proximity (miles)"
            value={proximity}
            onChange={(e) => setProximity(e.target.value)}
            className="searchlist-input"
          />
   */}
          {/* Search Button */}
          <button onClick={handleSearch} className="searchlist-button">
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
  
      {/* Results Section */}
      <div className="results-section">
        <h2>Listings</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          <ul className="results-list">
            {results.map((listing: any) => (
              <li
                key={listing.id}
                className="result-item"
                onClick={() => handleListingClick(listing.id)}
              >
                <strong>{listing.title}</strong>
                <span>
                  {listing.city}, {listing.state} {listing.zip_code}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default SearchListing;


