import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  const navigate = useNavigate();

  const { setToken } = authStore();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [serverError, setServerError] = useState(""); // New state for server-side errors

  function validateEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("It must be a correct email");
      return false;
    } else if (!email) {
      setEmailError("Email is required");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  }

  function validatePassword() {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  }
  async function submitLogin(e) {
    e.preventDefault();
    setServerError(""); // Reset server error before each login attempt
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      const formData = new FormData();
      formData.append("username", email); // Use 'username' or 'email' as needed by your backend
      formData.append("password", password);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/token`, {
          method: "POST",
          body: formData,
        });

        if (response.status === 200) {
          const data = await response.json();
          setToken(data.access_token); // Save the token in the global state
          navigate("/stats");
          // Handle successful login, e.g., storing the access token
          console.log(data);
        } else if (response.status === 400 || response.status === 401) {
          const data = await response.json();
          setServerError(data.detail); // Set server error based on the response
        } else {
          console.log("Login Failed");
          setServerError(
            "An unexpected error occurred. Please try again later."
          );
        }
      } catch (error) {}
    } else {
      console.log("Validation errors");
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Logga in på ditt konto
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={submitLogin}>
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
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {serverError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{serverError}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logga in
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Har du inget konto? Skapa ett här
          </button>
        </div>
        <Link to ="/password-reset">
          <p className="mt-4 text-indigo-600 underline text-small">
            Glömt ditt lösenord?
          </p>
        </Link>
      </div>
    </div>
  );
};