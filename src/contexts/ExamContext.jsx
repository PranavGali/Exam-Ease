import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load exams and results from localStorage
    const storedExams = localStorage.getItem('exams');
    const storedResults = localStorage.getItem('results');
    
    if (storedExams) {
      setExams(JSON.parse(storedExams));
    } else {
      // Initialize with sample data if none exists
      const sampleExams = [
        {
          id: '1',
          title: 'JavaScript Basics',
          description: 'Test your knowledge of JavaScript fundamentals',
          duration: 30, // minutes
          passingScore: 70,
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          questions: [
            {
              id: '1-1',
              type: 'mcq',
              text: 'Which of the following is not a JavaScript data type?',
              options: ['String', 'Boolean', 'Float', 'Object'],
              correctAnswer: 'Float',
              points: 10
            },
            {
              id: '1-2',
              type: 'mcq',
              text: 'What does DOM stand for?',
              options: [
                'Document Object Model', 
                'Data Object Model', 
                'Document Oriented Model', 
                'Digital Ordinance Model'
              ],
              correctAnswer: 'Document Object Model',
              points: 10
            },
            {
              id: '1-3',
              type: 'essay',
              text: 'Explain the concept of closures in JavaScript.',
              points: 20
            }
          ]
        }
      ];
      
      setExams(sampleExams);
      localStorage.setItem('exams', JSON.stringify(sampleExams));
    }
    
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
    
    setLoading(false);
  }, []);

  // Save exams to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('exams', JSON.stringify(exams));
    }
  }, [exams, loading]);

  // Save results to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('results', JSON.stringify(results));
    }
  }, [results, loading]);

  // Create a new exam
  const createExam = (examData) => {
    try {
      const newExam = {
        ...examData,
        id: uuidv4(),
        createdAt: new Date().toISOString()
      };
      
      setExams([...exams, newExam]);
      return newExam;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update an existing exam
  const updateExam = (id, examData) => {
    try {
      const updatedExams = exams.map(exam => 
        exam.id === id ? { ...exam, ...examData } : exam
      );
      
      setExams(updatedExams);
      return updatedExams.find(exam => exam.id === id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete an exam
  const deleteExam = (id) => {
    try {
      const updatedExams = exams.filter(exam => exam.id !== id);
      setExams(updatedExams);
      
      // Also delete related results
      const updatedResults = results.filter(result => result.examId !== id);
      setResults(updatedResults);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get a single exam by ID
  const getExam = (id) => {
    return exams.find(exam => exam.id === id);
  };

  // Submit exam results
  const submitExamResult = (resultData) => {
    try {
      const newResult = {
        ...resultData,
        id: uuidv4(),
        submittedAt: new Date().toISOString()
      };
      
      setResults([...results, newResult]);
      return newResult;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get results for a specific user
  const getUserResults = (userId) => {
    return results.filter(result => result.userId === userId);
  };

  // Get results for a specific exam
  const getExamResults = (examId) => {
    return results.filter(result => result.examId === examId);
  };

  // Get a specific result by ID
  const getResult = (id) => {
    return results.find(result => result.id === id);
  };

  const value = {
    exams,
    results,
    loading,
    error,
    createExam,
    updateExam,
    deleteExam,
    getExam,
    submitExamResult,
    getUserResults,
    getExamResults,
    getResult
  };

  return (
    <ExamContext.Provider value={value}>
      {!loading && children}
    </ExamContext.Provider>
  );
};
