import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography } from "antd";
import { Axios } from "../Config/axios";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import "../style/loginPage.css";
import Image from "../assets/bg_app.png";

const { Title, Text } = Typography;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const token = window.localStorage.getItem("token");

  if (token) {
    navigate("/");
  }

  const onFinish = async () => {
    try {
      const user = await Axios.post("/user/register", {
        email,
        password,
        userName,
        fullName,
      });
      const { email: userEmail, otpauth_url: otpAuthUrl } = user.data.user;
      localStorage.setItem("registeredEmail", userEmail);
      localStorage.setItem("otpAuthUrl", otpAuthUrl);
      navigate("/firstLog", { replace: true });
      console.log(localStorage.getItem("otpAuthUrl"));
      // Handle successful registration and navigation as needed
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };

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
            Create your account to start
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
        <Form name="registerForm" onFinish={onFinish} colon={false}>
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
              placeholder="Username"
              prefix={<UserOutlined />}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              type="email"
              placeholder="Email"
              prefix={<MailOutlined />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please input your Full Name!",
              },
            ]}
          >
            <Input
              placeholder="Full Name"
              prefix={<UserOutlined />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              placeholder="Password"
              prefix={<LockOutlined />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="right-panel"></div>
    </div>
  );
};
