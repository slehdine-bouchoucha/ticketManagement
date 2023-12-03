import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Axios } from "../Config/axios";
import "../style/loginPage.css";

import Image from "../assets/bg_app.png";

const { Title, Text } = Typography;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const onFinish = async (values) => {
    try {
      const user = await Axios.post("/login", {
        email: values.username,
        password: values.password,
        otp: values.otp,
      });
      window.localStorage.setItem("token", user.data.token);
      window.localStorage.setItem("user", JSON.stringify(user.data.user));
      window.localStorage.setItem("user_id", user.data.user._id);
      navigate("/", { replace: true });
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (token) {
      navigate("/createTicket");
    }
  }, [navigate]);

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${Image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="left-panel">
        <Typography
          style={{
            padding: "20px",
            marginBottom: "20px",
            fontFamily: "Roboto, sans-serif",
            color: "white",
          }}
        >
          <Title level={2} style={{ marginBottom: "10px", color: "white" }}>
            Welcome to solve your problem
          </Title>
          <Text
            strong
            style={{
              marginTop: "200px",
              fontSize: "16px",
              marginLeft: "110px",
              fontFamily: "Roboto, sans-serif",
              color: "white",
            }}
          >
            Enter your credentials below :
          </Text>
        </Typography>
        <Form
          name="loginForm"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          colon={false}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="otp"
            rules={[
              {
                required: true,
                message: "Please input the OTP code!",
              },
            ]}
          >
            <Input
              placeholder="OTP Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Link
              to="/register"
              style={{
                color: "white",
                textDecoration: "underline",
                marginLeft: "110px",
              }}
            >
              Register
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: "70px" }}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="right-panel"></div>
    </div>
  );
};
