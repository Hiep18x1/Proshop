import React from "react";
import { useParams } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import Paginate from "../../components/Paginate";
const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const { data, refetch, isLoading, error } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteProduct(id);
        refetch();
        toast.success("Product deleted");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const createProductHandler = async () => {
    try {
      await createProduct();
      refetch();
      toast.success("Product created");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button size="md" onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table hover striped responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.products?.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button size="sm" variant="light" className="mx-2">
                      <FaEdit />
                    </Button>
                  </LinkContainer>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteHandler(product._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Paginate pages={data.pages} page={data.page} isAdmin={true} />
    </>
  );
};

export default ProductListScreen;
