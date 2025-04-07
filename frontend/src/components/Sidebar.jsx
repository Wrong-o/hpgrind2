import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authStore from "../store/authStore";

export default function Sidebar() {

    const { token } = authStore();
    const logout = authStore((state) => state.logout);
    const userData = authStore((state) => state.userData);
    const fetchData = authStore((state) => state.fetchData);

    const navigate = useNavigate();

    function logoutUser() {
        logout();
        navigate("/");
    }
    const isLoggedIn = !!token;
    useEffect(() => {
        if (isLoggedIn) {
            fetchUser();
        }
    }, []);

    return (
        <div className="flex flex-col w-64 h-scree overflow-auto">
            <div className="flex flex-col px-6 overflow-y-auto bg-white border-r border-gray-200 shadow-lg grow gap-y-5">
                <div className="flex items-center my-2">
                    <Link to="/">Hem
                    </Link>
                </div>
                <nav className="flex flex-col flex-1">
                    <ul role="list" className="flex flex-col flex-1 gap-y-7">
                        <li>
                            {userData && (
                                <div className="flex items-center mb-2">
                                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                                    <span className="text-sm text-gray-700 truncate">
                                        {userData.email}
                                    </span>
                                </div>
                            )}
                            <button
                            className="px-4 py-2 my-2 text-sm text-white bg-black rounded cursor-pointer hover:bg-red-700"
                            onClick={() => logoutUser()}
                            >
                                Logga ut
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}