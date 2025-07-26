import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import Reservation from "./components/Reservation/Reservation";
import ChatWidget from "./components/Chat/ChatWidget";
import "./components/Chat/FloatingChatButton.css"; // đảm bảo tồn tại

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <div className="app">
        <ToastContainer autoClose={1500}  />
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/reservation" element={<Reservation />} />
        </Routes>

        <div className="floating-chat-button" onClick={() => setChatOpen(!chatOpen)}>
          💬
        </div>

        {chatOpen && <ChatWidget />}
      </div>

      <Footer />
    </>
  );
};

export default App;
