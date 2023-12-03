import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../Pages/LoginPage";
import { RegisterPage } from "../Pages/RegisterPage";
import { MainPage } from "../Pages/MainPage";
import { FirstLogin } from "../Pages/FirstLogin";
import { TicketCreationPage } from "../Pages/TicketCreationPage";
import { TicketList } from "../Pages/TicketList";
import { isAuthenticated, getCurrentUser } from "../Config/auth";

export const AuthRoutes = () => {
  const isLoggedIn = isAuthenticated();
  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <MainPage /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/firstLog"
        element={isLoggedIn ? <FirstLogin /> : <Navigate to="/login" />}
      />
      <Route
        path="/createTicket"
        element={isLoggedIn ? <TicketCreationPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/ticketList"
        element={isLoggedIn ? <TicketList /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};
