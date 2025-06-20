import Address from "../models/Address.js";


// Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { userId } = req;
    const  {addressData}  = req.body;
    console.log(addressData, "addressData");
    await Address.create({ ...addressData, userId });
    res.status(200).json({ message: "Address added", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

// Get Address : /api/address/get
export const getAddress = async (req, res) => {
  try {
    const { userId } = req;
    const addresses = await Address.find({ userId });
    res.status(200).json({ message: "Address fetched", success: true, addresses });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};
