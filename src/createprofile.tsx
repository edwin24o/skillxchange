import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './createprofile.css';

const CreateProfile: React.FC = () => {
  const [accountType, setAccountType] = useState<string>('regular');
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [bio, setBio] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [phone, setPhone] = useState<string>("");
  const [skillId, setSkillId] = useState<string | null>(null);
  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
  const [customSkill, setCustomSkill] = useState<string>('');
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    instagram: '',
    facebook: '',
  });

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

  const [currentSocialLink, setCurrentSocialLink] = useState<string | null>(null); // Track which social link is being edited
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Toggle modal visibility
  const navigate = useNavigate();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string); // Convert file to base64 string
      };
      reader.readAsDataURL(file); // Read file as Data URL (base64)
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/profile/createprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          account_type: accountType,
          firstName,
          lastName,
          bio,
          profile_picture: profileImage, // Send the profile image URL
          zip_code: zipCode,
          city,
          state,
          phone,
          skill_id: accountType === 'administrator' ? skillId : null,
          social_links: socialLinks,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert('Profile created successfully');
        navigate('/home');
      } else if (response.status === 401) {
        alert('Unauthorized: Please log in again');
        navigate('/login');
      } else {
        alert('Profile creation failed: ' + (data.message || data.error));
      }
    } catch (error) {
      console.error('Error during profile creation:', error);
      alert('Profile creation failed');
    }
  };

  return (
    <div className="create-profile">
      <div className="main">
        <form onSubmit={handleSubmit}>
          {/* Account Type Selection */}
          <label>Account Type</label>
          <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
            <option value="regular">Regular Account</option>
            <option value="administrator">Administrator Account</option>
          </select>

          {/* Dynamic Description */}
          {accountType === 'regular' && (
            <p>
              <strong>Service Account:</strong> Search, post, and request for jobs and/or services.
            </p>
          )}
          {accountType === 'administrator' && (
            <p>
              <strong>Administrator Account:</strong> Manage your own jobs and service listings. Be your own Boss
            </p>
          )}

          {/* First Name Field */}
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            required
          />

          {/* Last Name Field */}
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
            required
          />

          {/* Bio Field */}
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
          />

          {/* Profile Image Upload */}
          <label>Profile Picture</label>
          <div className="profile-picture-container">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-picture" />
            ) : (
              <div className="placeholder">No Image Selected</div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageUpload} />

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

          {/* Contact Number Field */}
          <label>Contact Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your contact number"
          />

          {/* Display Skill Selection for Admins */}
          {accountType === 'administrator' && (
            <>
              <label>Skill</label>
              <select value={skillId || ''} onChange={(e) => setSkillId(e.target.value)} required>
                <option value="">Select a Skill</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>

              {/* Show input for custom skill if "Other" is selected */}
              {skillId === 'other' && (
                <div>
                  <label>Custom Skill</label>
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Enter your custom skill"
                    required
                  />
                </div>
              )}
            </>
          )}

          {/* Social Links */}
          <label>Social Links</label>
          <div className="social-links">
            {['twitter', 'instagram', 'facebook'].map((platform) => (
              <button
                key={platform}
                type="button"
                className="social-button"
                onClick={() => {
                  setCurrentSocialLink(platform as 'twitter' | 'instagram' | 'facebook');
                  setModalVisible(true);
                }}
              >
                <img src={`/icons/${platform}.png`} alt={`${platform} icon`} className="social-icon" />
                {socialLinks[platform as 'twitter' | 'instagram' | 'facebook'] ? 'Connected' : 'Connect'}
              </button>
            ))}
          </div>

          <button type="submit">Save Profile</button>
        </form>
      </div>

      {/* Modal for entering social link */}
      {modalVisible && (
        <div className="modal">
          <h3>Connect Your {currentSocialLink?.toUpperCase()}</h3>
          <input
            type="url"
            placeholder={`Enter ${currentSocialLink} URL`}
            value={socialLinks[currentSocialLink as keyof typeof socialLinks]}
            onChange={(e) =>
              setSocialLinks((prev) => ({
                ...prev,
                [currentSocialLink as keyof typeof socialLinks]: e.target.value,
              }))
            }
          />
          <button onClick={() => setModalVisible(false)}>Save</button>
        </div>
      )}
    </div>
  );
};

export default CreateProfile;
