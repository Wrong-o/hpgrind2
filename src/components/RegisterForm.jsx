import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState([]);
  const [passwordError, setPasswordError] = useState([]);
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
    const regex = /[^a-zA-Z0-9]/;
    if (password.length <= 8) {
      passwordErrors.push("Lösenordet måste vara längre än 8 tecken");
    }
    if (!regex.test(password)) {
      passwordErrors.push("Lösenordet måste innehålla ett unikt tecken");
    }
    if (!password) {
      passwordErrors.push("Skriv in ett lösenord");
    }
    setPasswordError(passwordErrors);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    validateEmail();
    validatePassword();
    
    if (emailError.length > 0 || passwordError.length > 0) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/user/create",
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
        navigate("/login");
      } else {
        console.log("Nåt gick fel");
        console.log(data);
        setError(data.detail);
      }
    } catch (error) {
      console.log(error);
      setError("Ett fel uppstod vid registrering");
    }
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
              />
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
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <h3 className="font-medium mb-2">Lösenordskrav:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Minst 8 tecken</li>
              <li>Minst en stor bokstav</li>
              <li>Minst en liten bokstav</li>
              <li>Minst ett nummer</li>
              <li>Minst ett specialtecken (!@#$%^&*(),.?&quot;:|&lt;&gt;)</li>
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
