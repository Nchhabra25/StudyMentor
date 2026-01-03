import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
} from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await progressService.getDashboardData();
        setDashboardData(res);
      } catch (error) {
        toast.error(error.message || "Failed to fetch dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;

  if (!dashboardData || !dashboardData.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const { data, recentActivity } = dashboardData;

  const stats = [
    {
      label: "Total Documents",
      value: data.totalDocuments,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Flashcards",
      value: data.totalFlashcards,
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "Total Quizzes",
      value: data.totalQuizzes,
      icon: BrainCircuit,
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const activities = [
    ...(recentActivity?.documents || []).map((doc) => ({
      id: doc._id,
      title: doc.title,
      time: doc.lastAccessed,
      type: "document",
      link: `/documents/${doc._id}`,
    })),
    ...(recentActivity?.quizzes || []).map((quiz) => ({
      id: quiz._id,
      title: quiz.title,
      time: quiz.completedAt,
      type: "quiz",
      link: `/quizzes/${quiz._id}`,
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">
            Dashboard
          </h1>
          <p className="text-slate-500">
            Track your learning progress and activity
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`}
              />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-800">
              Recent Activity
            </h3>
          </div>

          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "document"
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm text-slate-700">
                        {activity.type === "document"
                          ? "Accessed document"
                          : "Completed quiz"}{" "}
                        <span className="font-medium">
                          {activity.title}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <a
                    href={activity.link}
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No recent activity</p>
              <p className="text-sm text-slate-400">
                Start learning to see progress here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
