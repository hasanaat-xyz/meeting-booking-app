import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import HostDashboard from "./pages/HostDashboard";
import PublicBookingPage from "./pages/PublicBookingPage";
import Register from "./pages/Register";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicBookingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<HostDashboard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
