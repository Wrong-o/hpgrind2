import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PasswordResetConfirmForm({ token }) {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  // Password validation
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Lösenordet måste vara minst 8 tecken');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Lösenordet måste innehålla minst en stor bokstav');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Lösenordet måste innehålla minst en liten bokstav');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Lösenordet måste innehålla minst en siffra');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Lösenordet måste innehålla minst ett specialtecken (!@#$%^&*(),.?":{}|<>)');
    }
    
    return errors;
  };

  // Validate passwords on input change
  useEffect(() => {
    if (newPassword) {
      const errors = validatePassword(newPassword);
      setValidationErrors(errors.length ? { password: errors } : {});
      
      if (errors.length) {
        setPasswordError('Lösenordet uppfyller inte kraven');
      } else {
        setPasswordError('');
      }
    }
    
    if (confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError('Lösenorden matchar inte');
    } else {
      setConfirmPasswordError('');
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setServerError('');
    
    // Validate password
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setPasswordError('Lösenordet uppfyller inte kraven');
      return;
    }
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Lösenorden matchar inte');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/password-reset-confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Ett fel uppstod vid återställning av lösenordet');
      }
      
      // Success
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setServerError(error.message || 'Ett fel uppstod vid återställning av lösenordet');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-lg bg-white shadow p-6 max-w-md mx-auto">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-center text-green-800">Lösenordet har uppdaterats!</h3>
        <p className="mt-2 text-sm text-center text-gray-600">
          Ditt lösenord har uppdaterats. Du kommer nu att omdirigeras till inloggningssidan.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow sm:max-w-md sm:w-full sm:mx-auto sm:overflow-hidden">
      <div className="px-4 py-8 sm:px-10">
        {serverError && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Fel</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{serverError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
              Nytt lösenord
            </label>
            <div className="mt-1">
              <input
                id="new-password"
                name="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`block w-full rounded-md border ${
                  passwordError ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Bekräfta lösenord
            </label>
            <div className="mt-1">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`block w-full rounded-md border ${
                  confirmPasswordError ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
              />
              {confirmPasswordError && (
                <p className="mt-2 text-sm text-red-600">{confirmPasswordError}</p>
              )}
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Lösenordet måste innehålla:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                ✓ Minst 8 tecken
              </li>
              <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                ✓ Minst en stor bokstav
              </li>
              <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                ✓ Minst en liten bokstav
              </li>
              <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                ✓ Minst en siffra
              </li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-green-600' : ''}>
                ✓ Minst ett specialtecken (!@#$%^&*(),.?":{}|&lt;&gt;)
              </li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Bearbetar...' : 'Uppdatera lösenord'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordResetConfirmForm; 