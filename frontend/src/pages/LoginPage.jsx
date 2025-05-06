import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';
import { Link } from 'react-router-dom';
import Popup from '../components/Popup';
//TODO: Add a loading statess
export const LoginPage = () => {
  const navigate = useNavigate();

  const { setToken } = authStore();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [serverError, setServerError] = useState(""); // New state for server-side errors
  const [showWelcomePopup, setShowWelcomePopup] = useState(false); // State for welcome popup
  const [tempToken, setTempToken] = useState(null); // Temporary store for token
  const [isLoading, setIsLoading] = useState(false); // Loading state for login request
  
  // Ref to store the timeout ID so we can clear it if needed
  const timeoutRef = useRef(null);

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

  // Handle popup close
  const handlePopupClose = () => {
    setShowWelcomePopup(false);
    // Now set the token in the store and navigate
    if (tempToken) {
      setToken(tempToken);
      navigate("/main-menu");
    }
  };
  
  async function submitLogin(e) {
    e.preventDefault();
    setServerError(""); // Reset server error before each login attempt
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true); // Start loading
      
      const formData = new FormData();
      formData.append("username", email); // Use 'username' or 'email' as needed by your backend
      formData.append("password", password);

      try {
        // Set up timeout for request
        const loginTimeout = new Promise((_, reject) => {
          timeoutRef.current = setTimeout(() => {
            reject(new Error('Timeout: Server took too long to respond'));
          }, 10000); // 10 seconds timeout
        });

        // Actual fetch request
        const fetchPromise = fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/token`, {
          method: "POST",
          body: formData,
        });

        // Race between timeout and actual request
        const response = await Promise.race([fetchPromise, loginTimeout]);
        
        // Clear timeout as we got a response
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (response.status === 200) {
          const data = await response.json();
          console.log("Login successful, will show welcome popup");
          
          // Store token temporarily but don't set it in the store yet
          setTempToken(data.access_token);
          setShowWelcomePopup(true);
          
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
      } catch (error) {
        console.error("Login error:", error);
        setServerError("Någonting gick fel, vänligen försök igen senare");
      } finally {
        setIsLoading(false); // End loading state
        // Ensure timeout is cleared in case of any other error
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
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
                disabled={isLoading}
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
                disabled={isLoading}
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
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loggar in...
                </span>
              ) : (
                "Logga in"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
            disabled={isLoading}
          >
            Har du inget konto? Skapa ett här
          </button>
        </div>
        <Link to ="/password-reset" className={isLoading ? "pointer-events-none opacity-50" : ""}>
          <p className="mt-4 text-indigo-600 underline text-small">
            Glömt ditt lösenord?
          </p>
        </Link>
      </div>

      {/* Welcome Popup */}
      <Popup
        isOpen={showWelcomePopup}
        onClose={handlePopupClose}
        title="Du är nu inloggad"
      >
        <p className="text-center text-gray-700 mb-4">
          Klicka på knappen för att börja få anpassade uppgifter
        </p>
        <button
          onClick={handlePopupClose}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Börja Grinda
        </button>
      </Popup>
      {/* Debug information - remove after fixing */}
      <div style={{ display: 'none' }}>
        Popup state: {showWelcomePopup ? 'true' : 'false'}
      </div>
    </div>
  );
};