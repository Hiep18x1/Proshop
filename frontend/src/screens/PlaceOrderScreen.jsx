import React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Image,
  Button,
} from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { clearCartItems } from "../slices/cartSlice";
import { useCreateOderMutation } from "../slices/orderApiSlice";

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  useEffect(() => {
    if (!cart.shippingAddress) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.shippingAddress, cart.paymentMethod, navigate]);

  const [createOrder, { isLoading, error }] = useCreateOderMutation();
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h2>Shipping </h2>
              <strong>Adress:</strong> {cart.shippingAddress.address}, {""}
              {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},{" "}
              {cart.shippingAddress.country}
            </ListGroupItem>

            <ListGroupItem>
              <h2>Payment Method </h2>
              <strong>Method:</strong> {cart.paymentMethod}
            </ListGroupItem>

            <ListGroupItem>
              <h2>Order Items </h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroupItem>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} fluid rounded></Image>
                        </Col>
                        <Col>
                          <Link>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush ">
            <ListGroupItem>
              <h2>Order Summary</h2>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col>Items:</Col>
                <Col>${cart.itemsPrice}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col>Shipping:</Col>
                <Col>${cart.shippingPrice}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col>Tax:</Col>
                <Col>${cart.taxPrice}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col>Total:</Col>
                <Col>${cart.totalPrice}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              {error && <Message variant="danger">{error}</Message>}
            </ListGroupItem>
            <ListGroupItem>
              <Button
                type="button"
                className="btn-block"
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                Place order
              </Button>
              {isLoading && <Loader />}
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
