import React, { useState, useEffect } from "react";
import { Input, Button, Spin, PageHeader, notification } from "antd";
import axios from "axios";
import { PROXY } from "../global-vars";
import { useNavigate } from "react-router-dom";
import { SaveOutlined } from "@ant-design/icons/lib/icons";

function Register() {
  const navigate = useNavigate();
  const [regDetails, setRegDetails] = useState({
    name: "",
    username: "",
    password: "",
    confirmpwd: "",
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

  const onChange = (e) => {
    setRegDetails({ ...regDetails, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    setFormLoad(true);
    //error checking in input fields
    if (
      regDetails.name === "" ||
      regDetails.username === "" ||
      regDetails.password === "" ||
      regDetails.confirmpwd === ""
    ) {
      notification.error({
        message: "All fields are required",
        description: "Please fill all fields",
      });
    } else if (regDetails.username.length < 6) {
      notification.error({
        message: "Username length should be more than 6 characters",
      });
    } else if (regDetails.password.length < 8) {
      notification.error({
        message: "Username length should be more than 8 characters",
      });
    } else if (regDetails.password !== regDetails.confirmpwd) {
      notification.error({
        message: "Passwords not match",
      });
    } else {
      //register user details to the db
      await axios
        .post(`${PROXY}/user/register`, regDetails)
        .then((res) => {
          if (res.data.message === "Successfully Registered") {
            notification.success({ message: res.data.message });
            navigate("/login");
          } else {
            notification.error({ message: res.data.message });
          }
        })
        .catch((err) => console.log(err));
    }
    setFormLoad(false);
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate("/login")}
        title="Register"
        // extra={[<Link to={'/login'}><Button type="primary" icon={<LoginOutlined/>}>Login</Button></Link>]}
      />
      <div className="main">
        <Spin spinning={formLoad}>
          <Input
            value={regDetails.name}
            onChange={onChange}
            name="name"
            placeholder="Name"
          />
          <Input
            value={regDetails.username}
            onChange={onChange}
            name="username"
            placeholder="Username"
          />
          <Input.Password
            // style={{ marginBottom: "10px", marginTop: "10px" }}
            value={regDetails.password}
            onChange={onChange}
            name="password"
            placeholder="Password"
          />
          <Input.Password
            // style={{ marginBottom: "10px", marginTop: "10px" }}
            value={regDetails.confirmpwd}
            onChange={onChange}
            name="confirmpwd"
            placeholder="Confirm Password"
          />
          <Button onClick={onSubmit} type="primary" icon={<SaveOutlined />}>
            Register
          </Button>
        </Spin>
      </div>
    </div>
  );
}

export default Register;
