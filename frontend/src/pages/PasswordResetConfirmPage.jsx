import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PasswordResetConfirmForm from '../components/PasswordResetConfirmForm';

function PasswordResetConfirmPage() {
  // Extract token from URL query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="mb-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Skapa nytt lösenord
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Ange ditt nya lösenord nedan för att slutföra återställningen
          </p>
        </div>
        
        {token ? (
          <div className="mt-8">
            <PasswordResetConfirmForm token={token} />
          </div>
        ) : (
          <div className="mt-8 rounded-lg bg-white shadow p-6 max-w-md mx-auto">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-center text-red-800">Ogiltig återställningslänk</h3>
            <p className="mt-2 text-sm text-center text-gray-600">
              Länken för lösenordsåterställning är ogiltig eller saknar nödvändig information.
            </p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-indigo-600 transition-colors duration-200 hover:text-indigo-500"
          >
            ← Tillbaka till inloggningssidan
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetConfirmPage; 