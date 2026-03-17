import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CreateOrderPage from "../pages/CreateOrderPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import TrackOrderPage from "../pages/TrackOrderPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-order" element={<CreateOrderPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
