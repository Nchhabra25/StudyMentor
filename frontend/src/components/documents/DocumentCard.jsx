import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Trash2,
  BookOpen,
  BrainCircuit,
  Clock,
} from "lucide-react";
import moment from "moment";

const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return "N/A";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative cursor-pointer rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600">
          <FileText className="w-5 h-5" strokeWidth={2} />
        </div>

        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-red-500"
        >
          <Trash2 className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {/* Title */}
      <h3
        className="text-base font-semibold text-slate-800 truncate mb-2"
        title={document.title}
      >
        {document.title}
      </h3>

      {/* File info */}
      {document.fileSize !== undefined && (
        <p className="text-xs text-slate-500 mb-3">
          {formatFileSize(document.fileSize)}
        </p>
      )}

      {/* Stats */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-600 mb-4">
        {document.flashcardCount !== undefined && (
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span>{document.flashcardCount} Flashcards</span>
          </div>
        )}

        {document.quizCount !== undefined && (
          <div className="flex items-center gap-1">
            <BrainCircuit className="w-4 h-4 text-emerald-500" />
            <span>{document.quizCount} Quizzes</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Clock className="w-4 h-4" />
        <span>
          Uploaded {moment(document.createdAt).fromNow()}
        </span>
      </div>

      {/* Hover gradient */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 transition group-hover:opacity-100" />
    </div>
  );
};

export default DocumentCard;
