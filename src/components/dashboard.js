import { LoginOutlined } from "@ant-design/icons/lib/icons";
import { Button, Col, Input, PageHeader, Row, Select, Skeleton } from "antd";
import Search from "antd/lib/transfer/search";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PROXY } from "../global-vars";
import BookCard from "./re-usable/book-card";

function Dashboard() {
  const [bookList, setBookList] = useState([]);
  const [bookListCopy, setBookListCopy] = useState([]);
  const [searchParams, setSearchParams] = useState({
    searchKey: "book_name",
    searchWord: "",
  });
  const [load, setLoad] = useState(false);

  /**
   * Load all books from db and set to state
   */
  useEffect(() => {
    setLoad(true);
    axios
      .get(`${PROXY}/book/`)
      .then((res) => {
        setBookList(res.data);
        setBookListCopy(res.data);
      })
      .catch((err) => console.log(err));
    setLoad(false);
  }, []);

  /**
   * front end search function with search key and search keyword
   */
  const searchData = (value) => {
    if (searchParams.searchKey) {
      const newSearchResult = bookListCopy.filter((r) => {
        return r[searchParams.searchKey]?.search(new RegExp(value, "i")) > -1;
      });
      setBookList(newSearchResult);
    }
  };

  const selectAfterOnChange = (value) => {
    setSearchParams({ ...searchParams, searchKey: value });
  };

  const selectAfter = (
    <Select
      value={searchParams.searchKey}
      className="select-after"
      onChange={selectAfterOnChange}
    >
      <Select.Option value="book_name">Book Title</Select.Option>
      <Select.Option value="author_name">Author Name</Select.Option>
    </Select>
  );

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Dashboard"
        extra={[
          <Link to={"/login"} key={0}>
            <Button type="primary" icon={<LoginOutlined />}>
              Login
            </Button>
          </Link>,
        ]}
      />
      <div className="main">
        <Input
          placeholder="Search by title"
          allowClear
          enterButton="Search"
          size="meddle"
          addonAfter={selectAfter}
          onChange={(e) => {
            searchData(e.target.value);
            // setSearchWord(e.target.value);
          }}
          //   onSearch={onSearch}
        />
        {bookList.length !== 0 ? (
          //Row and Col use to get responsive
          <Row gutter={16}>
            {bookList.map((value, index) => {
              return (
                <Col key={index} xl={8}>
                  <BookCard
                    key={index}
                    book_name={value.book_name}
                    isbn_number={value.isbn_number}
                    amount={value.amount}
                    author_name={value.author_name}
                  />
                </Col>
              );
            })}
          </Row>
        ) : (
          <Skeleton active={load} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
