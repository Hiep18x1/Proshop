import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";
const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select method</Form.Label>

          <Form.Check
            type="radio"
            className="my-3"
            id="PayPal"
            name="paymentMethod"
            label="PayPal or Credit Card"
            value="PayPal"
            checked
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

          <Button type="submit">Continue</Button>
        </Form.Group>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
