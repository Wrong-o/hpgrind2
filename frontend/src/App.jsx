import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import RegisterForm from './pages/RegisterForm';
import authStore from './store/authStore';
import { SoundProvider } from './contexts/SoundContext';
import { SecondChance } from './components/SecondChance';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import PasswordResetRequestPage from './pages/PasswordResetRequestPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainMenu from './pages/MainMenu';
import UserStatsPage from './pages/UserStatsPage';
import Quiz from './pages/Quiz';
import MomentTree from './components/MomentTree';
import WhoAreWe from './pages/WhoAreWe';
import { CategoryStats } from './pages/CategoryStats';

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
                <Route path="/" element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} redirectTo="/main-menu">
                    <LandingPage />
                  </ProtectedRoute>
                } />
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
                <Route path="/quiz" element={
                  <ProtectedRoute isLoggedIn={!isLoggedIn} redirectTo="/">
                    <Quiz />
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
                <Route path="/moment-tree" element={
                  <ProtectedRoute isLoggedIn={!isLoggedIn} redirectTo="/">
                    <MomentTree />
                  </ProtectedRoute>
                } />
                <Route path="/category-stats" element={
                  <ProtectedRoute isLoggedIn={!isLoggedIn} redirectTo="/">
                    <CategoryStats />
                  </ProtectedRoute>
                } />
                <Route path="/vilka-vi-ar" element={<WhoAreWe />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </SoundProvider>
  );
}

export default App;
