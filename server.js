require("events").EventEmitter.defaultMaxListeners = 10000;

const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const { Board, Led, Servo } = require("johnny-five");
const opn = require("opn");

const startUrl = "http://localhost:3000";
const port = 3000;
const boardPort = "COM4";

// pin setup
const blue = 3;
const green = 5;
const red = 6;

const servoA = 9;
const servoB = 10;
const servoC = 11;
const servoD = 12;

let board = new Board({ repl: false, port: boardPort });

// opn(startUrl, { app: "Google Chrome" });

const dev = process.env.NODE_ENV !== "production";
const next = require("next");
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

board.on("ready", () => {
  const rgb = new Led.RGB([red, green, blue]);
  const servo1 = new Servo(servoA); // Create a new Servo object. Assume the servo is attached to pin 10.
  const servo2 = new Servo(servoB); // Create a new Servo object. Assume the servo is attached to pin 10.
  const servo3 = new Servo(servoC); // Create a new Servo object. Assume the servo is attached to pin 10.
  const servo4 = new Servo(servoD); // Create a new Servo object. Assume the servo is attached to pin 10.

  nextApp.prepare().then(() => {
    app.get("*", (req, res) => {
      return nextHandler(req, res);
    });

    const server = createServer(app);
    const io = new Server(server);

    io.on("connection", (socket) => {
      console.log("a user connected");
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });

      socket.on("color change", (color) => {
        // console.log("(back) color changed to:" + color);
        rgb.color(color);
      });

      socket.on("servo1 move", (angle) => {
        // Listen to "servo1 move" event
        // console.log("(back) servo moved to:" + angle);
        servo1.to(angle); // Move the servo to the received angle
      });

      socket.on("servo2 move", (angle) => {
        // Listen to "servo2 move" event
        // console.log("(back) servo moved to:" + angle);
        servo2.to(angle); // Move the servo to the received angle
      });

      socket.on("servo3 move", (angle) => {
        // Listen to "servo3 move" event
        // console.log("(back) servo moved to:" + angle);
        servo3.to(angle); // Move the servo to the received angle
      });

      socket.on("servo4 move", (angle) => {
        // Listen to "servo4 move" event
        // console.log("(back) servo moved to:" + angle);
        servo4.to(angle); // Move the servo to the received angle
      });
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
});
