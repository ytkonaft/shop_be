const jwt = require("jsonwebtoken");

const jwtDecode = (req, res, next) => {
  const { token } = req.cookies;

  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  let decodedToken = null;
  try {
    decodedToken = jwt.verify(token, process.env.APP_SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};

module.exports = jwtDecode;
