//function to add 2 decimals
const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //caculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((total, item) => total + item.price * item.qty, 0)
  );

  //caculate shipping price
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
  //caculate tax price (15%)
  state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice));
  //caculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  //save to localstorage
  localStorage.setItem("cart", JSON.stringify(state));
};
