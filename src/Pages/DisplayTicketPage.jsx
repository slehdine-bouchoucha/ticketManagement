import React, { useEffect, useState } from "react";
import AppLayout from "../Layout/AppLayout";
import Title from "antd/es/skeleton/Title";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Image,
  Spin,
  Tag,
  Timeline,
  Upload,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { Axios } from "../Config/axios";

function DisplayTicketPage() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [value, setValue] = useState("");
  const [fileList, setFileList] = useState([]);
  const user = JSON.parse(window.localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setIsLoading(true);
        const response = await Axios.get(`/tickets/${id}`, {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
        });
        setTicket(response.data.ticket);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching tickets:", error);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id]);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleUploadRemove = (file) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid)
    );
  };

  const customRequest = ({ file, onSuccess, onError }) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      file.dataUrl = reader.result;
      onSuccess();
    };

    reader.readAsDataURL(file);
  };

  const uploadProps = {
    customRequest: customRequest,
    onChange: handleUploadChange,
    onRemove: handleUploadRemove,
    fileList: fileList,
    multiple: true,
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleReplay = async () => {
    try {
      const formData = new FormData();
      formData.append("ticketId", id);
      formData.append("solvedBy", user._id);
      formData.append("txt", value);
      fileList.forEach((file) => {
        formData.append("images", file.originFileObj);
      });

      await Axios.post("/agent", formData, {
        headers: {
          authorization: window.localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      setValue("");
      setFileList([]);
      const response = await Axios.get(`/tickets/${id}`, {
        headers: {
          authorization: window.localStorage.getItem("token"),
        },
      });
      setTicket(response.data.ticket);

      message.success("Replay added successfully!");
    } catch (error) {
      console.error("Error adding replay:", error);
      message.error("Failed to add replay. Please try again later.");
    }
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <AppLayout>
      <Title level={3}>{id} </Title>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          padding: "20px",
        }}
      >
        {isLoading ? (
          <Spin />
        ) : (
          <div>
            <Descriptions
              title="Ticket Informations"
              items={[
                { key: "1", label: "Title", children: ticket?.title },
                { key: "2", label: "Type", children: ticket?.type },
                {
                  key: "3",
                  label: "Status",
                  children: (
                    <Tag
                      children={ticket?.status}
                      color={
                        ticket.status === "CLOSED"
                          ? "red"
                          : ticket.status === "IN PROGRESS"
                            ? "yellow"
                            : "cyan"
                      }
                    />
                  ),
                },
                {
                  key: "4",
                  label: "Created By",
                  children: ticket?.createdBy?.fullName,
                },
                {
                  key: "5",
                  label: "Email",
                  children: ticket?.createdBy?.email,
                },
                {
                  key: "6",
                  label: "Description",
                  children: ticket?.description,
                  span: 3,
                },
                {
                  key: "7",
                  label: "Attachments",
                  children: (
                    <div>
                      {ticket?.image?.map((image, i) => {
                        const uint8Array = new Uint8Array(image.data);
                        const base64String = btoa(
                          String.fromCharCode.apply(
                            null,
                            Array.from(uint8Array)
                          )
                        );
                        const dataUrl = `data:image/png;base64,${base64String}`;
                        return <Image key={i} width={200} src={dataUrl} />;
                      })}
                    </div>
                  ),
                  span: 3,
                },
              ]}
            />
            <Divider />
            {ticket.status !== "CLOSED" && (
              <>
                <h3>Add Reply</h3>
                <TextArea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Set Reply"
                  autoSize={{ minRows: 3 }}
                />
                <div>
                  <Upload {...uploadProps}>
                    {fileList.length >= 3 ? null : uploadButton}
                  </Upload>
                  <p style={{ marginTop: 8 }}>Maximum 3 images</p>
                </div>
                <Button
                  type="primary"
                  style={{ marginTop: 10 }}
                  onClick={handleReplay}
                >
                  Add Reply
                </Button>
                <Divider />
              </>
            )}
            <h3>Replies</h3>
            <Timeline>
              {ticket.replay.map((rep, index) => (
                <Timeline.Item key={index}>
                  <Card
                    title={"By: " + rep?.solvedBy?.fullName}
                    style={{ width: 300 }}
                  >
                    <p>{rep.txt}</p>
                    <div>
                      {rep.image.map((image, i) => {
                        const uint8Array = new Uint8Array(image.data);
                        const base64String = btoa(
                          String.fromCharCode.apply(
                            null,
                            Array.from(uint8Array)
                          )
                        );
                        const dataUrl = `data:image/png;base64,${base64String}`;
                        return <Image key={i} width={200} src={dataUrl} />;
                      })}
                    </div>
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default DisplayTicketPage;
