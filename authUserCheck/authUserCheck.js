const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  let token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    token = req.cookies.access_token?.token;
  }
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.json({ msg: "Access denied!" });
    req.user = user.userName;
    next();
  });
}

module.exports = {
  authenticateToken,
};
