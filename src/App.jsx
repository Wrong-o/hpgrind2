import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import RegisterForm from './components/RegisterForm';
import authStore from './store/authStore';
import { CategoryStats } from './components/CategoryStats';
import { SoundProvider } from './contexts/SoundContext';
import { DecisionTree } from './components/DecisionTree';
import { SecondChance } from './components/SecondChance';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import PasswordResetRequestPage from './components/PasswordResetRequestPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainMenu from './components/MainMenu';
import UserStatsPage from './components/UserStatsPage';
function App() {
  const isLoggedIn = authStore((state) => state.isLoggedIn);
  return (
    <SoundProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          <Header />
          <div className="flex">
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} redirectTo="/main-menu">
                    <LoginPage />
                  </ProtectedRoute>
                } />
                <Route path="/register" element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} redirectTo="/main-menu">
                    <RegisterForm />
                  </ProtectedRoute>
                } />
                <Route path="/user_stats" element={
                  <ProtectedRoute isLoggedIn={!isLoggedIn} redirectTo="/">
                    <UserStatsPage />
                  </ProtectedRoute>
                } />
                <Route path="/decision-tree" element={
                  <ProtectedRoute isLoggedIn={!isLoggedIn} redirectTo="/">
                    <DecisionTree />
                  </ProtectedRoute>
                } />
                <Route path="/second-chance" element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} redirectTo="/">
                    <SecondChance />
                  </ProtectedRoute>
                } />
                <Route path="/password-reset" element={
                  <ProtectedRoute isLoggedIn={!isLoggedIn} redirectTo="/">
                    <PasswordResetRequestPage />
                  </ProtectedRoute>
                } />
                <Route path="/main-menu" element={
                  <ProtectedRoute isLoggedIn={!isLoggedIn} redirectTo="/">
                    <MainMenu />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </SoundProvider>
  );
}

export default App;
