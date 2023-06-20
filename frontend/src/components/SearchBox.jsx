import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyWord } = useParams();
  const [keyword, setKeyword] = useState(urlKeyWord || "");
  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setKeyword("");
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };
  return (
    <Form className="d-flex mt-md-0 mt-3" onSubmit={searchHandler}>
      <Form.Control
        type="text"
        value={keyword}
        placeholder="Enter keyword"
        className="mr-sm-2 ml-sm-5"
        onChange={(e) => setKeyword(e.target.value)}
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="mx-2 p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
