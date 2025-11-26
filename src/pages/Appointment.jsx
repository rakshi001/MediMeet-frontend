import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import DisplayNearByPharmacy from "../components/DisplayNearByPharmacy";
import ChatWindow from "./ChatWindow";
import { jwtDecode } from "jwt-decode";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  // ...existing code...
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  // ...existing code...

  const [patId, setPatId] = useState();
  const [patientName, setPatientName] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const doctorId = decodedToken?.id;

  // Add this function at the top of your file
  function parseJwt(token) {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      // console.log(jsonPayload)
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          "https://medifypro-backend.onrender.com/api/user/profile",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const user = response.data.user;
          console.log(response.data);
          setPatId(user.id);
          setPatientName(user.name || "Patient");
          // console.log("appointment userId:", patId, "userName:", patientName);
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("An error occurred while fetching the profile data");
      }
    };

    fetchProfileData();
  }, []);

  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    const fetchDoctorName = async () => {
      try {
        const response = await axios.get(
          `https://medifypro-backend.onrender.com/api/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // setDoctorName(response.data.doctor);
        // console.log(response.data)
        // console.log(doctorId)
      } catch (error) {
        // setDoctorName("Doctor");
        console.log(error);
      }
    };

    fetchDoctorName();
  }, []);

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(
        "https://medifypro-backend.onrender.com/api/appointments/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.patientAppointments) {
        setAppointments(data.patientAppointments);
      } else {
        toast.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("An error occurred while fetching appointments.");
    } finally {
      setLoading(false);
    }
  };

  // Delete appointment
  const deleteAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.delete(
        `https://medifypro-backend.onrender.com/api/appointments/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.message) {
        toast.success(data.message);
        setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
      } else {
        toast.error("Failed to delete appointment");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("An error occurred while deleting the appointment.");
    }
  };

  // Submit review
  const submitReview = async () => {
    try {
      const { data } = await axios.post(
        `https://medifypro-backend.onrender.com/api/doctor/${selectedDoctorId}/review`,
        { review, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.message) {
        toast.success(data.message);
        setShowReviewModal(false);
        setReview("");
        setRating(0);
      } else {
        toast.error("Failed to add review");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "An error occurred while adding the review.";
      toast.error(msg);
    }
  };

  // Update appointment
  const updateAppointment = async () => {
    try {
      const { data } = await axios.put(
        `https://medifypro-backend.onrender.com/api/user/${selectedAppointmentId}`,
        { date: newDate, time: newTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Appointment updated successfully!");
        setShowUpdateModal(false);
        fetchAppointments();
      } else {
        toast.error("Failed to update appointment");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "An error occurred while updating appointment.";
      toast.error(msg);
    }
  };

  // Initiate Razorpay payment
  const initPay = (order) => {
    const options = {
      key: "rzp_test_VuXL9xKSfucJ3D",
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Payment for doctor appointment",
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `https://medifypro-backend.onrender.com/api/user/verify`,
            response,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (data.success) {
            fetchAppointments();
            navigate("/appointment");
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
    };

    new window.Razorpay(options).open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `https://medifypro-backend.onrender.com/api/user/payment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) initPay(data.order);
    } catch (error) {
      console.error("Error in appointment payment:", error);
      toast.error("An error occurred during appointment payment.");
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="p-4 mt-14">
      <h2 className="text-xl font-semibold mb-2">My Appointments</h2>
      <hr />

      {appointments.length === 0 ? (
        <p className="text-center mt-6">No Appointments found.</p>
      ) : (
        appointments.map((appointment, ind) => (
          <div key={ind} className="my-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Doctor Info */}
              <div className="flex gap-4">
                <img
                  src={appointment.doctorId.image}
                  className="w-44 bg-[#eaefff] rounded"
                  alt="Doctor"
                />
                <div>
                  <h2 className="text-xl font-semibold">
                    {appointment.doctorId.name}
                  </h2>
                  <p className="text-gray-700">
                    {appointment.doctorId.speciality}
                  </p>
                  <p className="text-blue-800 font-medium mt-2">
                    Fees: ₹{appointment.doctorId.fees}
                  </p>
                  <p className="text-gray-600">
                    Date: {new Date(appointment.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">Time: {appointment.time}</p>
                </div>
              </div>

              {/* Action Buttons */}

              <div className="w-full md:w-1/3 flex flex-col items-center gap-2">
                {appointment.payment ? (
                  <button
                    className="w-3/4 p-2 bg-violet-100 text-violet-700 hover:bg-violet-200 border border-violet-300 rounded-lg transition-all"
                    onClick={() => {
                      setSelectedDoctorId(appointment.doctorId._id);
                      setShowReviewModal(true);
                    }}
                  >
                    Add Review
                  </button>
                ) : (
                  <>
                    <button
                      className="w-3/4 p-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-all"
                      onClick={() => appointmentRazorpay(appointment._id)}
                    >
                      Pay here
                    </button>
                    <button
                      className="w-3/4 p-2 bg-violet-400 hover:bg-violet-500 text-white rounded-lg transition-all"
                      onClick={() => {
                        setSelectedAppointmentId(appointment._id);
                        setShowUpdateModal(true);
                      }}
                    >
                      Update date and time
                    </button>
                  </>
                )}

                <button
                  className="w-3/4 p-2 bg-violet-300 hover:bg-violet-400 text-white rounded-lg transition-all"
                  onClick={() => {
                    setSelectedChatRoom(appointment._id);
                    setShowChatModal(true);
                  }}
                >
                  Chat with doctor
                </button>

                <button
                  className="w-3/4 p-2 bg-violet-300 hover:bg-violet-400 text-white rounded-lg transition-all"
                  onClick={() => {
                    navigate(`/patient/video-call/${appointment._id}`);
                  }}
                >
                  Video call with doctor
                </button>

                <button
                  onClick={() => deleteAppointment(appointment._id)}
                  className="w-3/4 p-2 border border-red-400 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
            <hr className="mt-6" />
          </div>
        ))
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <Modal
          title="Update Appointment"
          onClose={() => setShowUpdateModal(false)}
        >
          <input
            type="date"
            className="w-full p-2 border rounded mb-4"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <input
            type="time"
            className="w-full p-2 border rounded mb-4"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setShowUpdateModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={updateAppointment}
            >
              Update
            </button>
          </div>
        </Modal>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <Modal title="Add Review" onClose={() => setShowReviewModal(false)}>
          <textarea
            className="w-full p-2 border rounded mb-4"
            rows="4"
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <select
            className="w-full p-2 border rounded mb-4"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={0}>Select Rating</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} -{" "}
                {["Poor", "Fair", "Good", "Very Good", "Excellent"][r - 1]}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setShowReviewModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={submitReview}
            >
              Submit
            </button>
          </div>
        </Modal>
      )}

      <DisplayNearByPharmacy />

      {showChatModal && selectedChatRoom && (
        <ChatWindow
          room={selectedChatRoom}
          userId={patId}
          userName={patientName}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
};

// Modal component reused for review/update
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  </div>
);

export default Appointment;
