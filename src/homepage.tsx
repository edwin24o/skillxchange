import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css'; // Assuming the CSS is adapted and saved as home.css

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by verifying the presence of a token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to the homepage
  };

  return (
    <div>
      <header>
        <div className="wrapper">
        <nav className="anim">
            <div className="logo">
              <img src="/src/images/skillx.png" alt="Logo" width="130px" />
              <p className="anim">show GRIT</p>
            </div>
            <ul>
              {/* Show login/signup if not logged in */}
              {!isLoggedIn ? (
                <li>
                  <button onClick={() => navigate('/login')} className="btn dark">
                    Login/Signup
                  </button>
                </li>
              ) : (
                // Show the navigation menu and logout button if logged in
                <>
                  <li>
                    <button onClick={() => navigate('/listings/default')}>Xchange</button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/aboutus')}>About Us</button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/listings/create')}>Posts</button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/profile')}>Profile</button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/messages')}>Messages</button>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="btn dark">
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <div className="hero-section">
            <div className="left">
              <h1 className="anim">
                Let your skills define<br />
                You
              </h1>
             
            </div>
            <div className="right">
              <img src="img/testimonials.webp" alt="Testimonials" width="600px" className="anim" />
            </div>
            <div className="state-cards">
              <div className="state-card state-map">
                <div>
                  <h3 className="anim">Available In</h3>
                  <p className="anim">50 States</p>
                </div>
              </div>
              <div className="state-card overall-rating">
                <div>
                  <h3 className="anim">4.8</h3>
                  <i className="bx bx-star"></i>
                </div>
                <p className="anim">Overall rating by our customers</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className="testimonials-section">
        <div className="left">
          <div className="testimonial-card">
            <div className="content">This is a great resource to use for any independent contractors.</div>
            <div className="info">
              <h4>Marc Brown</h4>
              <p className="company">Contractor, St.Louis</p>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="content">Amazing Work! Well done!</div>
            <div className="info">
              <h4>Jane Cooper</h4>
              <p className="company">Weilder, Denver</p>
            </div>
          </div>
        </div>
        <div className="right">
          <h2>What our contractors say</h2>
          <p>
            All contractors get access to portfolio database and also the ability to work their way UP.
          </p>
          <p>Network with fellow contractors with our 24/7 database build and connect.</p>
          <button className="btn light desktop-btn" onClick={() => navigate('/contact')}>
            Contact Us
          </button>
        </div>
      </section>
      <footer>
        <div className="wrapper">
          <p className="copyright">This website is developed by SkillXChange © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
