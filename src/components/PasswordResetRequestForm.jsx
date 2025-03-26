import React, { useState } from 'react';

  const PasswordResetRequestForm = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [serverError, setServerError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function validateEmail() {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        setEmailError("Email krävs");
        return false;
      } else if (!regex.text(email)) {
        setEmailError("Ogiltig emailadress");
        return false;
      } else {
        setEmailError("");
        return true;
      }
    }    

    const handeSubmit = async (event) => {
      event.preventDefault();
      setServerError("");
      setSuccess("");

      if (!validateEmail()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch (`${API_URL}/auth/password-reset/request`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email  }),
        });

        if (response.ok) {
          const data = await response.json();
          setSuccess("En länk har skickats till din email!");
          setEmail("");
        } else {
          const errorData = await response.json();
          setServerError(
            errorData.detail
          );
        }
      } catch (error) {
        console.error("Ett fel intäffade:" , error);
        setServerError("Ett oväntat fel inträffade. Försök igen senare");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-dull sm:max-w-d">
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handeSubmit} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange = {(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={isSubmitting}
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-red-600">{emailError}</p>
                  )}
                  </div>

                  <div className="my-2">
                    {serverError &&(
                      <p className="mt-2 text-sm text-red-600">{serverError}</p>
                    )}
                    {success && (
                      <p className ="mt-2 text-sm text-green-600">{success}</p>
                    )}
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={isSubmitting}
                      >
                      {isSubmitting ? "Skickar..." :  "Skickar återställningslänk"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
             </div>
    );
  };

export default PasswordResetRequestForm;

