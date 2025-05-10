import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ExamContext } from '../../contexts/ExamContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { exams, results } = useContext(ExamContext);
  const [adminExams, setAdminExams] = useState([]);
  const [examStats, setExamStats] = useState([]);
  
  useEffect(() => {
    if (currentUser) {
      // Filter exams created by this admin
      const filteredExams = exams.filter(exam => exam.createdBy === currentUser.id);
      setAdminExams(filteredExams);
      
      // Calculate stats for each exam
      const stats = filteredExams.map(exam => {
        const examResults = results.filter(result => result.examId === exam.id);
        const totalAttempts = examResults.length;
        const passCount = examResults.filter(result => result.passed).length;
        const passRate = totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;
        const avgScore = totalAttempts > 0 
          ? Math.round(examResults.reduce((acc, result) => acc + result.score, 0) / totalAttempts) 
          : 0;
          
        return {
          examId: exam.id,
          examTitle: exam.title,
          totalAttempts,
          passCount,
          passRate,
          avgScore
        };
      });
      
      setExamStats(stats);
    }
  }, [currentUser, exams, results]);
  
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <Link to="/admin/exams/create" className="btn-primary">
          Create New Exam
        </Link>
      </div>
      
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Exams</h3>
          <p className="stat-value">{adminExams.length}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Attempts</h3>
          <p className="stat-value">
            {results.filter(result => 
              adminExams.some(exam => exam.id === result.examId)
            ).length}
          </p>
        </div>
        
        <div className="stat-card">
          <h3>Average Pass Rate</h3>
          <p className="stat-value">
            {examStats.length > 0 
              ? Math.round(examStats.reduce((acc, stat) => acc + stat.passRate, 0) / examStats.length)
              : 0}%
          </p>
        </div>
      </div>
      
      <div className="admin-section">
        <h2>Your Exams</h2>
        {adminExams.length > 0 ? (
          <div className="admin-exam-list">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Exam Title</th>
                  <th>Created</th>
                  <th>Questions</th>
                  <th>Attempts</th>
                  <th>Pass Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminExams.map(exam => {
                  const stat = examStats.find(s => s.examId === exam.id);
                  return (
                    <tr key={exam.id}>
                      <td>{exam.title}</td>
                      <td>{new Date(exam.createdAt).toLocaleDateString()}</td>
                      <td>{exam.questions.length}</td>
                      <td>{stat?.totalAttempts || 0}</td>
                      <td>{stat?.passRate || 0}%</td>
                      <td className="action-buttons">
                        <Link to={`/admin/exams/${exam.id}/edit`} className="btn-edit">
                          Edit
                        </Link>
                        <Link to={`/exams/${exam.id}`} className="btn-view">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-exams">
            <p>You haven't created any exams yet.</p>
            <Link to="/admin/exams/create" className="btn-primary">
              Create Your First Exam
            </Link>
          </div>
        )}
      </div>
      
      {adminExams.length > 0 && (
        <div className="admin-section">
          <h2>Exam Performance</h2>
          <div className="exam-stats-grid">
            {examStats.map(stat => (
              <div key={stat.examId} className="exam-stat-card">
                <h3>{stat.examTitle}</h3>
                <div className="stat-details">
                  <div className="stat-item">
                    <span className="stat-label">Attempts:</span>
                    <span className="stat-number">{stat.totalAttempts}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Pass Rate:</span>
                    <span className="stat-number">{stat.passRate}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Avg Score:</span>
                    <span className="stat-number">{stat.avgScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
