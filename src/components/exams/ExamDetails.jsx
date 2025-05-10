import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ExamContext } from '../../contexts/ExamContext';
import './ExamDetails.css';

const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { getExam, getUserResults } = useContext(ExamContext);
  
  const [exam, setExam] = useState(null);
  const [userResult, setUserResult] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const examData = getExam(id);
    if (examData) {
      setExam(examData);
      
      // Check if user has already taken this exam
      if (currentUser) {
        const results = getUserResults(currentUser.id);
        const result = results.find(r => r.examId === id);
        if (result) {
          setUserResult(result);
        }
      }
      
      setLoading(false);
    } else {
      navigate('/404');
    }
  }, [id, getExam, navigate, currentUser, getUserResults]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="exam-details-container">
      <div className="exam-header">
        <h1>{exam.title}</h1>
        {userResult ? (
          <div className={`exam-status ${userResult.passed ? 'passed' : 'failed'}`}>
            {userResult.passed ? 'Passed' : 'Failed'}
          </div>
        ) : (
          <div className="exam-status available">Available</div>
        )}
      </div>
      
      <div className="exam-info-card">
        <div className="exam-description">
          <p>{exam.description}</p>
        </div>
        
        <div className="exam-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Duration</span>
            <span className="meta-value">{exam.duration} minutes</span>
          </div>
          
          <div className="meta-item">
            <span className="meta-label">Questions</span>
            <span className="meta-value">{exam.questions.length}</span>
          </div>
          
          <div className="meta-item">
            <span className="meta-label">Passing Score</span>
            <span className="meta-value">{exam.passingScore}%</span>
          </div>
          
          <div className="meta-item">
            <span className="meta-label">Created</span>
            <span className="meta-value">{new Date(exam.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        {userResult ? (
          <div className="exam-result-summary">
            <h3>Your Result</h3>
            <div className="result-details">
              <div className="result-item">
                <span className="result-label">Score</span>
                <span className="result-value">{userResult.score}%</span>
              </div>
              
              <div className="result-item">
                <span className="result-label">Date Taken</span>
                <span className="result-value">{new Date(userResult.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="exam-actions">
              <Link to={`/results/${userResult.id}`} className="btn-primary">
                View Detailed Results
              </Link>
            </div>
          </div>
        ) : (
          <div className="exam-actions">
            <Link to={`/exams/${id}/take`} className="btn-primary">
              Start Exam
            </Link>
            <Link to="/exams" className="btn-secondary">
              Back to Exams
            </Link>
          </div>
        )}
      </div>
      
      <div className="exam-content-preview">
        <h2>Exam Overview</h2>
        
        <div className="question-types">
          <div className="question-type">
            <h3>Multiple Choice Questions</h3>
            <p>{exam.questions.filter(q => q.type === 'mcq').length} questions</p>
          </div>
          
          <div className="question-type">
            <h3>Essay Questions</h3>
            <p>{exam.questions.filter(q => q.type === 'essay').length} questions</p>
          </div>
        </div>
        
        <div className="exam-instructions">
          <h3>Instructions</h3>
          <ul>
            <li>You have {exam.duration} minutes to complete this exam.</li>
            <li>The exam consists of {exam.questions.length} questions.</li>
            <li>You need to score at least {exam.passingScore}% to pass.</li>
            <li>Once you start the exam, you cannot pause or restart it.</li>
            <li>Ensure you have a stable internet connection before starting.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
