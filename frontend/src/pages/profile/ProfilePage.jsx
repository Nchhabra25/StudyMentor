import { useState,useEffect } from "react";
import React from "react";
import PageHeader from "../../components/common/Pageheader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import {authService }from '../../../services/authService'
import {useAuth} from '../../context/AuthContext';
import toast from "react-hot-toast";
import { User,Mail,Lock } from "lucide-react";

const ProfilePage = () => {
    const[loading,setLoading]=useState(true)
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false); // Added based on button usage

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await authService.getProfile(); //
                setUsername(data.username); //
                setEmail(data.email); //
            } catch (error) {
                toast.error("Failed to fetch profile data."); //
                console.error(error); //
            } finally {
                setLoading(false); //
            }
        };
        fetchProfile(); //
    }, []); //

    // --- Action Handlers ---
    const handleChangePassword = async (e) => {
        e.preventDefault(); //
        if (newPassword !== confirmNewPassword) { //
            toast.error("New passwords do not match."); //
            return; //
        }
       setPasswordLoading(true);
        try {
            await authService.changePassword({ currentPassword, newPassword });
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (error) {
            toast.error(error.message || "Failed to change password.");
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) return <Spinner/>;

    return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8">
    <PageHeader title="Profile Settings" />

    <div className="mx-auto max-w-5xl mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* USER INFO CARD */}
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">
          Account Information
        </h3>

        <div className="space-y-6">
          {/* Username */}
          <div>
            <label className="text-sm font-medium text-slate-500">
              Username
            </label>
            <div className="relative mt-2">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <div className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-slate-800 font-medium">
                {username}
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-slate-500">
              Email Address
            </label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <div className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-slate-800 font-medium">
                {email}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD CARD */}
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">
          Change Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="text-sm font-medium text-slate-500">
              Current Password
            </label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-slate-500">
              New Password
            </label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-slate-500">
              Confirm New Password
            </label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={passwordLoading}
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition"
          >
            {passwordLoading ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  </div>
)
};

export default ProfilePage;