import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuList from "./pages/MenuList";
import Cart from "./pages/Cart";
import OrderStatus from "./pages/OrderStatus";
import "./index.css";  

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MenuList />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/status/:tableNumber" element={<OrderStatus />} />
    </Routes>
  </BrowserRouter>
);
