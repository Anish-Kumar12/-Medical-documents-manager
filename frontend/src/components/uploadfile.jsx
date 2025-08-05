import React, { useState, useRef } from 'react';
import axios from 'axios';

const UploadFile = ({ afterUpload }) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'error' or 'success'
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef();

  // Handle file selection by user
  const handleFileChange = (e) => {
    setMessage({ text: '', type: '' }); // Clear previous messages
    const file = e.target.files[0];

    if (file && file.type !== 'application/pdf') {
      setMessage({ text: 'Please select a PDF file only.', type: 'error' });
      e.target.value = null; // Reset input control
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // Handle file dropped via drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];

    if (file.type !== 'application/pdf') {
      setMessage({ text: 'Please drop a PDF file only.', type: 'error' });
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    inputRef.current.value = ''; // Reset file input value
  };

  // Handle drag events to toggle drag styling
  const handleDragEvents = (e) => {
    e.preventDefault();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle form submit to upload the file
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage({ text: 'No file selected, please choose a PDF.', type: 'error' });
      return;
    }

    setIsUploading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post(`${apiBase}/documents/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage({ text: 'Upload successful!', type: 'success' });
      setSelectedFile(null);
      inputRef.current.value = '';

      if (afterUpload) afterUpload(true, 'Upload successful!');
    } catch (error) {
      setMessage({ text: 'Upload failed. Try again.', type: 'error' });
      if (afterUpload) afterUpload(false, 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      onDragEnter={handleDragEvents}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow"
    >
      <label htmlFor="fileInput" className="block mb-2 font-semibold text-gray-700">
        Upload PDF Document
      </label>

      <div
        className={`border-2 border-dashed rounded p-6 mb-4 flex flex-col items-center cursor-pointer transition ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
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
        <p className="text-gray-600 mb-2">Drag & drop a PDF here, or click to select</p>
        {selectedFile && <p className="text-blue-700 font-medium">{`Selected: ${selectedFile.name}`}</p>}
      </div>

      {message.text && (
        <p className={message.type === 'error' ? 'text-red-600 mb-2' : 'text-green-600 mb-2'}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isUploading}
        className={`w-full py-2 px-4 rounded font-bold text-white ${
          isUploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

export default UploadFile;
