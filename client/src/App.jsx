import { Backdrop, CircularProgress, CssBaseline } from "@mui/material";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/main";
import { useSession } from "./providers/session";
import Auth from "./views/auth";
import Dashboard from "./views/dashboard";
import Users from "./views/users";
import Process from "./views/process";

const App = () => {
  const { isLogged, loading } = useSession();

  if (loading) {
    return (
      <Backdrop open={loading} sx={{ zIndex: 1500 }}>
        <CircularProgress />
      </Backdrop>
    );
  }
  /* 
  if (!isLogged) {
    return <Auth />;
  } */

  return (
    <MainLayout>
      <CssBaseline />
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/process' element={<Process />} />
        <Route path='/users' element={<Users />} />
        <Route path='*' element={<Navigate to='/dashboard' />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
