import React from "react";
import { useEffect } from "react";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  ListGroupItem,
} from "react-bootstrap";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliveredOrderMutation,
} from "../slices/orderApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  //refetch: is a function to refetch the data
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliveredOrder, { isLoading: loadingDelivered }] =
    useDeliveredOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [
    paypal?.clientId,
    errorPayPal,
    loadingPayPal,
    order,
    paypal,
    paypalDispatch,
  ]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      console.log(details);
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment successful");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    });
  }
  function onError(err) {
    toast.error(err?.data?.message || err.error);
  }
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  const deliverHandler = async () => {
    try {
      await deliveredOrder(orderId);
      refetch();
      toast.success("Order delivered");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <>
      <h1>Order {orderId}</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroupItem>
                <h2>Shipping</h2>
                <p>
                  {" "}
                  <strong>Name: </strong> {order.user.name}
                </p>
                <p>
                  <strong>Email: </strong>
                  {order.user.email}
                </p>
                <p>
                  {" "}
                  <strong>Address:</strong> {order.shippingAddress.address},{" "}
                  {""} {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <Message variant="success">Delivered</Message>
                ) : (
                  <Message variant="danger">Not delivered</Message>
                )}
              </ListGroupItem>
              <ListGroupItem>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <Message variant="success">Paid on {order.paidAt}</Message>
                ) : (
                  <Message variant="danger">Not Paid</Message>
                )}
              </ListGroupItem>
              <ListGroupItem>
                <h2>Order Items</h2>
                <ListGroup>
                  {order.orderItems.map((item) => (
                    <ListGroupItem key={item._id}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup>
                <ListGroupItem>
                  <h2>Order Summary</h2>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroupItem>
                {!order.isPaid && (
                  <ListGroupItem>
                    {loadingPay && <Loader />}
                    {isPending ? (
                      <Loader />
                    ) : (
                      <PayPalButtons
                        createOder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    )}
                  </ListGroupItem>
                )}

                {loadingDelivered && <Loader />}
                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroupItem>
                    <Button onClick={deliverHandler}>Mark as delivered</Button>
                  </ListGroupItem>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default OrderScreen;
