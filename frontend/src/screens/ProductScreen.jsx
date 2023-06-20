import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Col,
  Row,
  Image,
  ListGroup,
  Card,
  Button,
  ListGroupItem,
  Form,
  FormGroup,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Rating from "../components/Rating";
import {
  useGetProductDetailsQuery,
  useCreateProductReviewMutation,
} from "../slices/productApiSlice.js";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const ProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [createProductReview, { isLoading: loadingProductReview }] =
    useCreateProductReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  // submit form review
  const submitHandler = async (e) => {
    e.preventDefault();
    //upwrap to get data rrom response
    try {
      await createProductReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  //[...Array(product.countInStock).keys()] : tao ra 1 array voi cac phan tu tu 0 -> length -1
  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Go back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              {/* fluid make the image respnsive and fluid within paretns   */}
              <Image src={product.image} rounded fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviewers`}
                  ></Rating>
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroupItem>
                  Description: {product.description}
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out of stock"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroupItem>
                      <Row>
                        <Col>Quantity</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                  <ListGroupItem>
                    <Button
                      className="btn-block"
                      disabled={product.countInStock === 0}
                      type="button"
                      onClick={addToCartHandler}
                    >
                      Add to cart
                    </Button>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review">
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 ? (
                <Message>No reviews</Message>
              ) : (
                // review list
                <>
                  <ListGroup variant="flush">
                    {product.reviews.map((review) => (
                      <ListGroupItem key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating}></Rating>
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </>
              )}
              {/* review form */}
              <ListGroupItem>
                <h2>Write a Customer Review</h2>
                {loadingProductReview && <Loader />}
                {/* check if login or not */}
                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    <Form.Group>
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>
                    <FormGroup>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        row="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></Form.Control>
                    </FormGroup>
                    <Button disabled={loadingProductReview} type="submit">
                      Submit
                    </Button>
                  </Form>
                ) : (
                  <Message>
                    Please <Link to="/login">sign in</Link> to write a review
                  </Message>
                )}
              </ListGroupItem>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
