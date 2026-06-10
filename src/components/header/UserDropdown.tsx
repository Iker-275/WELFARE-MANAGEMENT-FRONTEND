

import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";


export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = () => {
    logout();
    navigate("/signin"); // redirect after logout
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        {/* Avatar */}
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          
          <img src="/images/user/owner.jpg" alt="User" />
        </span>

        {/* Name */}
        <span className="block mr-1 font-medium text-theme-sm">
          {user?.email || "User"}
        </span>

        {/* Arrow */}
        <svg
          className={`stroke-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border bg-white p-3 shadow-theme-lg dark:bg-gray-dark"
      >
        {/* User Info */}
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm">
            {user?.email || "Unknown User"}
          </span>

          <span className="mt-0.5 block text-theme-xs text-gray-500">
            Role: {user?.role?.name || "-"}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
        >
          <svg
            className="fill-gray-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497V14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497V5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.745H14.3507V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609H18.5007C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609V18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007Z" />
          </svg>
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}