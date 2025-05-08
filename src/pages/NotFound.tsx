import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/80 backdrop-blur-sm text-white relative overflow-hidden">
      <div className="text-center z-10">
        <h1 className="text-[100px] font-extrabold text-cyan-400 glitch">
          404
        </h1>
        <p className="text-xl mb-6 text-slate-300">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-md shadow-lg transition duration-300"
        >
          Back to Home
        </a>
      </div>

      <style>
        {`
          .glitch {
            position: relative;
            color: white;
          }

          .glitch::before,
          .glitch::after {
            content: '404';
            position: absolute;
            left: 0;
            top: 0;
            color: cyan;
            overflow: hidden;
            clip: rect(0, 900px, 0, 0);
            animation: glitch 1.5s infinite;
            opacity: 0.8;
          }

          .glitch::after {
            color: #38bdf8;
            animation-delay: 0.3s;
          }

          @keyframes glitch {
            0% {
              clip: rect(42px, 9999px, 44px, 0);
              transform: translate(-2px, -2px);
            }
            20% {
              clip: rect(12px, 9999px, 90px, 0);
              transform: translate(2px, 1px);
            }
            40% {
              clip: rect(70px, 9999px, 90px, 0);
              transform: translate(-1px, 2px);
            }
            60% {
              clip: rect(25px, 9999px, 65px, 0);
              transform: translate(1px, -1px);
            }
            80% {
              clip: rect(40px, 9999px, 60px, 0);
              transform: translate(-2px, 0);
            }
            100% {
              clip: rect(42px, 9999px, 44px, 0);
              transform: translate(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;
