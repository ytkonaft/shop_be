require("dotenv").config({ path: ".env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

//////////////////////////// Use express middleware here

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is running on localhost:${deets.port}`);
  }
);
