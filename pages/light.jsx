"use client";

import { useEffect, useState, useRef, useCallback } from "react";
// import { useMouse } from "react-use";
import Link from 'next/link';
import io from "socket.io-client";
import styles from "../styles/Light.module.css";
import throttle from "lodash.throttle";

const Light = () => {
  const hoveringEnabled = useRef(false); // Ref for hovering state
  const socket = useRef(); // Ref for socket connection
  const [movingElements, setMovingElements] = useState([]); // State for moving elements
  const whiteArrowsRef = useRef([]); // Ref for white arrows
  const innerCircleRef = useRef(null); // Ref for inner circle
  const colorCircleRef = useRef(null); // Ref for color circle
  const initialArrowColors = useRef([]); // Ref for initial arrow colors
  const initialCircleColor = useRef(""); // Ref for initial circle color
  const [bubblesDancing, setBubblesDancing] = useState(false); // State for bubble animation
  const [mouseDirection, setMouseDirection] = useState(""); // State for mouse direction

  const innerCircleRadius = 80; // Define the radius of the inner circle
  let prevX = 0;
  let prevY = 0;

  const handleMouseDown = useCallback(() => {
    let servoAngle = 180; // define the angle you want when button is pressed
    console.log("(front) Servo4 moved to: " + servoAngle);
    socket.current.emit("servo4 move", servoAngle); // emit the "servo4 move" event
  }, []);

  const handleMouseUp = useCallback(() => {
    let servoAngle = 0; // define the angle you want when button is released
    console.log("(front) Servo4 moved to: " + servoAngle);
    socket.current.emit("servo4 move", servoAngle); // emit the "servo4 move" event
  }, []);

  const handleMouseMove = useCallback(
    throttle((e) => {
      if (!hoveringEnabled.current) return;

      const colorCircle = colorCircleRef.current;
      const rect = colorCircle.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 180;

      const adjustedAngle = (angle + 270) % 360;
      const colorHSL = `hsl(${adjustedAngle}, 100%, 50%)`;
      const colorRGB = hslToRgb(adjustedAngle / 360, 1, 0.5);
      const colorHex = rgbToHex(colorRGB[0], colorRGB[1], colorRGB[2]);

      colorCircle.style.backgroundColor = colorHSL;

      whiteArrowsRef.current.forEach((arrow, index) => {
        arrow.style.color = colorHex;
        if (!hoveringEnabled.current) {
          arrow.style.color = initialArrowColors.current[index];
        }
      });
      innerCircleRef.current.style.backgroundColor = colorHex;

      console.log("(front) Color changed to: " + colorHex);
      socket.current.emit("color change", colorHex);

      const prevAngle =
        (Math.atan2(prevY - centerY, prevX - centerX) * 180) / Math.PI + 180;
      const isMovingAway = adjustedAngle > prevAngle;
      const isMovingTowardsCenter =
        Math.sqrt(dx * dx + dy * dy) < Math.sqrt(prevX * prevX + prevY * prevY);

      const isInsideInnerCircle =
        Math.sqrt(dx * dx + dy * dy) < innerCircleRadius;

      if (
        (adjustedAngle > 225 && adjustedAngle < 315) ||
        (adjustedAngle > 45 && adjustedAngle < 135)
      ) {
        if (!isInsideInnerCircle && isMovingAway && !isMovingTowardsCenter) {
          const servoAngle = ((adjustedAngle - 90) / 180) * 180; // Map 90-270 range to 0-180
          // console.log("(front) Servo1 moved to: " + servoAngle);
          socket.current.emit("servo1 move", servoAngle); // Emit the "servo move" event
        }
      }

      if (
        adjustedAngle > 315 ||
        adjustedAngle < 45 ||
        (adjustedAngle > 135 && adjustedAngle < 225)
      ) {
        if (!isInsideInnerCircle && isMovingAway && !isMovingTowardsCenter) {
          let servoAngle;
          if (adjustedAngle > 315 || adjustedAngle < 45) {
            // Map [0, 45] union [315, 360] to [0, 90]
            servoAngle =
              ((adjustedAngle < 45 ? adjustedAngle : adjustedAngle - 315) /
                45) *
              90;
          } else {
            // Map [135, 225] to [90, 0]
            servoAngle = 90 - ((adjustedAngle - 135) / 90) * 90;
          }
          console.log("(front) Servo2 moved to: " + servoAngle);
          const mappedServoAngle = (servoAngle / 90) * 180; // Map 0-90 range to 0-180
          socket.current.emit("servo2 move", mappedServoAngle); // Emit the "servo move" event
        }
      }

      setMovingElements((prevElements) =>
        prevElements.map((element) => ({
          ...element,
          left: element.left + e.movementX * 0.5,
          top: element.top + e.movementY * 0.5,
        }))
      );

      const xDirection = e.movementX > 0 ? "right" : "left";
      const yDirection = e.movementY > 0 ? "down" : "up";
      const direction =
        Math.abs(e.movementX) > Math.abs(e.movementY) ? xDirection : yDirection;
      setMouseDirection(direction);

      prevX = dx;
      prevY = dy;
    }, 0.8),
    []
  );

  const handleMouseEnter = useCallback(() => {
    hoveringEnabled.current = true;
    socket.current.emit("servos stop");
    console.log("Mouse entered the inner circle.");
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoveringEnabled.current = false;
    console.log("Mouse left the outer circle.");
    socket.current.emit("color change", "#000000"); // Turn off the LED
    setBubblesDancing(true);
    setMouseDirection("");
    setTimeout(() => {
      setBubblesDancing(false);
      setMovingElements((prevElements) =>
        prevElements.map((element) => ({
          ...element,
          hidden: true, // Hide all elements
        }))
      );
      setMouseDirection("");
      whiteArrowsRef.current.forEach((arrow, index) => {
        arrow.style.color = initialArrowColors.current[index]; // Restore the original arrow colors
      });
      innerCircleRef.current.style.backgroundColor = initialCircleColor.current; // Restore the original inner circle color
    }, 30);
  }, []);

  useEffect(() => {
    socket.current = io();

    const initialElements = Array.from({ length: 10 }, (_, index) => ({
      id: index,
      left: Math.random() * 500,
      top: Math.random() * 500,
    }));

    setMovingElements(initialElements);

    whiteArrowsRef.current.forEach((arrow) => {
      initialArrowColors.current.push(arrow.style.color);
    });
    initialCircleColor.current = innerCircleRef.current.style.backgroundColor;
  }, []);

  useEffect(() => {
    const moveBubblesInterval = setInterval(() => {
      if (!hoveringEnabled.current) {
        setMovingElements((prevElements) =>
          prevElements.map((element) => ({
            ...element,
            left: element.left + Math.random() * 10 - 5,
            top: element.top + Math.random() * 10 - 5,
          }))
        );
      }
    }, 40);

    return () => {
      clearInterval(moveBubblesInterval);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Link href="/cool">
        <button className={styles["cool-button"]}>Go to Light</button>
      </Link>
      <div className={styles.monitor}>{mouseDirection}</div>
      <div
        id="color-circle"
        className={styles.colorCircle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={colorCircleRef}
      >
        <div
          id="inner-circle"
          className={styles.innerCircle}
          onMouseEnter={handleMouseEnter}
          ref={innerCircleRef}
        ></div>
        {movingElements.map((element) => (
          <div
            key={element.id}
            className={`${styles.movingElement} ${bubblesDancing ? styles.dancing : ""
              }`}
            style={{
              left: element.left,
              top: element.top,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }}
          ></div>
        ))}
        <div
          className={`${styles.arrow} ${styles.up} ${mouseDirection === "up" ? styles.active : ""
            }`}
          ref={(el) => (whiteArrowsRef.current[0] = el)}
        >
          &#x2191;
        </div>
        <div
          className={`${styles.arrow} ${styles.right} ${mouseDirection === "right" ? styles.active : ""
            }`}
          ref={(el) => (whiteArrowsRef.current[1] = el)}
        >
          &#x2192;
        </div>
        <div
          className={`${styles.arrow} ${styles.down} ${mouseDirection === "down" ? styles.active : ""
            }`}
          ref={(el) => (whiteArrowsRef.current[2] = el)}
        >
          &#x2193;
        </div>
        <div
          className={`${styles.arrow} ${styles.left} ${mouseDirection === "left" ? styles.active : ""
            }`}
          ref={(el) => (whiteArrowsRef.current[3] = el)}
        >
          &#x2190;
        </div>
      </div>
    </div>
  );
};

// Helper function to convert HSL color to RGB
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Helper function to convert RGB color to hex
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export default Light;