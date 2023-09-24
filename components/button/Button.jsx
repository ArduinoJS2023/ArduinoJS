import React, { memo } from 'react';
import styles from './style.module.css';

const Button = ({ label, onClick, disabled, className, onMouseDown, onMouseUp, onTouchEnd, onTouchStart }) => {
    return (
        <button
            className={`${styles.button} ${className || ''}`}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchStart}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default memo(Button);