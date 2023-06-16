import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4">
      {step1 ? (
        <LinkContainer to="/login">
          <Nav.Link>Sign in</Nav.Link>
        </LinkContainer>
      ) : (
        <LinkContainer to="/login">
          <Nav.Link disabled>Sign in</Nav.Link>
        </LinkContainer>
      )}

      {step2 ? (
        <LinkContainer to="/Shipping">
          <Nav.Link>Shipping</Nav.Link>
        </LinkContainer>
      ) : (
        <LinkContainer to="/shipping">
          <Nav.Link disabled>Shipping</Nav.Link>
        </LinkContainer>
      )}

      {step3 ? (
        <LinkContainer to="/payment">
          <Nav.Link>Payment</Nav.Link>
        </LinkContainer>
      ) : (
        <LinkContainer to="/payment">
          <Nav.Link disabled>Payment</Nav.Link>
        </LinkContainer>
      )}

      {step4 ? (
        <LinkContainer to="/placeorder">
          <Nav.Link>Place Order</Nav.Link>
        </LinkContainer>
      ) : (
        <LinkContainer to="/placeorder">
          <Nav.Link disabled>Place Order</Nav.Link>
        </LinkContainer>
      )}
    </Nav>
  );
};

export default CheckoutSteps;
