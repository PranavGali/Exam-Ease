import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ExamContext } from '../../contexts/ExamContext';
import './ExamList.css';

const ExamList = () => {
  const { currentUser } = useContext(AuthContext);
  const { exams, getUserResults } = useContext(ExamContext);
  const [availableExams, setAvailableExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (currentUser) {
      // Get user's exam results
      const results = getUserResults(currentUser.id);
      
      // Get completed exam IDs
      const completedExamIds = results.map(result => result.examId);
      
      // Filter exams into available and completed
      setAvailableExams(exams.filter(exam => !completedExamIds.includes(exam.id)));
      setCompletedExams(exams.filter(exam => completedExamIds.includes(exam.id)));
    }
  }, [currentUser, exams, getUserResults]);
  
  // Filter exams based on search term
  const filteredAvailable = availableExams.filter(exam => 
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCompleted = completedExams.filter(exam => 
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="exam-list-container">
      <h1>Available Exams</h1>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search exams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="exam-sections">
        <div className="exam-section">
          <h2>Available Exams</h2>
          {filteredAvailable.length > 0 ? (
            <div className="exams-grid">
              {filteredAvailable.map(exam => (
                <div key={exam.id} className="exam-card">
                  <h3>{exam.title}</h3>
                  <p>{exam.description}</p>
                  <div className="exam-meta">
                    <span>Duration: {exam.duration} min</span>
                    <span>Questions: {exam.questions.length}</span>
                    <span>Pass: {exam.passingScore}%</span>
                  </div>
                  <Link to={`/exams/${exam.id}`} className="btn-primary">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-exams">No available exams found.</p>
          )}
        </div>
        
        <div className="exam-section">
          <h2>Completed Exams</h2>
          {filteredCompleted.length > 0 ? (
            <div className="exams-grid">
              {filteredCompleted.map(exam => {
                const result = getUserResults(currentUser.id).find(r => r.examId === exam.id);
                return (
                  <div key={exam.id} className="exam-card completed">
                    <h3>{exam.title}</h3>
                    <p>{exam.description}</p>
                    <div className="exam-meta">
                      <span className={result?.passed ? 'passed' : 'failed'}>
                        {result?.passed ? 'Passed' : 'Failed'}
                      </span>
                      <span>Score: {result?.score}%</span>
                    </div>
                    <div className="exam-buttons">
                      <Link to={`/results/${result?.id}`} className="btn-secondary">
                        View Results
                      </Link>
                      <Link to={`/exams/${exam.id}`} className="btn-outline">
                        Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-exams">No completed exams found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamList;
