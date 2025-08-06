import React, { useState, useRef } from "react";
import axios from "axios";

const UploadFile = ({ afterUpload }) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    setMessage({ text: "", type: "" });
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setMessage({ text: "Please select a PDF file only.", type: "error" });
      e.target.value = null;
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file.type !== "application/pdf") {
      setMessage({ text: "Please drop a PDF file only.", type: "error" });
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    inputRef.current.value = "";
  };

  const handleDragEvents = (e) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ text: "No file selected, please choose a PDF.", type: "error" });
      return;
    }
    setIsUploading(true);
    setMessage({ text: "", type: "" });
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await axios.post(`${apiBase}/documents/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ text: "Upload successful!", type: "success" });
      setSelectedFile(null);
      inputRef.current.value = "";
      if (afterUpload) afterUpload(true, "Upload successful!");
    } catch (error) {
      setMessage({ text: "Upload failed. Try again.", type: "error" });
      if (afterUpload) afterUpload(false, "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      onDragEnter={handleDragEvents}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <label htmlFor="fileInput" className="block mb-2 font-semibold text-gray-700">
        Upload PDF Document
      </label>
      <div
        className={`border-2 border-dashed rounded-xl p-6 mb-4 flex flex-col items-center cursor-pointer transition-all duration-150 ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragEvents}
        onDragLeave={handleDragEvents}
        onClick={() => inputRef.current.click()}
      >
        <input
          id="fileInput"
          type="file"
          accept="application/pdf"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-gray-600 mb-2 text-center">Drag & drop a PDF here, or click to select</p>
        {selectedFile && (
          <p className="text-blue-700 font-medium text-center">Selected: {selectedFile.name}</p>
        )}
      </div>
      {message.text && (
        <p
          className={`mb-2 text-center ${
            message.type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={isUploading}
        className={`w-full py-2 px-4 rounded-xl font-bold text-white transition-all duration-150 ${
          isUploading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default UploadFile;
