import './LoadingScreen.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const LoadingScreen = () => {
  return (
    <div className="card">
      <div className="loader">
        <p>loading</p>
        <div className="words">
          <span className="word">x+y</span>
          <span className="word">kx+m=y</span>
          <span className="word">a^2+b^2=c^2</span>
          <span className="word">P(A | B)</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;