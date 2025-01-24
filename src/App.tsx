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
          <Route path="/listings" element={<SearchListing />} />
          <Route path="/listings/search" element={<SearchListing />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/create" element={<PostPage />} />
          <Route path="/searchpage" element={<SearchPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;