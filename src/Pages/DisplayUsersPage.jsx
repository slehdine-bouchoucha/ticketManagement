import React, { useState, useEffect } from "react";
import AppLayout from "../Layout/AppLayout";
import { Table, Select, Button, Popconfirm, message } from "antd";

import { Axios } from "../Config/axios";

const { Option } = Select;

const DisplayUsersPage = () => {
  const [userData, setUserData] = useState([]);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await Axios.get("/admin", {
          headers: {
            authorization: window.localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        setUserData(res.data.users);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    }
    fetchUsers();
  }, []);

  const handelRole = (text, record) => {
    setUserRole(text);
    setUserData((prev) => {
      return prev.map((user) => {
        return user["_id"] === record["_id"] ? { ...user, role: text } : user;
      });
    });
  };
  const handleUpdate = async (text, record) => {
    try {
      await Axios.put(
        "/admin",
        {
          role: userRole,
          dep: text,
          userId: record["_id"],
        },
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      message.success(`Update action for ${record.fullName}`);
    } catch (error) {
      message.error(`Error updating: ${error.message}`);
    }
  };

  const handleDelete = async (record) => {
    try {
      await Axios.delete("/admin", {
        data: { userId: record["_id"] },
        headers: {
          authorization: window.localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      const updatedUserData = userData.filter(
        (user) => user._id !== record._id
      );
      setUserData(updatedUserData);
      message.success(`Delete action for ${record.userName}`);
    } catch (error) {
      message.error(`you cant delete an ADMIN`);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "userName",
      key: "name",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: 120 }}
          onChange={(value) => handelRole(value, record)}
        >
          <Option value="user">User</Option>
          <Option value="agent">Agent</Option>
        </Select>
      ),
    },
    {
      title: "Department",
      dataIndex: "departement",
      key: "department",
      render: (text, record) => {
        if (record.role === "agent") {
          return (
            <Select
              defaultValue={text}
              style={{ width: 120 }}
              onChange={(value) => handleUpdate(value, record)}
            >
              <Option value="IT">IT</Option>
              <Option value="Mechanic">Mechanic </Option>
              <Option value="Electricity"> Electricity</Option>
            </Select>
          );
        }
        return null;
      },
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      render: (text, record) => (
        <div>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div>
        <h1>Display Users</h1>

        <Table
          dataSource={userData.map((user, index) => ({
            ...user,
            key: index.toString(),
          }))}
          columns={columns}
        />
      </div>
    </AppLayout>
  );
};

export default DisplayUsersPage;
