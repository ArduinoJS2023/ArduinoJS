"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from "../styles/Cool.module.css"
import io from "socket.io-client";
import Arrow2 from '../components/icons/Arrow2';
import { Directions } from '../constants/directions';
import { hslToHex } from '../utils/colors';
import Button from '../components/button/Button';

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

    const btns = useMemo(() => [
        { style: styles.up, action: increaseVertical },
        { dir: Directions.down, style: styles.down, action: decreaseVertical },
        { dir: Directions.left, style: styles.left, action: increaseHorizontal },
        { dir: Directions.right, style: styles.right, action: decreaseHorizontal },
        { style: styles.in, action: decreaseDepth },
        { dir: Directions.down, style: styles.out, action: increaseDepth },
        { dir: Directions.left, style: styles.clockwise, action: increaseRotation },
        { dir: Directions.right, style: styles.counterClockwise, action: decreaseRotation }
    ], []);

    return (
        <div className={styles["bg-container"]}>
            <div className={styles.controler} onMouseUp={() => stopChange()}>
                <div className={styles["button-group"]}>
                    {btns.map((btn, idx) => <Button
                        key={idx + btn.style}
                        label={<Arrow2 fill={arrowFillColor} degrees={btn.dir} />}
                        className={`${styles.arrow} ${btn.style}`}
                        // onMouseDown={() => btn.action()}
                        // onMouseUp={() => stopChange()}
                        onTouchStart={() => btn.action()}
                        onTouchEnd={() => stopChange()}
                    />)}
                </div>
            </div>

            <div className={styles.monitor}>
                <p>Horizontal Index: {horizontalIndex}</p>
                <p>Vertical Index: {verticalIndex}</p>
                <p>Depth Index: {depthIndex}</p>
                <p>Rotation Index: {rotationIndex}</p>
            </div>
        </div >
    );
}
export default Cool;