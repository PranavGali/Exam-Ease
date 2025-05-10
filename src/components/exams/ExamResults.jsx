import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ExamContext } from '../../contexts/ExamContext';
import './ExamResults.css';

const ExamResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { getResult, getExam } = useContext(ExamContext);
  
  const [result, setResult] = useState(null);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const resultData = getResult(id);
    
    if (resultData) {
      // Check if this result belongs to the current user
      if (resultData.userId !== currentUser.id) {
        navigate('/dashboard');
        return;
      }
      
      setResult(resultData);
      
      // Get the exam
      const examData = getExam(resultData.examId);
      if (examData) {
        setExam(examData);
      }
      
      setLoading(false);
    } else {
      navigate('/404');
    }
  }, [id, getResult, getExam, navigate, currentUser]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="exam-results-container">
      <div className="results-header">
        <h1>Exam Results</h1>
        <div className={`result-badge ${result.passed ? 'passed' : 'failed'}`}>
          {result.passed ? 'Passed' : 'Failed'}
        </div>
      </div>
      
      <div className="results-summary-card">
        <h2>{exam.title}</h2>
        
        <div className="results-meta">
          <div className="result-meta-item">
            <span className="meta-label">Your Score</span>
            <span className="meta-value">{result.score}%</span>
          </div>
          
          <div className="result-meta-item">
            <span className="meta-label">Passing Score</span>
            <span className="meta-value">{exam.passingScore}%</span>
          </div>
          
          <div className="result-meta-item">
            <span className="meta-label">Time Spent</span>
            <span className="meta-value">{formatTime(result.timeSpent)}</span>
          </div>
          
          <div className="result-meta-item">
            <span className="meta-label">Date</span>
            <span className="meta-value">{new Date(result.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="score-visualization">
          <div className="score-bar">
            <div 
              className="score-fill"
              style={{ 
                width: `${result.score}%`,
                backgroundColor: result.passed ? 'var(--success-color)' : 'var(--danger-color)'
              }}
            ></div>
            <div 
              className="passing-line"
              style={{ left: `${exam.passingScore}%` }}
            ></div>
          </div>
          <div className="score-labels">
            <span>0%</span>
            <span className="passing-label">Passing ({exam.passingScore}%)</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      <div className="results-details-card">
        <h2>Question Review</h2>
        
        {exam.questions.map((question, index) => {
          const userAnswer = result.answers[question.id];
          const isCorrect = question.type === 'mcq' ? userAnswer === question.correctAnswer : null;
          
          return (
            <div 
              key={question.id} 
              className={`question-review ${
                question.type === 'mcq' 
                  ? (isCorrect ? 'correct' : 'incorrect') 
                  : 'essay'
              }`}
            >
              <div className="question-number">Question {index + 1}</div>
              
              <div className="question-content">
                <h3>{question.text}</h3>
                
                {question.type === 'mcq' ? (
                  <div className="mcq-review">
                    <div className="options-list">
                      {question.options.map((option, i) => (
                        <div 
                          key={i} 
                          className={`option-item ${
                            option === userAnswer 
                              ? (isCorrect ? 'selected-correct' : 'selected-incorrect') 
                              : option === question.correctAnswer 
                                ? 'correct-answer' 
                                : ''
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    
                    <div className="answer-feedback">
                      {isCorrect ? (
                        <div className="correct-feedback">
                          <span className="feedback-icon">✓</span>
                          Correct Answer
                        </div>
                      ) : (
                        <div className="incorrect-feedback">
                          <span className="feedback-icon">✗</span>
                          Incorrect Answer
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="essay-review">
                    <h4>Your Answer:</h4>
                    <div className="essay-answer">
                      {userAnswer || <em>No answer provided</em>}
                    </div>
                    
                    <div className="essay-note">
                      <p>Essay questions are typically graded manually by an instructor.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="results-actions">
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
        <Link to="/exams" className="btn-secondary">
          View All Exams
        </Link>
      </div>
    </div>
  );
};

export default ExamResults;
