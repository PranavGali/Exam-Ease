import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ExamContext } from '../../contexts/ExamContext';
import { v4 as uuidv4 } from 'uuid';
import './ExamForm.css';

const EditExam = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const { getExam, updateExam, deleteExam } = useContext(ExamContext);
  const navigate = useNavigate();
  
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 30,
    passingScore: 70,
    questions: []
  });
  
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'mcq',
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 10
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const exam = getExam(id);
    if (exam) {
      setExamData(exam);
      setLoading(false);
    } else {
      navigate('/404');
    }
  }, [id, getExam, navigate]);
  
  const handleExamChange = e => {
    setExamData({
      ...examData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleQuestionChange = e => {
    setCurrentQuestion({
      ...currentQuestion,
      [e.target.name]: e.target.value
    });
  };
  
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions
    });
  };
  
  const addQuestion = () => {
    // Validate question
    if (!currentQuestion.text.trim()) {
      return setError('Question text is required');
    }
    
    if (currentQuestion.type === 'mcq') {
      // Validate MCQ options
      if (currentQuestion.options.some(option => !option.trim())) {
        return setError('All options must be filled');
      }
      
      if (!currentQuestion.correctAnswer) {
        return setError('Please select the correct answer');
      }
    }
    
    // Add question to exam
    const newQuestion = {
      ...currentQuestion,
      id: uuidv4()
    };
    
    setExamData({
      ...examData,
      questions: [...examData.questions, newQuestion]
    });
    
    // Reset current question
    setCurrentQuestion({
      type: 'mcq',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 10
    });
    
    setError('');
  };
  
  const removeQuestion = (id) => {
    setExamData({
      ...examData,
      questions: examData.questions.filter(q => q.id !== id)
    });
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    
    // Validate exam
    if (!examData.title.trim()) {
      return setError('Exam title is required');
    }
    
    if (examData.questions.length === 0) {
      return setError('Exam must have at least one question');
    }
    
    try {
      // Update exam
      updateExam(id, examData);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      deleteExam(id);
      navigate('/admin');
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="exam-form-container">
      <h1>Edit Exam</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Exam Details</h2>
          
          <div className="form-group">
            <label htmlFor="title">Exam Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={examData.title}
              onChange={handleExamChange}
              placeholder="e.g., JavaScript Fundamentals"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={examData.description}
              onChange={handleExamChange}
              placeholder="Describe what this exam is about"
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration (minutes)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={examData.duration}
                onChange={handleExamChange}
                min="5"
                max="180"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="passingScore">Passing Score (%)</label>
              <input
                type="number"
                id="passingScore"
                name="passingScore"
                value={examData.passingScore}
                onChange={handleExamChange}
                min="1"
                max="100"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Questions</h2>
          
          {examData.questions.length > 0 ? (
            <div className="questions-list">
              {examData.questions.map((question, index) => (
                <div key={question.id} className="question-item">
                  <div className="question-header">
                    <h3>Question {index + 1}</h3>
                    <button 
                      type="button" 
                      className="btn-danger"
                      onClick={() => removeQuestion(question.id)}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <p><strong>Type:</strong> {question.type === 'mcq' ? 'Multiple Choice' : 'Essay'}</p>
                  <p><strong>Points:</strong> {question.points}</p>
                  <p><strong>Question:</strong> {question.text}</p>
                  
                  {question.type === 'mcq' && (
                    <div className="question-options">
                      <p><strong>Options:</strong></p>
                      <ul>
                        {question.options.map((option, i) => (
                          <li key={i} className={option === question.correctAnswer ? 'correct-option' : ''}>
                            {option} {option === question.correctAnswer && '(Correct)'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-questions">No questions added yet.</p>
          )}
          
          <div className="add-question-form">
            <h3>Add New Question</h3>
            
            <div className="form-group">
              <label htmlFor="questionType">Question Type</label>
              <select
                id="questionType"
                name="type"
                value={currentQuestion.type}
                onChange={handleQuestionChange}
              >
                <option value="mcq">Multiple Choice</option>
                <option value="essay">Essay</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="questionText">Question Text</label>
              <textarea
                id="questionText"
                name="text"
                value={currentQuestion.text}
                onChange={handleQuestionChange}
                placeholder="Enter your question here"
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="points">Points</label>
              <input
                type="number"
                id="points"
                name="points"
                value={currentQuestion.points}
                onChange={handleQuestionChange}
                min="1"
                max="100"
              />
            </div>
            
            {currentQuestion.type === 'mcq' && (
              <div className="form-group">
                <label>Options</label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name="correctAnswer"
                      value={option}
                      checked={currentQuestion.correctAnswer === option}
                      onChange={() => setCurrentQuestion({
                        ...currentQuestion,
                        correctAnswer: option
                      })}
                      disabled={!option.trim()}
                    />
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
            
            <button 
              type="button" 
              className="btn-primary"
              onClick={addQuestion}
            >
              Add Question
            </button>
          </div>
        </div>
        
        <div className="form-buttons">
          <button 
            type="button" 
            className="btn-danger"
            onClick={handleDelete}
          >
            Delete Exam
          </button>
          
          <button 
            type="submit" 
            className="btn-success"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExam;
