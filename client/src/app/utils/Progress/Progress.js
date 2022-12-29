import React, { useState, useEffect } from "react";
import "./Progress.css";

const Progress = (props) => {
  const [progress, setProgress] = useState(0);

  let timer = React.useRef(undefined);

  useEffect(() => {
    if (!timer.current) {
      timer.current = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            return prev + 2;
          }
          if (prev === 100) {
            clearInterval(timer.current);
          }
          return prev;
        });
      }, 1000);
    }
  }, []);

  return (
    <div className="progressBar">
      <div className="bar" style={{ width: `${progress}%` }}></div>
      <span>{progress}%</span>
    </div>
  );
};

export default Progress;
