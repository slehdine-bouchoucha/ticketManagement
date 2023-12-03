import { useNavigate } from "react-router-dom";
import AppLayout from "../Layout/AppLayout";

export const MainPage = () => {
  const navigate = useNavigate();
  const logout = () => {
    window.localStorage.clear();
    navigate("/login");
  };

  return (
    <AppLayout>
      <h3> Home page </h3>
    </AppLayout>
  );
};
