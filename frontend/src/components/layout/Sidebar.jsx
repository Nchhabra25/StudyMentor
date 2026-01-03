import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, User, LogOut, BookOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isSidebarOpen, toggleSidebar, isMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/documents", icon: FileText, text: "Documents" },
    { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
    { to: "/profile", icon: User, text: "Profile" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-lg md:shadow-none`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b">
          <h1 className="font-bold text-lg">StudyMentor</h1>
          {isMobile && (
            <button onClick={toggleSidebar}>
              ✕
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => isMobile && toggleSidebar()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
                  isActive ? "bg-emerald-500 text-white" : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <link.icon size={18} />
              {link.text}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-100 rounded-xl"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
