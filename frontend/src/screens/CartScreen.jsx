import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ListGroup,
  Row,
  Col,
  ListGroupItem,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import { addToCart, removeFromCart } from "../slices/cartSlice";
const CartScreen = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkoutHandler = () => {
    ///error: if we use 'shipping' instead of '/shipping' it will be a realative router path, ex : login/shipping
    navigate("/login?redirect=/shipping");
  };
  return (
    <Row>
      <Col md={8}>
        <h1> Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroupItem key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} fluid></Image>
                  </Col>
                  <Col md={4}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) => {
                        dispatch(
                          addToCart({ ...item, qty: Number(e.target.value) })
                        );
                      }}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => dispatch(removeFromCart(item._id))}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h2>
                Subtotal(
                {cartItems.reduce((total, item) => total + Number(item.qty), 0)}
                ) items
              </h2>
              $
              {cartItems
                .reduce(
                  (total, item) => total + Number(item.qty * item.price),
                  0
                )
                .toFixed(2)}
            </ListGroupItem>
            <ListGroupItem>
              <Button
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Process To Checkout
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
