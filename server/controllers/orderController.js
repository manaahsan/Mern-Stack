import Order from "../models/order.js";
import Product from "../models/product.js";
import Stripe from "stripe";
import User from "../models/user.js";

// place order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const {userId} = req;
    if (!address || !items) {
      return res
        .status(400)
        .json({ message: "Invalid address or items", success: false });
    }
    // calculate Amount price
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax charge (2%)
    amount += Math.floor(amount * 0.02);
    await Order.create({
      userId,
      items,
      amount,
      address,
      totalPrice: amount,
      paymentType: "COD",
    });
    return res.status(200).json({
      message: "Order placed successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

// place order COD : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const {userId} = req;
    const { origin } = req.headers;
    if (!address || !items) {
      return res
        .status(400)
        .json({ message: "Invalid address or items", success: false });
    }
    let productData = [];
    // calculate Amount price
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax charge (2%)
    amount += Math.floor(amount * 0.02);
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      totalPrice: amount,
      paymentType: "Online",
    });

    // stripe gateway
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    // create line items for stripe

    const line_items = productData?.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });

    // create Session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });
    return res.status(200).json({
      url: session.url,
      message: "Order placed successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

//  stripe webhook
export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECERATE
    );
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
  // handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      // get session meta data
      const session = await stripeInstance.checkout.sessions.retrieve({
        payement_intent: paymentIntentId,
      });
      const { orderId, userId } = session.data[0].metadata;
      // make payment paid

      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        paymentType: "Online",
        paymentId: paymentIntentId,
      });
      // clear cart data
      await User.findByIdAndUpdate(userId, {});
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      // get session meta data
      const session = await stripeInstance.checkout.sessions.retrieve({
        payement_intent: paymentIntentId,
      });
      const { orderId } = session.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
      break;
    }
    default:
      console.log(`unhandled event type ${event.type}`);
      break;
  }
  res.json({ success: true });
};
// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req;
    const orders = await Order.find({
      userId,
      $or: [
        {
          paymentType: "COD",
        },
        {
          isPaid: true,
        },
      ],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Successfully fetched all orders",
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Get All Orders : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        {
          paymentType: "COD",
        },
        {
          isPaid: true,
        },
      ],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Successfully fetched all orders",
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
