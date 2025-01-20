import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./profilepage.css";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
  jobTitle: string; // Skill name as Job Title
  location: string;
  bio: string;
  socialLinks: {
    github: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage

      if (!token) {
        // If no token, navigate to login
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token
          },
        });

        const data = await response.json();

        if (response.status === 200) {
          // Map `profile_picture` to `avatarUrl`
          const mappedProfile = {
              ...data,
              avatarUrl: data.profile_picture, // Ensure this matches backend field name
          };
          setProfile(mappedProfile);
      } else if (response.status === 404) {
          navigate("/profile/createprofile");
      } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Unable to fetch profile. Please try again.");
        navigate("/profile/createprofile"); // Navigate to create profile on error
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile data available.</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Breadcrumb Navigation */}
        <div className="profile-breadcrumb">
          <a href="/">Home</a> &gt; <a href="/listings/default">Xchanges</a> &gt;{" "}
          <a href="/listings">Post</a>
        </div>

        <div className="profile-content">
          {/* Left Profile Section */}
          <div className="profile-left">
            <div className="profile-card">
            <img
  src={`http://localhost:5000${profile.avatarUrl || "/static/profile-images/default-profile.png"}`}
  alt="Profile Avatar"
  className="profile-avatar"
/>
              <h3 className="profile-name">{profile.fullName || "N/A"}</h3>
              {/* <p className="profile-job-title">{profile.jobTitle || "N/A"}</p> */}
              <p className="profile-bio">{profile.bio || "N/A"}</p>
              <div className="profile-actions">
                <button className="btn light">Follow</button>
                <button className="btn dark">Message</button>
              </div>
            </div>
          </div>

          {/* Right Profile Details Section */}
          <div className="profile-right">
            <div className="profile-details">
              <div className="detail-item">
                <strong>Email:</strong>
                <span>{profile.email || "N/A"}</span>
              </div>
              <div className="detail-item">
                <strong>Phone:</strong>
                <span>{profile.phone || "N/A"}</span>
              </div>
              <div className="detail-item">
                <strong>Location:</strong>
                <span>{profile.location || "N/A"}</span>
              </div>
              <div className="detail-item">
                <strong>Social Links:</strong>
                <ul>
                  <li>
                    <strong>GitHub:</strong>{" "}
                    <a href={profile.socialLinks.github || "#"} target="_blank">
                      {profile.socialLinks.github || "Not Provided"}
                    </a>
                  </li>
                  <li>
                    <strong>Twitter:</strong>{" "}
                    <a href={profile.socialLinks.twitter || "#"} target="_blank">
                      {profile.socialLinks.twitter || "Not Provided"}
                    </a>
                  </li>
                  <li>
                    <strong>Instagram:</strong>{" "}
                    <a
                      href={profile.socialLinks.instagram || "#"}
                      target="_blank"
                    >
                      {profile.socialLinks.instagram || "Not Provided"}
                    </a>
                  </li>
                  <li>
                    <strong>Facebook:</strong>{" "}
                    <a
                      href={profile.socialLinks.facebook || "#"}
                      target="_blank"
                    >
                      {profile.socialLinks.facebook || "Not Provided"}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;