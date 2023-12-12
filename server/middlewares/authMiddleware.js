const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const jwt_secret ="4de49e71da8814001d14d302b24519bb59ceabd68cc4e3dfdffac21bbd6dbfa49da2b4549d4fe37f87347c0bcc4c6634ca388fac10a21362e9a29e1049b9034c"
    const decryptedToken = jwt.verify(token, jwt_secret);
    req.userId = decryptedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message, success: false });
  }
};
