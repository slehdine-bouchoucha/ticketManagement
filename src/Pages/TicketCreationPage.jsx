import React from "react";
import { Form, Input, Button, Upload, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AppLayout from "../Layout/AppLayout";
import { Axios } from "../Config/axios";

const { Option } = Select;

export const TicketCreationPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState([]);

  const userId = localStorage.getItem("user_id");

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("createdBy", userId);
    formData.append("type", values.type);
    formData.append("body", values.type);

    fileList.forEach((file) => {
      formData.append("images", file.originFileObj);
    });

    try {
      const response = await Axios.post("/createTicket", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Ticket created:", response.data.ticket);
      message.success("Ticket created successfully");
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Error creating ticket:", error);
      message.error("Error creating ticket");
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const logout = () => {
    window.localStorage.clear();
    navigate("/login");
  };

  return (
    <AppLayout>
      <h3> Ticket Creation </h3>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Please select a type" }]}
        >
          <Select>
            <Option value="electricity">Electricity</Option>
            <Option value="mechanic">Mechanic</Option>
            <Option value="it">IT</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="images" label="Images">
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Select Images</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Ticket
          </Button>
        </Form.Item>
      </Form>
    </AppLayout>
  );
};
