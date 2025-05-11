import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL query parameter
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
          setVerificationStatus('error');
          setErrorMessage('Verifieringstoken saknas');
          return;
        }

        // Call the API to verify the email
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/verify-email?token=${token}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.ok) {
          setVerificationStatus('success');
        } else {
          const errorData = await response.json();
          setVerificationStatus('error');
          setErrorMessage(errorData.detail || 'Failed to verify email');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');
        setErrorMessage('Ett fel uppstod vid verifiering av din e-postadress');
      }
    };

    verifyEmail();
  }, [location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            E-postverifiering
          </h2>
          
          {verificationStatus === 'verifying' && (
            <div className="mt-4">
              <p className="text-gray-600">Verifierar din e-postadress...</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="mt-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-2 text-green-600">Din e-postadress har verifierats!</p>
              <p className="mt-2 text-gray-600">Du kan nu logga in på ditt konto.</p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Gå till inloggning
                </Link>
              </div>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="mt-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="mt-2 text-red-600">Verifiering misslyckades</p>
              <p className="mt-2 text-gray-600">{errorMessage}</p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Gå till startsidan
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage; 