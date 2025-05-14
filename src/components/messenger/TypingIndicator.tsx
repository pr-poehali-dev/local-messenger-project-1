
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-dot animate-pulse"></div>
      <div className="typing-dot animate-pulse delay-75"></div>
      <div className="typing-dot animate-pulse delay-150"></div>
    </div>
  );
};

export default TypingIndicator;
