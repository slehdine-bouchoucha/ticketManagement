import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, Typography } from "antd";

import { Axios } from "../Config/axios";
import "../style/loginPage.css";
import QRCode from "qrcode.react";

import Image from "../assets/bg_app.png";

const { Title, Text } = Typography;

export const FirstLogin = () => {
  const navigate = useNavigate();

  const [urlOtp, setUrlOtp] = useState(
    localStorage.getItem("otpAuthUrl")?.replace("&algorithm=SHA512", "")
  );
  const [otp, setOtp] = useState("");

  useEffect(() => {
    setInterval(() => {
      const otpAuthUrl = localStorage
        .getItem("otpAuthUrl")
        ?.replace("&algorithm=SHA512", "");
      setUrlOtp(otpAuthUrl);
    }, 1000);
  }, []);

  const registeredEmail = window.localStorage.getItem("registeredEmail");

  if (!registeredEmail) {
    window.localStorage.clear();
    navigate("/login");
  }

  const onFinish = async (values) => {
    try {
      const userEmail = localStorage.getItem("registeredEmail");
      const user = await Axios.post("/user/verifyOtp", {
        email: userEmail,
        otp: otp,
      });
      window.localStorage.setItem("token", user.data.token);
      window.localStorage.setItem("user", JSON.stringify(user.data.user));
      window.localStorage.setItem("user_id", user.data.user._id);
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (error) {
      alert(error.response.data.message);
      console.log(error.response.data);
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
            This is your Log IN to our website
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
            Please Enter your credentials below and verify your code:
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
          {urlOtp ? (
            <div style={{ textAlign: "center", margin: "20px" }}>
              <QRCode value={urlOtp} />
            </div>
          ) : (
            <span>Loading QR code...</span>
          )}

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
