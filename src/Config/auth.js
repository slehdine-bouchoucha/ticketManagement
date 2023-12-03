export const isAuthenticated = () => {
  const token = window.localStorage.getItem("token");
  return !!token;
};
export const getCurrentUser = () => {
  const user = window.localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
