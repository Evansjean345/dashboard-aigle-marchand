import React from "react";

export const Loader = () => {
  return (
    <>
      <img
        style={{
          animation: "bounce 0.5s infinite ease-in-out",
          animationDelay: "0s",
        }}
        src="/aigle.png"
        alt=""
        className="h-10 w-10"
      />
      <style>
        {`
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
    `}
      </style>
    </>
  );
};
