import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ExamContext } from '../../contexts/ExamContext';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { exams, getUserResults } = useContext(ExamContext);
  const [userResults, setUserResults] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  
  useEffect(() => {
    if (currentUser) {
      // Get user's exam results
      const results = getUserResults(currentUser.id);
      setUserResults(results);
      
      // Get completed exam IDs
      const completedExamIds = results.map(result => result.examId);
      
      // Filter exams into upcoming and completed
      setUpcomingExams(exams.filter(exam => !completedExamIds.includes(exam.id)));
      setCompletedExams(exams.filter(exam => completedExamIds.includes(exam.id)));
    }
  }, [currentUser, exams, getUserResults]);
  
  // Calculate average score
  const averageScore = userResults.length > 0
    ? Math.round(userResults.reduce((acc, result) => acc + result.score, 0) / userResults.length)
    : 0;
  
  // Get recent results (last 3)
  const recentResults = [...userResults]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 3);
  
  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>
      <p className="welcome-message">Welcome back, {currentUser?.name}!</p>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Exams Completed</h3>
          <p className="stat-value">{userResults.length}</p>
        </div>
        
        <div className="stat-card">
          <h3>Average Score</h3>
          <p className="stat-value">{averageScore}%</p>
        </div>
        
        <div className="stat-card">
          <h3>Exams Available</h3>
          <p className="stat-value">{upcomingExams.length}</p>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Available Exams</h2>
          {upcomingExams.length > 0 ? (
            <div className="exam-list">
              {upcomingExams.map(exam => (
                <div key={exam.id} className="exam-card">
                  <h3>{exam.title}</h3>
                  <p>{exam.description}</p>
                  <div className="exam-details">
                    <span>Duration: {exam.duration} minutes</span>
                    <span>Questions: {exam.questions.length}</span>
                  </div>
                  <Link to={`/exams/${exam.id}`} className="btn-primary">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No exams available at the moment.</p>
          )}
        </div>
        
        <div className="dashboard-section">
          <h2>Recent Results</h2>
          {recentResults.length > 0 ? (
            <div className="results-list">
              {recentResults.map(result => {
                const exam = exams.find(e => e.id === result.examId);
                return (
                  <div key={result.id} className="result-card">
                    <h3>{exam?.title}</h3>
                    <div className="result-details">
                      <span className={result.passed ? 'passed' : 'failed'}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </span>
                      <span>Score: {result.score}%</span>
                    </div>
                    <p>Taken on: {new Date(result.submittedAt).toLocaleDateString()}</p>
                    <Link to={`/results/${result.id}`} className="btn-secondary">
                      View Details
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">You haven't taken any exams yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
