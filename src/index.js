require("dotenv").config({ path: ".env" });
const cookieParser = require("cookie-parser");
const createServer = require("./createServer");
const db = require("./db");
const jwtDecode = require("./middleware/jwt");

const server = createServer();

server.express.use(cookieParser());

server.express.use(jwtDecode);

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
