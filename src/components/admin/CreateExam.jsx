import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ExamContext } from '../../contexts/ExamContext';
import { v4 as uuidv4 } from 'uuid';
import './ExamForm.css';

const CreateExam = () => {
  const { currentUser } = useContext(AuthContext);
  const { createExam } = useContext(ExamContext);
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
    if (!currentQuestion.text.trim()) {
      return setError('Question text is required');
    }

    if (currentQuestion.type === 'mcq') {
      if (currentQuestion.options.some(option => !option.trim())) {
        return setError('All options must be filled');
      }

      if (!currentQuestion.correctAnswer) {
        return setError('Please select the correct answer');
      }
    }

    const newQuestion = {
      ...currentQuestion,
      id: uuidv4()
    };

    setExamData({
      ...examData,
      questions: [...examData.questions, newQuestion]
    });

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

    if (!examData.title.trim()) {
      return setError('Exam title is required');
    }

    if (examData.questions.length === 0) {
      return setError('Exam must have at least one question');
    }

    try {
      createExam({
        ...examData,
        createdBy: currentUser.id
      });

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="exam-form-container">
      <h1>Create New Exam</h1>

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
                placeholder="Enter the question here"
                rows="3"
              ></textarea>
            </div>

            {currentQuestion.type === 'mcq' && (
              <>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="form-group">
                    <label htmlFor={`option${index}`}>Option {index + 1}</label>
                    <input
                      type="text"
                      id={`option${index}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}

                <div className="form-group">
                  <label htmlFor="correctAnswer">Correct Answer</label>
                  <select
                    id="correctAnswer"
                    name="correctAnswer"
                    value={currentQuestion.correctAnswer}
                    onChange={handleQuestionChange}
                  >
                    <option value="">--Select Correct Option--</option>
                    {currentQuestion.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option || `Option ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="points">Points</label>
              <input
                type="number"
                id="points"
                name="points"
                value={currentQuestion.points}
                onChange={handleQuestionChange}
                min="1"
              />
            </div>

            <button type="button" className="btn-primary" onClick={addQuestion}>
              Add Question
            </button>
          </div>
        </div>

        <button type="submit" className="btn-success">
          Create Exam
        </button>
      </form>
    </div>
  );
};

export default CreateExam;
