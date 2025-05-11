import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState([]);
  const [passwordError, setPasswordError] = useState([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();

  const { register, login, isLoading } = authStore();

  function validateEmail() {
    let emailErrors = [];
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      emailErrors.push("It must be a correct email");
    }
    if (!email) {
      emailErrors.push("Email is required");
    }
    setEmailError(emailErrors);
  }

  function validatePassword() {
    let passwordErrors = [];
    
    if (!password) {
      passwordErrors.push("Skriv in ett lösenord");
      setPasswordError(passwordErrors);
      return;
    }
    
    if (password.length < 8) {
      passwordErrors.push("Lösenordet måste vara minst 8 tecken långt");
    }
    
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push("Lösenordet måste innehålla minst en stor bokstav");
    }
    
    if (!/[a-z]/.test(password)) {
      passwordErrors.push("Lösenordet måste innehålla minst en liten bokstav");
    }
    
    if (!/\d/.test(password)) {
      passwordErrors.push("Lösenordet måste innehålla minst en siffra");
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      passwordErrors.push("Lösenordet måste innehålla minst ett specialtecken (!@#$%^&*(),.?\":{}|<>)");
    }
    
    setPasswordError(passwordErrors);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate before submitting
    validateEmail();
    validatePassword();
    
    // Wait for state updates
    setTimeout(() => {
      // Check if there are validation errors
      if (emailError.length > 0 || passwordError.length > 0) {
        return;
      }
      
      submitForm();
    }, 0);
  }
  
  async function submitForm() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/user/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();

      if (response.status === 201) {
        console.log("Användare skapades");
        setRegisteredEmail(email);
        setError(null);
        setEmailError([]);
        setPasswordError([]);
        setRegistrationSuccess(true);
      } else {
        console.log(data);
        setError(data.detail);
      }
    } catch (error) {
      setError("Ett fel uppstod vid registrering");
    }
  }

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifiera din email!</h2>
            <p className="text-gray-600 mb-6">
              Ett mail har skickats till <span className="font-medium">{registeredEmail}</span>. 
              Klicka på länken i mailet för att aktivera ditt konto!
            </p>
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 mb-4">
                Om du inte ser mailet i din inkorg, kolla i skräpposten eller försök igen.
              </p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Gå till inloggning
                </button>
                <button
                  onClick={() => {
                    setRegistrationSuccess(false);
                    setEmail('');
                    setPassword('');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Tillbaka till registrering
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Skapa ett konto
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
              />
              {emailError.length > 0 && (
                <div className="mt-2 text-sm text-red-600">
                  {emailError.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Lösenord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
              />
              {passwordError.length > 0 && (
                <div className="mt-2 text-sm text-red-600">
                  {passwordError.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <h3 className="font-medium mb-2">Lösenordskrav:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li className={password.length >= 8 ? 'text-green-600' : ''}>Minst 8 tecken</li>
              <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>Minst en stor bokstav</li>
              <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>Minst en liten bokstav</li>
              <li className={/\d/.test(password) ? 'text-green-600' : ''}>Minst ett nummer</li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : ''}>Minst ett specialtecken (!@#$%^&*(),.?&quot;:|&lt;&gt;)</li>
            </ul>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              ) : null}
              Skapa konto 
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Har du redan ett konto? Logga in
          </button>
        </div>
      </div>
    </div>
  );
}
