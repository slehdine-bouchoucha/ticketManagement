import React, { useEffect, useState } from "react";
import { Card, Button, Tag, Typography } from "antd";
import { Axios } from "../Config/axios";
import AppLayout from "../Layout/AppLayout";
const { Title } = Typography;
export const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const userId = localStorage.getItem("user_id");

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await Axios.get(`/userTickets/${userId}`);
        setTickets(response.data.userTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    if (userId) {
      fetchTickets();
    }
  }, [userId]);

  return (
    <AppLayout>
      <Title level={3}>Your Tickets</Title>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          padding: "20px",
        }}
      >
        {tickets.map((ticket) => (
          <Card key={ticket._id} title={ticket.title} style={{ width: 300 }}>
            <p>
              {" "}
              <strong>Description:</strong> {ticket.description}
            </p>
            <p>
              {" "}
              <strong>Type:</strong> {ticket.type.toUpperCase()}
            </p>
            <p>Date of Creation: {formatDateString(ticket.createdAt)}</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "yellow",
                  marginRight: 8,
                }}
              />
              <Tag color={ticket.status === "Open" ? "green" : "red"}>
                {ticket.status}
              </Tag>
            </div>
            <Button type="primary" style={{ marginTop: "10px" }}>
              See Details
            </Button>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
};
