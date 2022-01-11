import { LogoutOutlined, SaveOutlined } from "@ant-design/icons/lib/icons";
import { Input, Button, PageHeader, Spin, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROXY } from "../global-vars";

function CreateBook() {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    book_name: "",
    isbn_number: "",
    amount: "",
    author: "",
  });
  const [formLoad, setFormLoad] = useState(false);

  /**
   * Authentication checking with token
   */
  useEffect(async () => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      await axios
        .get(`${PROXY}/user/getIdAndRole`, {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          if (res.data.isLogginIn === false) {
            localStorage.clear();
          } else {
            if (res.data.role === "ADMIN") navigate("/author-handle");
          }
        })
        .catch((err) => console.log(err));
    } else {
      navigate("/login");
    }
  }, []);

  const onChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    setFormLoad(true);

    //error checking in input field
    if (
      book.book_name === "" ||
      book.isbn_number === "" ||
      book.amount === ""
    ) {
      notification.error({
        message: "All fields are required",
        description: "Please fill all fields",
      });
    } else if (isNaN(book.isbn_number) || isNaN(book.amount)) {
      notification.error({
        message: "ISBN Number and Amount Should be Number",
        description: "Please enter number value",
      });
    } else {
      //save book to the mongodb
      await axios
        .post(
          `${PROXY}/book/create-book`,
          {
            ...book,
            author: localStorage.getItem("author_id"),
            author_name: localStorage.getItem("author_name"),
          },
          {
            headers: { "x-access-token": localStorage.getItem("token") },
          }
        )
        .then((res) => {
          if (res.data.isLogginIn === false) {
            notification.error({
              message: res.data.message,
              description: "Please login again",
            });
            localStorage.clear();
            navigate("/login");
          } else {
            notification.success({ message: res.data.message });
          }
          setBook({
            book_name: "",
            isbn_number: "",
            amount: "",
            author: "",
          });
        });
    }

    setFormLoad(false);
  };

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        // onBack={() => navigate("/login")}
        title="Create a Book"
        extra={[
          <Button type="danger" icon={<LogoutOutlined />} onClick={onLogout}>
            Logout
          </Button>,
        ]}
      />
      <div className="main">
        <Spin spinning={formLoad}>
          <Input
            value={book.book_name}
            onChange={onChange}
            name="book_name"
            placeholder="Book Name"
          />
          <Input
            value={book.isbn_number}
            onChange={onChange}
            name="isbn_number"
            placeholder="ISBN Number"
          />
          <Input
            value={book.amount}
            onChange={onChange}
            name="amount"
            placeholder="Amount"
          />
          <Button onClick={onSubmit} type="primary" icon={<SaveOutlined />}>
            Save Book
          </Button>
        </Spin>
      </div>
    </div>
  );
}

export default CreateBook;
