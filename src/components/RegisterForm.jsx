import { userState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
    let navigate = userNavigate();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState([]);

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState([]);

    const [terms, setTerms] = useState(false);
    const [termsError, setTermsError] = useState("");

    function validateEmail() {
        let emailError = [];
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.text(email)) {
            emailError.push("Ogiltig e-postadress");
        }
        if (!email) {
            emailError.push("E-postadress krävs");
        }
        setEmailError(emailError);
    }

    function validatePassword() {
        let passwordError = [];
        const regex = /[^a-zA-Z0-9]/;
        if (password.length < 8) {
            passwordError.push("Lösenordet måste vara minst 8 tecken långt");
        }
        if (!regex.test(password)) {
            passwordError.push("Lösenordet måste innehålla minst en siffra eller specialtecken");
        }
        if (!password) {
            passwordError.push("Lösenord krävs");
        }
        setPasswordError(passwordError);
    }

    function validateTerms() {
        if (!terms) {
            setTermsError("Du måste godkänna villkoren");
        } else {
            setTermsError("");
        }
    }

    async function submitRegister(e) {
        e.preventDefault();
        validateEmail();
        validatePassword();
        validateTerms();

        if (
            emailError.length === 0 &&
            passwordError.length === 0 &&
            !termsError
        ) {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/v1/auth/user/create",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password,
                        }),
                    }
                );
                const data = await response.json();

                if (response.status === 201) {
                    console.log("User created");
                    navigate("/login");
                } else {
                    console.log("Something went wrong");
                    console.log(data);
                    throw new Error("Error from the server")
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("Error in form");
        }
        return (
            <>
                <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
                            <form className="space-y-6" onSubmit={submitRegister}>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onBlur={validateEmail}
                                        />
                                        {emailError.map((error, index) => (
                                            <p key={index} className="mt-2 text-sm text-red-600">
                                                {error}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="first_name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        First Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            autoComplete="given-name"
                                            required
                                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            onBlur={validateFirstName}
                                        />
                                        {firstNameError.map((error, index) => (
                                            <p key={index} className="mt-2 text-sm text-red-600">
                                                {error}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Last Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            autoComplete="family-name"
                                            required
                                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            onBlur={validateLastName}
                                        />
                                        {lastNameError.map((error, index) => (
                                            <p key={index} className="mt-2 text-sm text-red-600">
                                                {error}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onBlur={validatePassword}
                                        />
                                        {passwordError.map((error, index) => (
                                            <p key={index} className="mt-2 text-sm text-red-600">
                                                {error}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        checked={terms}
                                        onChange={(e) => setTerms(e.target.checked)}
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="block ml-2 text-sm text-gray-900"
                                    >
                                        I agree to the terms and conditions
                                    </label>
                                </div>
                                {termsError && (
                                    <p className="mt-2 text-sm text-red-600">{termsError}</p>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
