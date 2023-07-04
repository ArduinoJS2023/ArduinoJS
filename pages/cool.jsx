"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from "../styles/Cool.module.css"
import io from "socket.io-client";

const ArrowUp = ({ fill }) => (
    <svg width="40" height="40" viewBox="0 0 10 10">
        <path d="M5 1L1 9H9L5 1z" fill={fill} />
    </svg>
);

const ArrowDown = ({ fill }) => (
    <svg width="40" height="40" viewBox="0 0 10 10">
        <path d="M5 9L1 1H9L5 9z" fill={fill} />
    </svg>
);

const ArrowLeft = ({ fill }) => (
    <svg width="40" height="40" viewBox="0 0 10 10">
        <path d="M1 5L9 1V9L1 5z" fill={fill} />
    </svg>
);

const ArrowRight = ({ fill }) => (
    <svg width="40" height="40" viewBox="0 0 10 10">
        <path d="M9 5L1 9V1L9 5z" fill={fill} />
    </svg>
);

const ArrowIn = ({ fill }) => (
    <svg width="40" height="40" viewBox="0 0 10 10">
        <path d="M5 1L1 9H9L5 1z" fill={fill} />
    </svg>
);

const ArrowOut = ({ fill }) => (
    <svg width="40" height="40" viewBox="0 0 10 10">
        <path d="M5 9L1 1H9L5 9z" fill={fill} />
    </svg>
);

const ArrowClockwise = ({ fill }) => (
    <svg width="40" height="40" viewBox="0 0 10 10">
        <path d="M1 5L9 1V9L1 5z" fill={fill} />
    </svg>
);

const ArrowCounterClockwise = ({ fill }) => (
    <svg width="40" height="40" viewBox="0 0 10 10">
        <path d="M9 5L1 9V1L9 5z" fill={fill} />
    </svg>
);

const Cool = () => {
    const [colorIndex, setColorIndex] = useState(0);
    const [horizontalIndex, setHorizontalIndex] = useState(90);
    const [verticalIndex, setVerticalIndex] = useState(150);
    const [depthIndex, setDepthIndex] = useState(100); // New state
    const [rotationIndex, setRotationIndex] = useState(180); // New state
    const socket = useRef();
    const intervalId = useRef(null);

    useEffect(() => {
        // Create socket connection
        socket.current = io();

        // Clean up function
        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        }
    }, []);

    const hslToHex = (h, s, l) => {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and ensure 2 digits
        };
        if (socket.current) {
            socket.current.emit("color change", `#${f(0)}${f(8)}${f(4)}`); // emit the "color change" event
        }
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    let arrowFillColor = hslToHex(colorIndex, 100, 50);

    useEffect(() => {
        const interval = setInterval(() => {
            setColorIndex((prevIndex) => (prevIndex < 360 ? prevIndex + 1 : 0));
        }, 10);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const increaseHorizontal = () => {
        intervalId.current = setInterval(() => {
            setHorizontalIndex(prevIndex => {
                const newIndex = prevIndex < 180 ? prevIndex + 1 : 180;
                socket.current.emit("servo1 move", newIndex); // emit the "servo move" event with the updated value
                return newIndex;
            });
        }, 10);
    };

    const decreaseHorizontal = () => {
        intervalId.current = setInterval(() => {
            setHorizontalIndex(prevIndex => {
                const newIndex = prevIndex > 0 ? prevIndex - 1 : 0;
                socket.current.emit("servo1 move", newIndex); // emit the "servo move" event with the updated value
                return newIndex;
            });
        }, 10);
    };

    const increaseVertical = () => {
        intervalId.current = setInterval(() => {
            setVerticalIndex(prevIndex => {
                const newIndex = prevIndex < 180 ? prevIndex + 1 : 180;
                socket.current.emit("servo2 move", newIndex); // emit the "servo move" event with the updated value
                return newIndex;
            });
        }, 5);
    };

    const decreaseVertical = () => {
        intervalId.current = setInterval(() => {
            setVerticalIndex(prevIndex => {
                const newIndex = prevIndex > 0 ? prevIndex - 1 : 0;
                socket.current.emit("servo2 move", newIndex); // emit the "servo move" event with the updated value
                return newIndex;
            });
        }, 5);
    };

    const increaseDepth = () => {
        intervalId.current = setInterval(() => {
            setDepthIndex(prevIndex => {
                const newIndex = prevIndex < 180 ? prevIndex + 1 : 180;
                socket.current.emit("servo3 move", newIndex); // emit the "servo move" event with the updated value
                return newIndex;
            });
        }, 5);
    };

    const decreaseDepth = () => {
        intervalId.current = setInterval(() => {
            setDepthIndex(prevIndex => {
                const newIndex = prevIndex > 0 ? prevIndex - 1 : 0;
                socket.current.emit("servo3 move", newIndex); // emit the "servo move" event with the updated value
                return newIndex;
            });
        }, 5);
    };

    const increaseRotation = () => {
        intervalId.current = setInterval(() => {
            setRotationIndex(prevIndex => {
                const newIndex = prevIndex < 180 ? prevIndex + 1 : 180;
                socket.current.emit("servo4 move", newIndex); // emit the "servo move" event with the updated value
                return newIndex;
            });
        }, 5);
    };

    const decreaseRotation = () => {
        intervalId.current = setInterval(() => {
            setRotationIndex(prevIndex => {
                const newIndex = prevIndex > 0 ? prevIndex - 1 : 0;
                socket.current.emit("servo4 move", newIndex); // emit the "servo move" event with the updated value
                return newIndex;
            });
        }, 5);
    };

    const stopChange = () => {
        clearInterval(intervalId.current);
    };

    return (
        <div className={styles["bg-container"]}>
            <Link href="/light">
                <button className={styles["cool-button"]}>Go to Light</button>
            </Link>
            <div className={styles["button-group"]}>
                <div className={`${styles.arrow} ${styles.up}`} onMouseDown={increaseVertical} onMouseUp={stopChange}><ArrowUp fill={arrowFillColor} /></div>
                <div className={`${styles.arrow} ${styles.down}`} onMouseDown={decreaseVertical} onMouseUp={stopChange}><ArrowDown fill={arrowFillColor} /></div>
                <div className={`${styles.arrow} ${styles.left}`} onMouseDown={increaseHorizontal} onMouseUp={stopChange}><ArrowLeft fill={arrowFillColor} /></div>
                <div className={`${styles.arrow} ${styles.right}`} onMouseDown={decreaseHorizontal} onMouseUp={stopChange}><ArrowRight fill={arrowFillColor} /></div>
                <div className={`${styles.arrow} ${styles.out}`} onMouseDown={increaseDepth} onMouseUp={stopChange}><ArrowOut fill={arrowFillColor} /></div>
                <div className={`${styles.arrow} ${styles.in}`} onMouseDown={decreaseDepth} onMouseUp={stopChange}><ArrowIn fill={arrowFillColor} /></div>
                <div className={`${styles.arrow} ${styles.clockwise}`} onMouseDown={increaseRotation} onMouseUp={stopChange}><ArrowClockwise fill={arrowFillColor} /></div>
                <div className={`${styles.arrow} ${styles.counterClockwise}`} onMouseDown={decreaseRotation} onMouseUp={stopChange}><ArrowCounterClockwise fill={arrowFillColor} /></div>
            </div>
            <div className={styles.monitor}>
                <p>Horizontal Index: {horizontalIndex}</p>
                <p>Vertical Index: {verticalIndex}</p>
                <p>Depth Index: {depthIndex}</p>
                <p>Rotation Index: {rotationIndex}</p>
            </div>
        </div>
    );
}
export default Cool;