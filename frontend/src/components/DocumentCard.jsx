import React from "react";
import { FaDownload, FaTrash } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const formatSize = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const DocumentCard = ({ doc, onDownload, onDelete }) => (
  <div
    className="max-w-md p-4 rounded-lg transition-transform duration-150 shadow hover:shadow-2xl hover:scale-105"
    style={{ backgroundColor: "#75ABFC", color: "white" }}
  >
    <div className="mb-4">
      <h3 className="text-lg font-bold break-all drop-shadow">{doc.filename}</h3>
      <p className="text-sm drop-shadow">
        Uploaded: {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
      </p>
      <p className="text-sm drop-shadow">Size: {formatSize(doc.filesize)}</p>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={() => onDownload(doc.id)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 transition"
        aria-label="Download"
        title="Download"
      >
        <FaDownload className="text-white" />
      </button>
      <button
        onClick={() => onDelete(doc.id)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 transition"
        aria-label="Delete"
        title="Delete"
      >
        <FaTrash className="text-white" />
      </button>
    </div>
  </div>
);

export default DocumentCard;
