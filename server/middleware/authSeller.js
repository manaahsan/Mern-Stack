import jwt from "jsonwebtoken";
// test
// const authSeller = (req, res, next) => {
//   const { sellerToken } = req.cookies;
//   if (!sellerToken) {
//     return res.status(401).json({ message: "Unauthorized", message: "false" });
//   }
//   try {
//     const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
//     if (
//       tokenDecode.email === process.env.ADMIN_USERNAME &&
//       tokenDecode.password === process.env.ADMIN_PASSWORD
//     ) {
//       return next();
//     } else {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized", message: "false" });
//     }
//   } catch (error) {
//     return res.status(401).json({ message: "Unauthorized", message: "false" });
//   }
// };

// export default authSeller;

const authSeller = (req, res, next) => {
  const { sellerToken } = req.cookies;
  console.log(sellerToken, "sellerToken");

  if (!sellerToken) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token" });
  }

  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
    console.log(tokenDecode, "tokenDecode");

    const isAdmin = tokenDecode.email === process.env.ADMIN_USERNAME;

    if (!isAdmin) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid credentials" });
    }

    // Optional: attach info to req
    req.seller = tokenDecode;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
export default authSeller;
