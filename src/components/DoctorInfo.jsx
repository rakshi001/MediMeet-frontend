import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const DoctorInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [relatedDocs, setRelatedDocs] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
    const [editingReview, setEditingReview] = useState(null);
  const [reviewText, setReviewText] = useState("");
   const [rating, setRating] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://medifypro-backend.onrender.com/api/doctor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const doctorData = response.data.doctor;
        setDoctor(doctorData);

        const relatedResponse = await axios.get(
          `https://medifypro-backend.onrender.com/api/doctor/all`,
          {
            params: { speciality: doctorData.speciality },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const relatedDoctors = relatedResponse.data.data.filter(
          (doc) => doc._id !== id
        );
        setRelatedDocs(relatedDoctors);

        const today = new Date().toISOString().split("T")[0];
        setSelectedDate(today);
        fetchAvailableSlots(today, doctorData.timing);

        // Fetch reviews and average rating
        fetchReviewsAndRating();
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id, token]);

  const fetchReviewsAndRating = async () => {
    try {
      const reviewsResponse = await axios.get(
        `https://medifypro-backend.onrender.com/api/doctor/${id}/review`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const avgRatingResponse = await axios.get(
        `https://medifypro-backend.onrender.com/api/doctor/${id}/average-rating`
      );

      setReviews(reviewsResponse.data.reviews || []);
      setAvgRating(avgRatingResponse.data.data || 0);
    } catch (error) {
      console.error("Error fetching reviews and rating:", error);
    }
  };

  const updateReview = async (reviewId) => {
    try {
      const response = await axios.patch(
        `https://medifypro-backend.onrender.com/api/doctor/${id}/review/${reviewId}`,
        { review: reviewText, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      setEditingReview(null);
      fetchReviewsAndRating(); // Refresh reviews
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review.");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(
        `https://medifypro-backend.onrender.com/api/doctor/${id}/review/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      fetchReviewsAndRating(); // Refresh reviews
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review.");
    }
  };

  const convertTo24HourFormat = (time) => {
    const [hours, minutes] = time.split(/[: ]/);
    const period = time.split(" ")[1];
    let hours24 = parseInt(hours, 10);

    if (period === "PM" && hours24 !== 12) {
      hours24 += 12;
    } else if (period === "AM" && hours24 === 12) {
      hours24 = 0;
    }

    return `${hours24.toString().padStart(2, "0")}:${minutes}`;
  };

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    const isToday = now.toDateString() === selectedDateTime.toDateString();

    const [startHours, startMinutes] =
      convertTo24HourFormat(startTime).split(":");
    const [endHours, endMinutes] = convertTo24HourFormat(endTime).split(":");

    let current = new Date(selectedDateTime);
    current.setHours(parseInt(startHours));
    current.setMinutes(parseInt(startMinutes));
    current.setSeconds(0);
    current.setMilliseconds(0);

    const end = new Date(selectedDateTime);
    end.setHours(parseInt(endHours));
    end.setMinutes(parseInt(endMinutes));

    while (current < end) {
      if (!isToday || current > now) {
        slots.push(
          current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      }
      current = new Date(current.getTime() + 30 * 60 * 1000); // Add 30 minutes
    }

    return slots;
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const fetchAvailableSlots = (date, timing) => {
    if (!timing) {
      toast.error("Doctor's availability is not set.");
      return;
    }
    const [startTime, endTime] = timing.split(" to ");
    if (!startTime || !endTime) {
      toast.error("Doctor's timing is not properly set.");
      return;
    }
    const slots = generateTimeSlots(startTime.trim(), endTime.trim());
    setAvailableSlots(slots);
  };

  const bookAppointment = async () => {
    try {
      if (!selectedDate || !selectedTime) {
        toast.error("Please select a date and time.");
        return;
      }
      const response = await axios.post(
        "https://medifypro-backend.onrender.com/api/appointments/",
        {
          doctorId: id,
          date: selectedDate,
          time: selectedTime,
          status: "Confirmed",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(
        response.data.message || "Appointment booked successfully!"
      );
      navigate('/appointment');
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to book appointment. Please try again.";

      if (message.toLowerCase().includes("already booked")) {
        toast.error("Already booked for this time slot.");
      } else {
        toast.error(message);
      }
    }
  };

  const handleCardClick = (doc) => {
    navigate(`/doctors/${doc._id}`);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (!doctor) {
    return (
      <div className="text-center text-lg font-semibold">Doctor not found.</div>
    );
  }

  return (
    <div className="mt-8 px-4">
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1">
          <img
            className="w-full h-full object-cover bg-violet-100 rounded-xl"
            src={doctor.image}
            alt={doctor.name}
          />
        </div>

        <div className="flex-1 flex flex-col border border-violet-300 rounded-xl p-6 sm:p-8">
          <div className="flex items-center">
            <div>
              <h2 className="text-2xl font-medium mb-4">{doctor.name}</h2>
            </div>

            <div className="flex items-center mb-4">
              {/* <h3 className="text-lg font-medium">Average Rating:</h3> */}
              <div className="flex items-center ml-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`${
                      index < Math.round(avgRating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">({avgRating})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center mb-4">
            <p>{doctor.degree}</p>
            <span>-</span>
            <p>{doctor.speciality}</p>
            <button className="border px-2 py-1 border-violet-300 rounded-xl">
              {doctor.experience}
            </button>
          </div>
          <div className="mb-4">
            <h2 className="font-medium">About</h2>
            <p>{doctor.about}</p>
          </div>
          <div className="mb-4">
            <h2 className="font-medium">Timing</h2>
            <p>{doctor.timing}</p>
          </div>
          <div>
            <h2 className="text-lg font-medium">
              Appointment Fee: <strong>{doctor.fees}</strong>
            </h2>
          </div>
        </div>
      </div>

      {/* Average Rating and Reviews */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Reviews & Ratings</h2>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="border border-gray-300 rounded-lg p-4"
              >
                <div className="flex items-center mb-2">
                  <FaStar className="text-yellow-500" />
                  <span className="ml-2 font-medium">
                    {review.rating} Stars
                  </span>
                </div>
                {editingReview === review._id ? (
                  <div>
                    <textarea
                      className="w-full p-2 border rounded mb-2"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    ></textarea>
                    <select
                      className="w-full p-2 border rounded mb-2"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value={0}>Select Rating</option>
                      {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>
                          {" "}
                          {r} -{" "}
                          {
                            ["Poor", "Fair", "Good", "Very Good", "Excellent"][
                              r - 1
                            ]
                          }
                        </option>
                      ))}
                    </select>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                      onClick={() => updateReview(review._id)}
                    >
                      Save
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 rounded"
                      onClick={() => setEditingReview(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700">{review.review}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Reviewed on:{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      className="text-blue-500 hover:underline mr-2"
                      onClick={() => {
                        setEditingReview(review._id);
                        setReviewText(review.review);
                        setRating(review.rating);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => deleteReview(review._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Slots */}
      <div className="flex justify-center items-start mt-8">
        <div className="w-full">
          <h2 className="text-violet-700 text-xl font-medium pb-4">
            Booking Slots
          </h2>

          <div className="mb-4 flex gap-3 flex-wrap">
            {generateDates().map((date, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setSelectedDate(date);
                  fetchAvailableSlots(date, doctor.timing);
                }}
                className={`border px-4 py-2 rounded-full ${
                  selectedDate === date
                    ? "bg-violet-600 text-white"
                    : "border-violet-300 text-violet-700 hover:bg-violet-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </motion.button>
            ))}
          </div>

          {availableSlots.length > 0 && (
            <div className="mt-4">
              <h2 className="font-semibold mb-2">Available Slots:</h2>
              <div className="flex flex-wrap gap-2">
                {availableSlots.map((slot, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleTimeClick(slot)}
                    className={`px-4 py-2 border rounded ${
                      selectedTime === slot
                        ? "bg-violet-600 text-white"
                        : "border-violet-300 text-violet-700 hover:bg-violet-100"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {slot}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {selectedTime && (
            <motion.button
              onClick={bookAppointment}
              className="mt-4 bg-violet-700 text-white px-6 py-2 rounded hover:bg-violet-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Appointment
            </motion.button>
          )}
        </div>
      </div>

      <div>
        <h1 className="text-3xl text-center font-medium pt-4 mt-10">
          Related Doctors
        </h1>
        <p className="text-md text-center py-4 mb-5">
          Simply browse through our extensive list of trusted doctors.
        </p>
        <div className="flex flex-wrap justify-center items-start gap-5 mb-40">
          {relatedDocs.map((doc) => (
            <motion.div
              key={doc._id}
              onClick={() => handleCardClick(doc)}
              className="border border-gray-300 rounded-xl cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-56">
                <img
                  className="bg-violet-100 h-[60%] rounded-t-lg"
                  src={doc.image}
                  alt={doc.name}
                />
                <div className="bg-violet-50 rounded-b-lg p-3">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <h2 className="text-green-400">Available</h2>
                  </div>
                  <h2 className="text-black font-medium text-lg">{doc.name}</h2>
                  <p className="text-gray-600 text-base">{doc.speciality}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorInfo;
