import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import {
  useGetUserDetailQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";

const UserEditScreen = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const { data: user, isLoading, error } = useGetUserDetailQuery(userId);
  const [editUser, { isLoading: loadingEdit }] = useUpdateUserMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);
  const updateHandler = async (e) => {
    e.preventDefault();
    const updatedUser = {
      userId,
      name,
      email,
      isAdmin,
    };
    console.log(updatedUser);
    try {
      // khoong can su dung ket qua tra ve nen khong can unwrap()
      const res = await editUser(updatedUser).unwrap();
      console.log(res);
      toast.success("User updated");
      navigate("/admin/userlist");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Link to="/admin/userlist">
        <Button className="btn btn-light my-3">Go back</Button>
      </Link>
      <FormContainer>
        <h2>Edit User</h2>
        {loadingEdit && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data.message}</Message>
        ) : (
          <Form onSubmit={updateHandler}>
            <Form.Group className="my-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email" className="my-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Check
              type="checkbox"
              id="isAdmin"
              label="Is Admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            ></Form.Check>

            <Button type="submit" className="my-2" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
