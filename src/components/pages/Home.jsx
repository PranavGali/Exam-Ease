import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { currentUser, isAdmin } = useContext(AuthContext);

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to ExamPro</h1>
        <p>A modern online examination platform for students and educators</p>
        
        {!currentUser ? (
          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/register" className="btn-secondary">Register</Link>
          </div>
        ) : (
          <div className="hero-buttons">
            {isAdmin() ? (
              <Link to="/admin" className="btn-primary">Admin Dashboard</Link>
            ) : (
              <Link to="/dashboard" className="btn-primary">Student Dashboard</Link>
            )}
            <Link to="/exams" className="btn-secondary">View Exams</Link>
          </div>
        )}
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>For Students</h3>
          <ul>
            <li>Take exams from anywhere</li>
            <li>Get instant results and feedback</li>
            <li>Track your progress over time</li>
            <li>Practice with previous exams</li>
          </ul>
        </div>
        
        <div className="feature-card">
          <h3>For Educators</h3>
          <ul>
            <li>Create custom exams easily</li>
            <li>Build question banks</li>
            <li>Set time limits and passing scores</li>
            <li>Review detailed analytics</li>
          </ul>
        </div>
        
        <div className="feature-card">
          <h3>Security Features</h3>
          <ul>
            <li>Randomized questions</li>
            <li>Time restrictions</li>
            <li>Anti-cheating mechanisms</li>
            <li>Secure login system</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
