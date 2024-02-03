const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).send({ error: "You are not logged in" });
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data.verified) throw new Error("Please verify");
    req.user = data;
    next();
  } catch (error) {
    res.clearCookie("token").status(401).json({
      error: "Please log in to access this resource.",
    });
  }
};
