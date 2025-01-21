// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./messages.css";

// type Message = {
//   id: number;
//   sender_id: number;
//   recipient_id: number;
//   content: string;
//   created_at: string;
//   label?: string;
//   listing_id?: number;
//   listing_title?: string;
//   listing_description?: string;
//   reply_to_id?: number; // New field for replies
// };

// const MessagesPage: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [sentMessages, setSentMessages] = useState<Message[]>([]);
//   const [currentTab, setCurrentTab] = useState<string>("inbox"); // "inbox" | "sent" | "create"
//   const [loading, setLoading] = useState<boolean>(true);
//   const [recipientId, setRecipientId] = useState<string>("");
//   const [content, setContent] = useState<string>("");
//   const [label, setLabel] = useState<string>("");
//   const [replyToMessage, setReplyToMessage] = useState<Message | null>(null); // Track message being replied to
//   const [replyContent, setReplyContent] = useState<string>(""); // For reply text
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           alert("You need to log in to view your messages.");
//           navigate("/login");
//           return;
//         }

//         const inboxResponse = await fetch("http://localhost:5000/messages/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const sentResponse = await fetch("http://localhost:5000/messages/sent", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (inboxResponse.status === 200 && sentResponse.status === 200) {
//           const inboxData = await inboxResponse.json();
//           const sentData = await sentResponse.json();
//           setMessages(inboxData);
//           setSentMessages(sentData);
//         } else {
//           alert("Failed to fetch messages.");
//         }
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();
//   }, [navigate]);

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("You need to log in to send messages.");
//         navigate("/login");
//         return;
//       }

//       // Validate fields before sending
//     if (replyToMessage && !replyContent) {
//       alert("Reply content cannot be empty.");
//       return;
//     }

//     if (!replyToMessage && (!recipientId || !content)) {
//       alert("Recipient ID and content are required for new messages.");
//       return;
//     }
  
//       // Define the body
//       const body = replyToMessage
//       ? {
//           reply_to_id: replyToMessage.id, // ID of the message being replied to
//           recipient_id: String(replyToMessage.sender_id), // Original sender becomes the recipient
//           content: replyContent, // The content of the reply
//           listing_id: replyToMessage.listing_id, // Listing ID from the original message
//         }
//       : {
//           recipient_id: recipientId, // For new messages
//           content,
//           label,
//         };
  
//         console.log("Request body:", body); // Debugging log

//         // Use different routes based on whether it's a reply or a new message
//         const endpoint = replyToMessage
//           ? "http://localhost:5000/messages/reply"
//           : "http://localhost:5000/messages/create";
    
//         const response = await fetch(endpoint, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(body), // Convert to JSON string
//       });
  
