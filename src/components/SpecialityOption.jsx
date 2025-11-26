import React, { useState } from "react";
import { specialityData } from "../assets/assets";
import DisplayDoctor from "./DisplayDoctor";
import debounce from "lodash.debounce";
import { FaFilter, FaSearch } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const SpecialityOption = () => {
  const [speciality, setSpeciality] = useState(""); // State to store selected specialty
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filters, setFilters] = useState({}); // State for filters
  const [showFilters, setShowFilters] = useState(false); // State to toggle filters
  const [expandedFilter, setExpandedFilter] = useState(null); // State to toggle individual filter sections

  const handleSpecialityClick = (selectedSpeciality) => {
    if (speciality === selectedSpeciality) {
      setSpeciality(""); // Reset to display all doctors
    } else {
      setSpeciality(selectedSpeciality); // Set the selected specialty
    }
  };

  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  }, 400);

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  const toggleFilter = (filterName) => {
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  return (
    <div>
      <div>
        <h1 className="text-center text-3xl pt-14 mb-3 font-semibold">
          Find by Speciality
        </h1>
        <p className="text-center text-primary">
          Simply browse through our extensive list of trusted doctors, schedule
          <br />
          your appointment hassle-free.
        </p>
      </div>

      <div className="w-full px-4 mt-6">
        <div className="flex justify-center items-center space-x-4">
          <div className="relative w-1/2 sm:w-96">
            <input
              type="text"
              placeholder="Search doctor ..."
              onChange={(e) => handleSearchChange(e.target.value)}
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
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="w-2/3 mx-auto mt-6 bg-white p-4 rounded-xl shadow-lg">
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
                      checked={filters.rating === r}
                      onChange={() => handleFilterChange({ rating: r })}
                      className="hidden"
                    />
                    <span
                      className={`text-4xl ${
                        filters.rating >= r
                          ? "text-yellow-500"
                          : "text-gray-300"
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
                  Selected: ₹{filters.maxFees || 2000}
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={filters.maxFees || 2000}
                  onChange={(e) =>
                    handleFilterChange({
                      maxFees: parseInt(e.target.value, 10),
                    })
                  }
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
              <span className="text-sm font-medium text-gray-700">
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
                    value="true"
                    checked={filters.availability === "true"}
                    onChange={() =>
                      handleFilterChange({ availability: "true" })
                    }
                    className="w-4 h-4 text-violet-500 border-gray-300 focus:ring-violet-500"
                  />
                  <span className="text-sm text-gray-700">Available Now</span>
                </label>

                
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-8 justify-center my-14">
        {specialityData.map((doc, ind) => (
          <div
            key={ind}
            onClick={() => handleSpecialityClick(doc.speciality)}
            className={`flex flex-col items-center cursor-pointer`}
          >
            <img
              src={doc.image}
              alt={doc.speciality}
              className={`w-20 h-20 rounded-full mb-4 ${
                speciality === doc.speciality
                  ? "border-2 border-violet-400 rounded-full p-2"
                  : ""
              }`}
            />
            <h3 className="text-primary">{doc.speciality}</h3>
          </div>
        ))}
      </div>

      <DisplayDoctor
        speciality={speciality}
        searchTerm={searchTerm}
        filters={filters}
      />
    </div>
  );
};

export default SpecialityOption;
