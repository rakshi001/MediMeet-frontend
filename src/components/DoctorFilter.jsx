import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { FaFilter, FaSearch } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios from "axios";

const DoctorFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rating, setRating] = useState("");
  const [maxFees, setMaxFees] = useState(2000);
  const [availability, setAvailability] = useState("any");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(null);
  const [doctors, setDoctors] = useState([]);

  // Debounced search
  const debouncedSearch = debounce((value) => {
    fetchDoctors({ searchTerm: value, rating, maxFees, availability });
  }, 400);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const toggleFilter = (filterName) => {
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  const fetchDoctors = async (filters) => {
    try {
      const response = await axios.post(
        "https://medifypro-backend.onrender.com/api/search-filter",
        filters
      );
        setDoctors(response.data.data);
        console.log(doctors)
        console.log(filters)
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    }
    };
    


  useEffect(() => {
    fetchDoctors({ searchTerm, rating, availability, maxFees });
  },[]);

  return (
    <div className="w-full px-4 mt-6">
      {/* Search Input and Filters Button */}
      <div className="flex justify-between items-center space-x-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search doctor or speciality..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <FaSearch className="absolute top-3 right-4 text-gray-400" />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-violet-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <FaFilter />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-lg">
          {/* Rating Filter */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFilter("rating")}
            >
              <span className="text-sm font-medium text-gray-700">Rating</span>
              {expandedFilter === "rating" ? (
                <IoIosArrowUp className="text-gray-500" />
              ) : (
                <IoIosArrowDown className="text-gray-500" />
              )}
            </div>
            {expandedFilter === "rating" && (
              <div className="mt-2 flex space-x-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <label key={r} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={r}
                      checked={rating == r}
                      onChange={(e) => setRating(e.target.value)}
                      className="hidden"
                    />
                    <span
                      className={`text-4xl ${
                        rating >= r ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Max Fees Filter */}
          <div className="border-b border-gray-300 pb-4 mb-4">
            <div
              className="flex justify-between items-center cursor-pointer hover:text-violet-600"
              onClick={() => toggleFilter("maxFees")}
            >
              <span className="text-sm font-medium text-gray-700">
                Max Fees
              </span>
              {expandedFilter === "maxFees" ? (
                <IoIosArrowUp className="text-violet-500" />
              ) : (
                <IoIosArrowDown className="text-gray-500" />
              )}
            </div>
            {expandedFilter === "maxFees" && (
              <div className="mt-4 px-4">
                <div className="text-center text-sm font-medium text-gray-700 mb-2">
                  Selected: ₹{maxFees}
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={maxFees}
                  onChange={(e) => setMaxFees(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>₹200</span>
                  <span>₹2000</span>
                </div>
              </div>
            )}
          </div>

          {/* Availability Filter */}
          <div className="border-b border-gray-300 pb-4 mb-4">
            <div
              className="flex justify-between items-center cursor-pointer hover:text-violet-600"
              onClick={() => toggleFilter("availability")}
            >
              <span className="text-base font-semibold text-gray-800">
                Availability
              </span>
              {expandedFilter === "availability" ? (
                <IoIosArrowUp className="text-violet-500" />
              ) : (
                <IoIosArrowDown className="text-gray-500" />
              )}
            </div>
            {expandedFilter === "availability" && (
              <div className="mt-4 space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="availability"
                    value="any"
                    checked={availability === "any"}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-4 h-4 text-violet-500 border-gray-300 focus:ring-violet-500"
                  />
                  <span className="text-sm text-gray-700">Any Available</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="availability"
                    value="true"
                    checked={availability === "true"}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-4 h-4 text-violet-500 border-gray-300 focus:ring-violet-500"
                  />
                  <span className="text-sm text-gray-700">Available Now</span>
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Doctors List */}
      <div className="mt-6">
        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="p-4 border rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {doctor.name}
                </h3>
                <p className="text-sm text-gray-600">{doctor.speciality}</p>
                <p className="text-sm text-gray-600">Fees: ₹{doctor.fees}</p>
                <p
                  className={`text-sm ${
                    doctor.availability ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {doctor.availability ? "Available" : "Not Available"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorFilter;
