const jwt = require("jsonwebtoken");

//User Token Verification
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  let token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    token = req.cookies.access_token?.token;
  }
  if (token == null) return res.sendStatus(401);
  // .json({ error: { status: 401, msg: "Invalid token!" } });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.json({ msg: "Access denied!" });
    req.user = user.userName;
    next();
  });
}

function checkPassword(req, res) {
  const userPasswordExist = Users.findOne({ userName: req.body.userName });
  return userPasswordExist;
}
function checkUsername(req, res) {
  const userNameExist = Users.findOne({ userName: req.body.userName });
  return userNameExist;
}

module.exports = {
  authenticateToken,
  checkPassword,
  checkUsername,
};
