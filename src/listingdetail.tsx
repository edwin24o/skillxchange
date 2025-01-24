import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./listingdetail.css";

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<any>(null);
  const [messageContent, setMessageContent] = useState<string>("");
  const [userName, setUserName] = useState<string>("Anonymous");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/listings/${id}`);
        const data = await response.json();

        setListing(data);

        if (data.user_id) {
          const userResponse = await fetch(`http://localhost:5000/users/${data.user_id}`);
          const userData = await userResponse.json();
          setUserName(userData.full_name || "Anonymous");
        }
      } catch (error) {
        console.error("Error fetching listing details:", error);
      }
    };

    fetchListingDetails();
  }, [id]);

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in to send messages.");
        navigate("/login");
        return;
      }

      const messageData = {
        recipient_id: listing.user_id,
        listing_id: listing.id,
        content: messageContent,
      };

      const response = await fetch("http://localhost:5000/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (response.status === 201) {
        alert("Message sent successfully!");
        setMessageContent("");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (!listing) {
    return <p className="loading-message">Loading listing details...</p>;
  }

  return (
    <div className="listing-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Go Back
      </button>
      <div className="listing-header">
        <h1>{listing.title}</h1>
        {listing.image && (
          <img
            src={`http://localhost:5000${listing.image}`}
            alt={listing.title}
            className="listing-image"
          />
        )}
      </div>
      <div className="listing-info">
        <p>
          <strong>Description:</strong> {listing.description || "No description provided"}
        </p>
        <p>
          <strong>Location:</strong> {`${listing.city}, ${listing.state}, ${listing.zip_code}`}
        </p>
        <p>
          <strong>Type:</strong> {listing.type}
        </p>
        {listing.type === "exchange" && (
          <>
            <p>
              <strong>Offered Skill:</strong> {listing.offered_skill || "N/A"}
            </p>
            <p>
              <strong>Wanted Skill:</strong> {listing.wanted_skill || "N/A"}
            </p>
          </>
        )}
        <p>
          <strong>Posted By:</strong> {userName}
        </p>
      </div>

      <div className="message-form">
        <h1>Send a Message</h1>
        <textarea
          placeholder="Write your message here..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
    </div>
  );
};

export default ListingDetail;
