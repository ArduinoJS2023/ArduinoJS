"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from "../styles/Cool.module.css"
import io from "socket.io-client";
import Arrow from '../components/icons/Arrow';
import { Directions } from '../constants/directions';
import { hslToHex } from '../utils/colors';

const Cool = () => {
    const [colorIndex, setColorIndex] = useState(0);
    const [horizontalIndex, setHorizontalIndex] = useState(90);
    const [verticalIndex, setVerticalIndex] = useState(150);
    const [depthIndex, setDepthIndex] = useState(100); // New state
    const [rotationIndex, setRotationIndex] = useState(180); // New state
    const socket = useRef();
    const intervalId = useRef(null);
    let arrowFillColor = hslToHex(colorIndex, 100, 50);

    useEffect(() => {
        // Create socket connection
        socket.current = io();
        
        // Set Interval for change color
        const interval = setInterval(() => {
            setColorIndex((prevIndex) => (prevIndex < 360 ? prevIndex + 1 : 0));
        }, 10);

        // Clean up function
        return () => {
            clearInterval(interval);
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        }
    }, []);
    
    useEffect(() => {
        if (socket?.current) {
            socket.current.emit("color change", arrowFillColor); // emit the "color change" event
        }
    }, [colorIndex])

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
                <div className={`${styles.arrow} ${styles.up}`} onMouseDown={increaseVertical} onMouseUp={stopChange}><Arrow fill={arrowFillColor} /></div>
                <div className={`${styles.arrow} ${styles.down}`} onMouseDown={decreaseVertical} onMouseUp={stopChange}><Arrow fill={arrowFillColor} degrees={Directions.down} /></div>
                <div className={`${styles.arrow} ${styles.left}`} onMouseDown={increaseHorizontal} onMouseUp={stopChange}><Arrow fill={arrowFillColor} degrees={Directions.left} /></div>
                <div className={`${styles.arrow} ${styles.right}`} onMouseDown={decreaseHorizontal} onMouseUp={stopChange}><Arrow fill={arrowFillColor} degrees={Directions.right} /></div>
                <div className={`${styles.arrow} ${styles.out}`} onMouseDown={increaseDepth} onMouseUp={stopChange}><Arrow fill={arrowFillColor} degrees={Directions.down} /></div>
                <div className={`${styles.arrow} ${styles.in}`} onMouseDown={decreaseDepth} onMouseUp={stopChange}><Arrow fill={arrowFillColor} /></div>
                <div className={`${styles.arrow} ${styles.clockwise}`} onMouseDown={increaseRotation} onMouseUp={stopChange}><Arrow fill={arrowFillColor} degrees={Directions.left} /></div>
                <div className={`${styles.arrow} ${styles.counterClockwise}`} onMouseDown={decreaseRotation} onMouseUp={stopChange}><Arrow fill={arrowFillColor} degrees={Directions.right} /></div>
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