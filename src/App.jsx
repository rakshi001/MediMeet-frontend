import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Doctors from "./pages/Doctors";
import Footer from "./components/Footer";
import DoctorInfo from "./components/DoctorInfo";
import Login from "./pages/Login";
import Appointment from "./pages/Appointment";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import ChatWindow from "./pages/ChatWindow";
import VideoCall from "./pages/VideoCall";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex flex-col min-h-screen px-20 md:px-40">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <div className="flex-grow ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorInfo />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<ChatWindow />} />
            <Route path="/patient/video-call/:roomID" element={<VideoCall />} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default App;
