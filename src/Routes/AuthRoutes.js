import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../Pages/LoginPage";
import { RegisterPage } from "../Pages/RegisterPage";
import { MainPage } from "../Pages/MainPage";
import { FirstLogin } from "../Pages/FirstLogin";
import { TicketCreationPage } from "../Pages/TicketCreationPage";
import { TicketList } from "../Pages/TicketList";
import { isAuthenticated, getCurrentUser } from "../Config/auth";
import DisplayUsersPage from "../Pages/DisplayUsersPage";

export const AuthRoutes = () => {
  const isLoggedIn = isAuthenticated();

  const user = JSON.parse(window.localStorage.getItem("user") || "{}");

  console.log(user.role);
  const isAdmin = user.role === "ADMIN";

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <MainPage /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/firstLog" element={<FirstLogin />} />
      <Route
        path="/createTicket"
        element={isLoggedIn ? <TicketCreationPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/ticketList"
        element={isLoggedIn ? <TicketList /> : <Navigate to="/login" />}
      />

      <Route
        path="/add-user"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <TicketList />
            ) : (
              <Navigate to="/" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/displayUsers"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <DisplayUsersPage />
            ) : (
              <Navigate to="/" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};
