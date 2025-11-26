import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Doctors = () => {
  const [category, setCategory] = useState("all"); // Selected category
  const [doctors, setDoctors] = useState([]); // All doctors from the backend
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch doctors from the backend
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://medifypro-backend.onrender.com/api/doctor/all"
      );

      if (response.data.success) {
        setDoctors(response.data.data); // Set doctors from the backend
      } else {
        toast.error("Failed to fetch doctors");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("An error occurred while fetching doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(); // Fetch doctors on component mount
  }, []);

  // Change category
  const changeCategory = (speciality) =>
    setCategory((prevCategory) =>
      prevCategory === speciality ? "all" : speciality
    );

  // Navigate to doctor details page
  const handleCardClick = (doc) => {
    navigate(`/doctors/${doc._id}`);
  };

  // Filter doctors based on the selected category
  const filteredDoctors =
    category === "all"
      ? doctors
      : doctors.filter((doctor) => doctor.speciality === category);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <>
      <h2 className="pt-5">Browse through the doctors specialist.</h2>
      <div className="flex md:flex-row flex-col gap-4">
        {/* Sidebar for categories */}
        <div className="sm:min-h-screen min-h-32 flex flex-col gap-3 md:mt-6 mt-3 lg:w-64 md:w-44 sm:w-16">
          <button
            onClick={() => changeCategory("General Physician")}
            className={`px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300 ${
              category === "General Physician" ? "bg-indigo-50 text-black" : ""
            }`}
          >
            General Physician
          </button>
          <button
            onClick={() => changeCategory("Gynecologist")}
            className={`px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300 ${
              category === "Gynecologist" ? "bg-indigo-50 text-black" : ""
            }`}
          >
            Gynecologist
          </button>
          <button
            onClick={() => changeCategory("Dermatologist")}
            className={`px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300 ${
              category === "Dermatologist" ? "bg-indigo-50 text-black" : ""
            }`}
          >
            Dermatologist
          </button>
          <button
            onClick={() => changeCategory("Pediatricians")}
            className={`px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300 ${
              category === "Pediatricians" ? "bg-indigo-50 text-black" : ""
            }`}
          >
            Pediatricians
          </button>
          <button
            onClick={() => changeCategory("Neurologist")}
            className={`px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300 ${
              category === "Neurologist" ? "bg-indigo-50 text-black" : ""
            }`}
          >
            Neurologist
          </button>
          <button
            onClick={() => changeCategory("Gastroenterologist")}
            className={`px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300 ${
              category === "Gastroenterologist" ? "bg-indigo-50 text-black" : ""
            }`}
          >
            Gastroenterologist
          </button>
        </div>

        {/* Doctors List */}
        <div className="flex-1">
          {filteredDoctors.length === 0 ? (
            <h2 className="p-10 text-2xl text-red-400 mx-auto text-center">
              No Doctors Available now
            </h2>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8 mx-auto items-start">
              {filteredDoctors.map((doc, ind) => (
                <div
                  key={ind}
                  onClick={() => handleCardClick(doc)}
                  className="border border-gray-300 rounded-xl cursor-pointer"
                >
                  <div className="w-48">
                    <img
                      className="bg-[#eaefff] h-[60%] rounded-t-lg"
                      src={doc.image}
                      alt={doc.name}
                    />
                    <div className="bg-slate-100 rounded-b-lg p-2">
                      <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <h2 className="text-green-400">Available</h2>
                      </div>
                      <h2 className="text-black font-medium text-lg">
                        {doc.name}
                      </h2>
                      <p className="text-gray-600 text-base">
                        {doc.speciality}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Doctors;
