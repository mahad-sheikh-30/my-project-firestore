const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Access denied. No token." });

  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = decoded;

    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Access denied. Admins only." });

    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};
