import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const [dark, setDark] = useState(false);
  const [token, setToken] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [sosTriggered, setSosTriggered] = useState(false);

  function dropdownToggle() {
    setDropdown(!dropdown);
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(true);

      // Fetch profile data only if the user is logged in
      const fetchProfileData = async () => {
        try {
          const response = await axios.get(
            "https://medifypro-backend.onrender.com/api/user/profile",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );

          if (response.data.success) {
            const user = response.data.user;
            setImage(user.image || null); // Load existing profile image
          } else {
            toast.error("Failed to load profile data");
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
          toast.error("An error occurred while fetching the profile data");
        }
      };

      fetchProfileData();
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      toast.success("Logout Success");
      setToken(false);
      setImage(null); // Reset profile image
      navigate("/");
    } catch (error) {
      toast.error("Logout Failed");
    }
  };

  useEffect(() => {
    // Set the initial theme to light mode
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  function toggleTheme() {
    const newTheme = !dark;
    setDark(newTheme);
    document.documentElement.setAttribute(
      "data-theme",
      newTheme ? "dark" : "light"
    );
  }




const handleSOSClick = async () => {
  if (sosTriggered) return; // prevent repeat clicks

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Login first to trigger SOS!");
    return;
  }

  setSosTriggered(true); // block further attempts

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.post(
            "https://medifypro-backend.onrender.com/api/user/sos-alert",
            {
              message: "🚨 SOS! I need help.",
              latitude,
              longitude,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (res.data.success) {
            toast.success("🚨 SOS triggered!");
          } else {
            toast.error(`Failed: ${res.data.message}`);
            setSosTriggered(false); // allow retry if failure
          }
        } catch (error) {
          toast.error("Something went wrong.");
          setSosTriggered(false);
        }
      },
      () => {
        toast.error("Failed to get location.");
        setSosTriggered(false);
      }
    );
  } else {
    toast.error("Geolocation not supported.");
    setSosTriggered(false);
  }
};




  return (
    <>
      <div className="flex justify-between text-sm items-center border-b border-b-gray-400 gap-2">
        <div>
          <NavLink to="/">
            <img
              src={assets.logop}
              alt="logo"
              className="w-44 cursor-pointer"
            />
          </NavLink>
        </div>
        <div>
          <ul className="hidden md:flex md:flex-row font-medium gap-5">
            <li className="transition-all duration-700">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "p-1 border-b-2 border-b-custom-bg" : ""
                }
              >
                HOME
              </NavLink>
            </li>
            <li className="transition-all duration-700">
              <NavLink
                to="/doctors"
                className={({ isActive }) =>
                  isActive ? "p-1 border-b-2 border-b-custom-bg" : ""
                }
              >
                ALL DOCTORS
              </NavLink>
            </li>
            <li className="transition-all duration-700">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "p-1 border-b-2 border-b-custom-bg" : ""
                }
              >
                ABOUT
              </NavLink>
            </li>
            <li className="transition-all duration-700">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? "p-1 border-b-2 border-b-custom-bg" : ""
                }
              >
                CONTACT
              </NavLink>
            </li>
          </ul>
        </div>
        

        <button
          onClick={handleSOSClick}
          disabled={sosTriggered}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 hover:bg-red-700 transition duration-300"
        >
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
          <span className="relative z-10 text-lg font-bold">SOS</span>
        </button>

        <div className="flex gap-3 items-center">
          <div>
            {!token ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-custom-bg p-2 px-4 rounded-full text-white font-light hidden md:block"
              >
                Create Account
              </button>
            ) : (
              <div className="flex items-center gap-2 relative">
                <img
                  src={
                    image
                      ? image
                      : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                  }
                  alt="Profile"
                  className="w-12 rounded-full"
                />
                <img
                  onClick={dropdownToggle}
                  src={assets.dropdown_icon}
                  alt="Dropdown"
                />
                {dropdown ? (
                  <div className="bg-gray-100 p-4 absolute top-16 right-[0px] mt-2 w-40">
                    <Link to="/appointment">
                      <h2 className="pb-1 text-base font-normal ">
                        My Appointments
                      </h2>
                    </Link>
                    <Link to="/profile">
                      <h2 className="py-1 text-base font-normal ">
                        My Profile
                      </h2>
                    </Link>
                    <div onClick={handleLogout}>
                      <h2 className="py-1 text-base font-normal cursor-pointer ">
                        Logout
                      </h2>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
          <button onClick={toggleTheme}>
            {dark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
