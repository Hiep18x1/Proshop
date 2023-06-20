import React from "react";
import Loader from "./Loader";
import Message from "./Message";
import { Carousel, Image } from "react-bootstrap";
import { useGetTopProductsQuery } from "../slices/productApiSlice";
import { Link } from "react-router-dom";

const ProductCarousel = () => {
  const { data: products, error } = useGetTopProductsQuery();
  return error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel pause="hover" className="mb-4 bg-primary">
      {products?.map((product) => (
        <Carousel.Item>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption>
              <h2>
                {product.name} {product.price}
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
