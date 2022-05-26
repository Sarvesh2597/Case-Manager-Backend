// token middleware
const secret = "strongSECret";
const jwt = require("jsonwebtoken");
function validateToken(req, res, next) {
  try {
    if (req.headers["authorization"]) {
      const token = req.headers["authorization"].split(" ")[1];
      jwt.verify(token, secret, function(err, decoded) {
        if (err) throw err;
        req.user = decoded;
        next();
      });
    } else {
        throw new Error('No auth header')
    }
  } catch (err) {
      console.log(err)
    res.status(403).send({ message: "Auth err" });
  }
}

module.exports = { secret, validateToken };
