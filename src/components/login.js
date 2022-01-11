import React, { useEffect, useState } from "react";
import { Input, Button, Spin, PageHeader, notification } from "antd";
import axios from "axios";
import { PROXY } from "../global-vars";
import { Link, useNavigate } from "react-router-dom";
import { SaveOutlined } from "@ant-design/icons/lib/icons";

function Login() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
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
            if (res.data.role === "AUTHOR") navigate("/create-book");
            else if (res.data.role === "ADMIN") navigate("/author-handle");
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const onSubmit = async () => {
    setFormLoad(true);
    //error checking
    if (userDetails.username === "" || userDetails.password === "") {
      notification.error({
        message: "All fields are required",
        description: "Please fill all fields",
      });
    } else {
      //check user details with mongodb and signin
      await axios
        .post(`${PROXY}/user/login`, userDetails)
        .then((res) => {
          if (res.data.message === "Success") {
            //save user details to local storage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("author_id", res.data.id);
            localStorage.setItem("author_name", res.data.name);
            if (res.data.role === "AUTHOR") navigate("/create-book");
            else if (res.data.role === "ADMIN") navigate("/author-handle");
          } else {
            notification.error({ message: res.data.message });
          }
        })
        .catch((err) => console.log(err));
    }
    setFormLoad(false);
  };

  const onChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate("/")}
        title="Login"
        // extra={[<Link to={'/login'}><Button type="primary" icon={<LoginOutlined/>}>Login</Button></Link>]}
      />
      <div className="main">
        <Spin spinning={formLoad}>
          <Input
            value={userDetails.username}
            onChange={onChange}
            name="username"
            placeholder="Username"
          />
          <Input.Password
            // style={{ marginBottom: "10px", marginTop: "10px" }}
            value={userDetails.password}
            onChange={onChange}
            name="password"
            placeholder="Password"
          />
          <Button onClick={onSubmit} type="primary" icon={<SaveOutlined />}>
            Submit
          </Button>
          <Link to={"/register"}>
            <Button type={"link"}>Create an account</Button>
          </Link>
        </Spin>
      </div>
    </div>
  );
}

export default Login;
