import User from "../models/user.js";
// Update User Cart : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const { userId } = req;
    const { cartItems } = req.body;
    console.log(userId, cartItems, "userId, cartItems");
    await User.findByIdAndUpdate(userId, { cartItems });
    res.status(200).json({ message: "Cart updated", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};
