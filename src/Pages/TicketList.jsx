import React, { useEffect, useState } from "react";
import { Button, Card, Popconfirm, Spin, Tag, Typography } from "antd";
import { Axios } from "../Config/axios";
import { LogoutOutlined } from "@ant-design/icons";
import AppLayout from "../Layout/AppLayout";
import { Link } from "react-router-dom";

const { Title } = Typography;
export const TicketList = () => {
  const [tickets, setTickets] = useState(null);
  const userId = localStorage.getItem("user_id");

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handleTicketClose = async (ticketId) => {
    try {
      await Axios.put(
        `/tickets/${ticketId}`,
        { status: "Closed" },
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      const updatedTickets = tickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, status: "CLOSED" } : ticket
      );
      setTickets(updatedTickets);
    } catch (error) {
      console.error("Error closing ticket:", error);
    }
  };
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);
        let response;

        if (user.role === "agent") {
          response = await Axios.get(`/agent/${user.departement}`, {
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
          });
        } else {
          response = await Axios.get(`/tickets`, {
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
          });
        }

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
        {tickets ? (
          tickets.map((ticket) => (
            <Card key={ticket._id} title={ticket.title} style={{ width: 300 }}>
              <div style={{ position: "absolute", top: 0, right: 0 }}>
                {ticket.status !== "CLOSED" && (
                  <Popconfirm
                    title="Are you sure you want to close this ticket?"
                    onConfirm={() => handleTicketClose(ticket._id)}
                    okText="Yes"
                    cancelText="No"
                    data-testid={`cancel-ticket-popover-${ticket._id}`} // Add a unique data attribute here
                  >
                    <LogoutOutlined
                      style={{ fontSize: "24px", color: "red" }}
                    />
                  </Popconfirm>
                )}
              </div>
              <p>
                <strong>Description:</strong> {ticket.description}
              </p>
              <p>
                <strong>Type:</strong> {ticket.type.toUpperCase()}
              </p>
              <p>Date of Creation: {formatDateString(ticket.createdAt)}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor:
                      ticket.status === "IN PROGRESS"
                        ? "yellow"
                        : ticket.status === "CLOSED"
                          ? "red"
                          : "green",
                    marginRight: 8,
                  }}
                />
                <Tag
                  color={
                    ticket.status === "IN PROGRESS"
                      ? "yellow"
                      : ticket.status === "CLOSED"
                        ? "red"
                        : "green"
                  }
                >
                  {ticket.status}
                </Tag>
              </div>
              <Button type="primary" style={{ marginTop: "10px" }}>
                <Link to={"/ticket/" + ticket["_id"]}>See Details </Link>
              </Button>
            </Card>
          ))
        ) : (
          <Spin />
        )}
        {tickets && !tickets.length && <h2>No Tickets</h2>}
      </div>
    </AppLayout>
  );
};
