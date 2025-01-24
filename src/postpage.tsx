import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./postpage.css";

const PostPage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [city, setCity] = useState<string>(""); // City for location
  const [state, setState] = useState<string>(""); // State for location
  const [zipCode, setZipCode] = useState<string>(""); // ZIP Code for location
  const [type, setType] = useState<string>(""); // 'job' or 'exchange'
  const [offeredSkillId, setOfferedSkillId] = useState<string>(""); // For exchange type
  const [wantedSkillId, setWantedSkillId] = useState<string>(""); // For job or exchange type
  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]); // Fetch from backend
  const [image, setImage] = useState<string | null>(null); // Optional image upload

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch skills from the backend
    const fetchSkills = async () => {
      try {
        const response = await fetch("http://localhost:5000/skills");
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const zip = e.target.value;
      setZipCode(zip);
  
      if (zip.length === 5) {
        try {
          const response = await fetch(`http://api.zippopotam.us/us/${zip}`);
          if (response.ok) {
            const data = await response.json();
            setCity(data.places[0]['place name']);
            setState(data.places[0]['state']);
          } else {
            setCity('');
            setState('');
          }
        } catch (error) {
          console.error('Failed to fetch location data:', error);
        }
      } else {
        setCity('');
        setState('');
      }
    };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // Convert file to base64 string
      };
      reader.readAsDataURL(file); // Read file as Data URL (base64)
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You need to log in to post a listing.");
        navigate("/login");
        return;
      }

      // Build the request payload
      const postData = {
        title,
        description,
        city,
        state,
        zip_code: zipCode,
        type,
        offered_skill: type === "exchange" ? offeredSkillId : null,
        wanted_skill: type === "exchange" || type === "job" ? wantedSkillId : null,
        image, // Include the uploaded image (base64)
      };

      console.log("Payload being sent:", postData); // Inspect the payload

      const response = await fetch("http://localhost:5000/listings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 201) {
        alert("Listing created successfully!");
        navigate("/listings"); // Redirect to view listings
      } else {
        const data = await response.json();
      console.log("Backend error:", data); // Log backend error
      alert(data.error || "Failed to create listing. Please try again.");
    }
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="post-page">
      <div className="post-breadcrumb">
        <a href="/">Home</a>
      </div>
      <h1>Create a Listing</h1>
      <form className="post-form" onSubmit={handlePost}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* ZIP Code Field */}
        <label>ZIP Code</label>
          <input
            type="text"
            value={zipCode}
            onChange={handleZipCodeChange}
            placeholder="Enter your ZIP code"
            required
          />

          {/* City and State (Read-Only) */}
          <label>City</label>
          <input type="text" value={city} readOnly placeholder="City will auto-populate" />
          <label>State</label>
          <input type="text" value={state} readOnly placeholder="State will auto-populate" />

        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">Select Type</option>
          <option value="job">Job Listing</option>
          <option value="exchange">Skill Exchange</option>
        </select>

        {/* For Job Type: Select the Required Skill */}
        {type === "job" && (
          <>
          <label>Wanted Skill</label>
          <select
          value={wantedSkillId}
      onChange={(e) => setWantedSkillId(String(Number(e.target.value)))}
      required
    >
      <option value="">Select a Skill</option>
      {skills.map((skill) => (
        <option key={skill.id} value={skill.id}>
          {skill.name}
        </option>
      ))}
    </select>
  </>
)}

{/* For Exchange Type: Select Offered and Wanted Skills */}
{type === "exchange" && (
  <>
    <label>Offered Skill</label>
    <select
      value={offeredSkillId}
      onChange={(e) => setOfferedSkillId(String(Number(e.target.value)))}
      required
    >
      <option value="">Select a Skill</option>
      {skills.map((skill) => (
        <option key={skill.id} value={skill.id}>
          {skill.name}
        </option>
      ))}
    </select>

    <label>Wanted Skill</label>
    <select
      value={wantedSkillId}
      onChange={(e) => setWantedSkillId(String(Number(e.target.value)))}
      required
    >
      <option value="">Select a Skill</option>
      {skills.map((skill) => (
        <option key={skill.id} value={skill.id}>
          {skill.name}
        </option>
      ))}
    </select>
  </>
)}


        <label>Image (Optional)</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <button type="submit">Post Listing</button>
      </form>
    </div>
  );
};

export default PostPage;
