import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentPaymentForm from './pages/StudentPaymentForm';

function App() {
    return (
      <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/payment" element={<StudentPaymentForm />} />
            <Route path="/" element={<LoginPage />} />
          </Routes>
      </HashRouter>
    );
}
export default App;