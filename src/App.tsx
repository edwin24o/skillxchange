// // App.tsx
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import './App.css';
// import SignUp from './signup'; // Import the SignUp component
// import Login from './login'; // Import the Login component
// import ProfilePage from './profilepage';
// import CreateProfile from './createprofile';
// // import HomePage from './HomePage';


// const App: React.FC = () => {
//   return (
//     <Router>
//       <div className="main">
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/profile/createprofile" element={<CreateProfile />} />  {/* Profile creation page */}
//           <Route path="/profile" element={<ProfilePage />} />           {/* Profile view page */}
//           <Route path="/" element={<Navigate to="/login" />} />         {/* Redirect to login by default */}
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './signup';
import Login from './login';
import ProfilePage from './profilepage';
import CreateProfile from './createprofile';
import HomePage from './homepage';
import SearchListing from './searchlisting';
import PostPage from './postpage';
import AboutUs from './AboutUs';
import Contact from './contact';
import SearchPage from './searchpage';
import ListingDetail from './listingdetail';
import MessagesPage from './messages';


const App: React.FC = () => {
  
  return (
    <Router>
      <div className="main">
      <Routes>
          <Route path="/" element={<HomePage />} /> {/* Default route now points to HomePage */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile/createprofile" element={<CreateProfile />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/listings/default" element={<SearchListing />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/create" element={<PostPage />} />
          <Route path="/searchpage" element={<SearchPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/home" element={<HomePage />} /> {/* Additional explicit home route */}
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;