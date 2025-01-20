import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./postpage.css";

const PostPage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [type, setType] = useState<string>(""); // 'job' or 'exchange'
  const [offeredSkillId, setOfferedSkillId] = useState<string>(""); // For exchange type
  const [wantedSkillId, setWantedSkillId] = useState<string>(""); // For exchange type
  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]); // Fetch from backend

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
        location,
        type,
        // skill_id: type === "job" ? skillId : null, // Required for job type
        offered_skill: type === "exchange" ? offeredSkillId : null, // Required for exchange type
        wanted_skill: type === "exchange" || type === "job" ? wantedSkillId : null,// Required for exchange type
      };

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
        navigate("/listings/default"); // Redirect to view listings
      } else {
        const data = await response.json();
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

        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

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
              onChange={(e) => setWantedSkillId(e.target.value)}
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
              onChange={(e) => setOfferedSkillId(e.target.value)}
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
              onChange={(e) => setWantedSkillId(e.target.value)}
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

        <button type="submit">Post Listing</button>
      </form>
    </div>
  );
};

export default PostPage;
