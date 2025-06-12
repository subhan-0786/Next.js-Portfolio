import React from 'react';
import styles from '../styles/ShinyText.module.css';

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`${styles.shinyText} ${disabled ? styles.disabled : ''} ${className}`}
      style={{ animationDuration }}
    >
      {text}
    </div>
  );
};

export default ShinyText;