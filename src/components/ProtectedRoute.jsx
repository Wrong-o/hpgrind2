import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, isLoggedIn, redirectTo }) => {
    const navigate = useNavigate();

    useEffect(() =>{
        if (isLoggedIn) {
            navigate(redirectTo);
        }
    }, [isLoggedIn, navigate, redirectTo]);

    return !isLoggedIn ? children : null;

};

export default ProtectedRoute;