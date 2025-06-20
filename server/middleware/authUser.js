import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const { token } = req.cookies;
  console.log(token, "token");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(tokenDecode, "tokenDecode");
    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
    } else {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export default authUser;
