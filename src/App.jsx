import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ExamProvider } from './contexts/ExamContext';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import CreateExam from './components/admin/CreateExam';
import EditExam from './components/admin/EditExam';
import ExamList from './components/exams/ExamList';
import ExamDetails from './components/exams/ExamDetails';
// import TakeExam from './components/exams/TakeExam';
import ExamResults from './components/exams/ExamResults';
import NotFound from './components/pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <ExamProvider>
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/exams" element={
                <PrivateRoute>
                  <ExamList />
                </PrivateRoute>
              } />
              
              <Route path="/exams/:id" element={
                <PrivateRoute>
                  <ExamDetails />
                </PrivateRoute>
              } />
              
              {/* <Route path="/exams/:id/take" element={
                <PrivateRoute>
                  <TakeExam />
                </PrivateRoute>
              } /> */}
              
              <Route path="/results/:id" element={
                <PrivateRoute>
                  <ExamResults />
                </PrivateRoute>
              } />
              
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              <Route path="/admin/exams/create" element={
                <AdminRoute>
                  <CreateExam />
                </AdminRoute>
              } />
              
              <Route path="/admin/exams/:id/edit" element={
                <AdminRoute>
                  <EditExam />
                </AdminRoute>
              } />
              
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </div>
        </Router>
      </ExamProvider>
    </AuthProvider>
  );
};

export default App;
