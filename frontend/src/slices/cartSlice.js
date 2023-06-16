import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUltils";
const initailState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState: initailState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
        // state.cartItems = state.cartItems.push(item);
      }

      //update cart
      updateCart(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      //update cart
      updateCart(state);
    },
    saveShippingAdress: (state, action) => {
      state.shippingAddress = action.payload;
      //update cart
      updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      //update cart
      updateCart(state);
    },
  },
});
export const {
  addToCart,
  removeFromCart,
  saveShippingAdress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