//       if (response.status === 201) {
//         alert("Message sent successfully!");
//         setRecipientId("");
//         setContent("");
//         setLabel("");
//         setReplyContent("");
//         setReplyToMessage(null); // Reset the reply state
//         setCurrentTab("sent"); // Switch to "Sent" tab
//       } else {
//         const errorData = await response.json(); // Parse error response
//         alert(`Failed to send message: ${errorData.error}`);
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   if (loading) {
//     return <div className="messages-page">Loading messages...</div>;
//   }

//   return (
//     <div className="messages-page">
//   <button className="nav-home-btn" onClick={() => navigate("/")}>
//     Home
//   </button>
//   {/* Header */}
//   <header className="messages-header">
//     <h1>Messages</h1>
//   </header>

//   {/* Tabs */}
//   <div className="messages-tabs">
//     <button
//       onClick={() => setCurrentTab("inbox")}
//       className={currentTab === "inbox" ? "active" : ""}
//     >
//       Inbox
//     </button>
//     <button
//       onClick={() => setCurrentTab("sent")}
//       className={currentTab === "sent" ? "active" : ""}
//     >
//       Sent
//     </button>
//     <button
//       onClick={() => setCurrentTab("create")}
//       className={currentTab === "create" ? "active" : ""}
//     >
//       Create Message
//     </button>
//   </div>

//   {/* Content */}
//   <div className="messages-content">
//     {currentTab === "inbox" && (
//       <>
//         <h2>Inbox</h2>
//         {messages.length > 0 ? (
//           <ul className="messages-list">
//             {messages.map((message) => (
//               <li key={message.id} className="message-item">
//                 <p>
//                   <strong>From User ID:</strong> {message.sender_id}
//                 </p>
//                 <p>
//                   <strong>Listing Title:</strong> {message.listing_title}
//                 </p>
//                 <p>
//                   <strong>Listing Description:</strong>{" "}
//                   {message.listing_description}
//                 </p>
//                 <p>
//                   <strong>Message:</strong> {message.content}
//                 </p>
//                 <p className="message-time">
//                   <strong>Received At:</strong>{" "}
//                   {new Date(message.created_at).toLocaleString()}
//                 </p>
//                 <button
//                   onClick={() => {
//                     if (message) {
//                       setReplyToMessage(message); // Set the original message being replied to
//                       setReplyContent(""); // Clear previous reply content
//                     }
//                   }}
//                 >
//                   Reply
//                 </button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No messages found.</p>
//         )}
//       </>
//     )}

//     {currentTab === "sent" && (
//       <>
//         <h2>Sent Messages</h2>
//         {sentMessages.length > 0 ? (
//           <ul className="messages-list">
//             {sentMessages.map((message) => (
//               <li key={message.id} className="message-item">
//                 <p>
//                   <strong>To User ID:</strong> {message.recipient_id}
//                 </p>
//                 <p>
//                   <strong>Message:</strong> {message.content}
//                 </p>
//                 <p className="message-time">
//                   <strong>Sent At:</strong>{" "}
//                   {new Date(message.created_at).toLocaleString()}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No sent messages found.</p>
//         )}
//       </>
//     )}

//     {(currentTab === "create" || replyToMessage) && (
//       <div className="create-message">
//         <h2>
//           {replyToMessage
//             ? `Replying to Message ID: ${replyToMessage.id}`
//             : "Create Message"}
//         </h2>
//         <form onSubmit={handleSendMessage} className="create-message-form">
//           {!replyToMessage && (
//             <>
//               <label>To (User ID)</label>
//               <input
//                 type="text"
//                 value={recipientId}
//                 onChange={(e) => setRecipientId(e.target.value)}
//                 required
//               />
//             </>
//           )}

//           {replyToMessage ? (
//             <>
//               <label>Reply Content</label>
//               <textarea
//                 value={replyContent}
//                 onChange={(e) => setReplyContent(e.target.value)} // Update replyContent state
//                 placeholder="Write your reply..."
//                 required // Enforce that a reply must be entered
//               ></textarea>
//             </>
//           ) : (
//             <>
//               <label>Message</label>
//               <textarea
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 placeholder="Write your message..."
//                 required
//               ></textarea>

//               <label>Label (Optional)</label>
//               <input
//                 type="text"
//                 value={label}
//                 onChange={(e) => setLabel(e.target.value)}
//                 placeholder="e.g., Job Inquiry"
//               />
//             </>
//           )}

//           <button type="submit">
//             Send {replyToMessage ? "Reply" : "Message"}
//           </button>
//         </form>
//       </div>
//     )}
//   </div>
// </div>

//   );
// };

// export default MessagesPage;

//  TESTING FORMAT FOR NO TOKEN AUTH AND NO LOGIN AUTH
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./messages.css";

type Message = {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  created_at: string;
  label?: string;
  listing_id?: number;
  listing_title?: string;
  listing_description?: string;
  reply_to_id?: number; // New field for replies
};

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender_id: 101,
      recipient_id: 1,
      content: "Hello! I’m interested in your listing.",
      created_at: "2025-01-20T10:30:00Z",
      listing_title: "Web Development Project",
      listing_description: "Looking for a skilled frontend developer.",
    },
    {
      id: 2,
      sender_id: 102,
      recipient_id: 1,
      content: "Can we collaborate on this project?",
      created_at: "2025-01-19T14:45:00Z",
      listing_title: "Graphic Design Assistance",
      listing_description: "Need help designing a company logo.",
    },
  ]);
  const [sentMessages, setSentMessages] = useState<Message[]>([
    {
      id: 3,
      sender_id: 1,
      recipient_id: 103,
      content: "I’d like to work on your project.",
      created_at: "2025-01-18T09:15:00Z",
    },
  ]);
  const [currentTab, setCurrentTab] = useState<string>("inbox"); // "inbox" | "sent" | "create"
  const [recipientId, setRecipientId] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null); // Track message being replied to
  const [replyContent, setReplyContent] = useState<string>(""); // For reply text
  const navigate = useNavigate();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields before sending
    if (replyToMessage && !replyContent) {
      alert("Reply content cannot be empty.");
      return;
    }

    if (!replyToMessage && (!recipientId || !content)) {
      alert("Recipient ID and content are required for new messages.");
      return;
    }

    const newMessage: Message = replyToMessage
      ? {
          id: Math.random(), // Mock ID for new replies
          sender_id: 1, // Current user ID
          recipient_id: replyToMessage.sender_id,
          content: replyContent,
          created_at: new Date().toISOString(),
          reply_to_id: replyToMessage.id,
        }
      : {
          id: Math.random(), // Mock ID for new messages
          sender_id: 1, // Current user ID
          recipient_id: parseInt(recipientId),
          content,
          created_at: new Date().toISOString(),
          label,
        };

    // Update the sent messages list
    setSentMessages((prev) => [...prev, newMessage]);

    // Reset form fields
    setRecipientId("");
    setContent("");
    setLabel("");
    setReplyContent("");
    setReplyToMessage(null); // Reset the reply state
    setCurrentTab("sent"); // Switch to "Sent" tab

    alert("Message sent successfully!");
  };

  return (
    <div className="messages-page">
      <button className="nav-home-btn" onClick={() => navigate("/")}>
        Home
      </button>
      <header className="messages-header">
        <h1>Messages</h1>
      </header>
      <div className="messages-tabs">
        <button
          onClick={() => setCurrentTab("inbox")}
          className={currentTab === "inbox" ? "active" : ""}
        >
          Inbox
        </button>
        <button
          onClick={() => setCurrentTab("sent")}
          className={currentTab === "sent" ? "active" : ""}
        >
          Sent
        </button>
        <button
          onClick={() => setCurrentTab("create")}
          className={currentTab === "create" ? "active" : ""}
        >
          Create Message
        </button>
      </div>
      <div className="messages-content">
        {currentTab === "inbox" && (
          <>
            <h2>Inbox</h2>
            {messages.length > 0 ? (
              <ul className="messages-list">
                {messages.map((message) => (
                  <li key={message.id} className="message-item">
                    <p>
                      <strong>From User ID:</strong> {message.sender_id}
                    </p>
                    <p>
                      <strong>Listing Title:</strong> {message.listing_title}
                    </p>
                    <p>
                      <strong>Listing Description:</strong>{" "}
                      {message.listing_description}
                    </p>
                    <p>
                      <strong>Message:</strong> {message.content}
                    </p>
                    <p className="message-time">
                      <strong>Received At:</strong>{" "}
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                    <button
                      onClick={() => {
                        setReplyToMessage(message); // Set the message being replied to
                        setReplyContent(""); // Clear previous reply content
                      }}
                    >
                      Reply
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No messages found.</p>
            )}
          </>
        )}

        {currentTab === "sent" && (
          <>
            <h2>Sent Messages</h2>
            {sentMessages.length > 0 ? (
              <ul className="messages-list">
                {sentMessages.map((message) => (
                  <li key={message.id} className="message-item">
                    <p>
                      <strong>To User ID:</strong> {message.recipient_id}
                    </p>
                    <p>
                      <strong>Message:</strong> {message.content}
                    </p>
                    <p className="message-time">
                      <strong>Sent At:</strong>{" "}
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No sent messages found.</p>
            )}
          </>
        )}

        {(currentTab === "create" || replyToMessage) && (
          <div className="create-message">
            <h2>
              {replyToMessage
                ? `Replying to Message ID: ${replyToMessage.id}`
                : "Create Message"}
            </h2>
            <form onSubmit={handleSendMessage} className="create-message-form">
              {!replyToMessage && (
                <>
                  <label>To (User ID)</label>
                  <input
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    required
                  />
                </>
              )}

              {replyToMessage ? (
                <>
                  <label>Reply Content</label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    required
                  ></textarea>
                </>
              ) : (
                <>
                  <label>Message</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your message..."
                    required
                  ></textarea>

                  <label>Label (Optional)</label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g., Job Inquiry"
                  />
                </>
              )}

              <button type="submit">
                Send {replyToMessage ? "Reply" : "Message"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
