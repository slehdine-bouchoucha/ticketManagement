import React, { useState } from "react";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(window.localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const logout = () => {
    window.localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleMenuItemClick = (key) => {
    if (key === "logout") {
      logout();
    } else {
      navigate(key);
    }
  };

  const path = window.location.pathname;

  let items = [
    {
      key: "/",
      icon: <UserOutlined />,
      label: "Home",
    },
    {
      key: "/createTicket",
      icon: <UploadOutlined />,
      label: "Add Ticket",
    },
    {
      key: "/ticketList",
      icon: <VideoCameraOutlined />,
      label: "See Tickets",
    },
  ];

  if (user.role === "ADMIN") {
    items = [
      ...items,
      {
        key: "/add-user",
        icon: <VideoCameraOutlined />,
        label: "Add User",
      },
      {
        key: "/displayUsers",
        icon: <VideoCameraOutlined />,
        label: "Display Users",
      },
      {
        key: "/History_Users",
        icon: <VideoCameraOutlined />,
        label: "History Users",
      },
    ];
  }

  return (
    <Layout style={{ width: "100vw", height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[path]}
          onClick={({ key }) => handleMenuItemClick(key)}
          items={[
            ...items,
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Logout",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          <div style={{ marginRight: 16 }}>
            <p style={{ margin: 0, fontWeight: "bold" }}>
              <UserOutlined />
              {user.userName}
            </p>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflow: "scroll",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
