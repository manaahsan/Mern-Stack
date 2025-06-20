import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
export const AppContext = createContext<any>(null);

export const AppContextProvider = ({ children }: any) => {
  const currency = import.meta.env.VITE_CURRENCY as string;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [products, setProducts] = useState<any>([]);
  const [cartItems, setCartItems] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");

  // fetch Seller Status
  const fetchSellerStatus = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      console.log(data);
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // fetch user Auth Status, User Data cartItems
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      console.log(data, "data");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    setProducts(dummyProducts);
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {}
  };
  //  Add to cart
  const addToCart = (itemId: string) => {
    let cartData: any = structuredClone(cartItems);
    console.log(cartData, 24);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // Update cart quantity
  const UpdateCartItem = (itemId: string, quantity: number) => {
    let cartData: any = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("cart Updated");
  };

  // Remove from cart
  const removeFromCart = (itemId: string) => {
    let cartData: any = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Removed from cart");
    setCartItems(cartData);
    console.log("remove cartItem", cartData);
  };

  // Get Cart Item Count
  const getCartCount = () => {
    let totalCount: any = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  // Get Cart Total Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product: any) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };
  useEffect(() => {
    fetchProducts();
    fetchSellerStatus();
    fetchUser();
  }, []);

  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error: any) {
        console.log(error)
        // toast.error(
        //   error?.response?.data?.message ||
        //     error.message ||
        //     "Something went wrong"
        // );
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    isLogin,
    setIsLogin,
    products,
    setProducts,
    currency,
    cartItems,
    setCartItems,
    addToCart,
    UpdateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    toast,
    fetchProducts,
    fetchUser,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
