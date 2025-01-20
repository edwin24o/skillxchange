import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./listingdetail.css";

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<any>(null);
  const [messageContent, setMessageContent] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/listings/${id}`);
        const data = await response.json();
        setListing(data);
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
        setMessageContent(""); // Clear the message input
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
    return <p>Loading listing details...</p>;
  }

  return (
    <div className="listing-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Go Back
      </button>
      <h1>{listing.title}</h1>
      <p>
        <strong>Description:</strong> {listing.description}
      </p>
      <p>
        <strong>Location:</strong> {listing.location}
      </p>
      <p>
        <strong>Type:</strong> {listing.type}
      </p>
      {listing.type === "exchange" && (
        <>
          <p>
            <strong>Offered Skill:</strong> {listing.offered_skill}
          </p>
          <p>
            <strong>Wanted Skill:</strong> {listing.wanted_skill}
          </p>
        </>
      )}

      <div className="message-form">
        <h2>Send a Message</h2>
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
