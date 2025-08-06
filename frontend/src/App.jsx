import React, { useContext, useState } from "react";
import axios from "axios";

import logo from "./assets/logo.png";
import "./App.css";

import Sidebar from "./components/Sidebar.jsx";
import UploadFile from "./components/Uploadfile.jsx";
import { AppContext } from "./context/Appcontext.jsx";
import Cardview from "./components/DocumentCard.jsx";
import DeleteConfirmation from "./components/Deleteconfirmationbox.jsx";
import Alert from "./components/Alert.jsx";

function App() {
  const { activeTab, documents, fetchDocuments } = useContext(AppContext);
  const [deleteModal, setDeleteModal] = useState({ open: false, doc: null });
  const [alertMessage, setAlertMessage] = useState(null);

  const handleDeleteClick = (id) => {
    const doc = documents.find((d) => d.id === id);
    setDeleteModal({ open: true, doc });
  };

  const handleCloseModal = () => setDeleteModal({ open: false, doc: null });

  const handleConfirmDelete = async () => {
    if (!deleteModal.doc) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/documents/${deleteModal.doc.id}`
      );
      fetchDocuments();
      setAlertMessage({ type: "success", text: "Document deleted successfully." });
    } catch {
      setAlertMessage({ type: "error", text: "Delete failed. Please try again." });
    } finally {
      handleCloseModal();
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/documents/${id}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `document_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setAlertMessage({ type: "success", text: "Download started." });
    } catch {
      setAlertMessage({ type: "error", text: "Failed to download the file." });
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-2">
      {/* Navbar */}
      <nav
        className="px-6 border-b h-20 flex items-center rounded-2xl"
        style={{ backgroundColor: "#75ABFC" }}
      >
        <img src={logo} className="w-50 h-16" alt="Logo" />
      </nav>

      {/* Main layout */}
      <div className="flex flex-1">
        <aside className="w-64 min-w-[180px] bg-gray-100 border-r border-gray-300 rounded-2xl">
          <Sidebar />
        </aside>

        <div className="flex-1 flex flex-col">
          <main className="p-8">
            {activeTab === "upload" && (
              <UploadFile afterUpload={(success) => success && fetchDocuments()} />
            )}

            {activeTab === "documents" && (
              <div className="p-4 bg-white rounded-lg ">
                {documents.length === 0 ? (
                  <p>No documents found.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {documents.map((doc) => (
                      <Cardview
                        key={doc.id}
                        doc={doc}
                        onDownload={() => handleDownload(doc.id, doc.filename)}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />

      <DeleteConfirmation
        isOpen={deleteModal.open}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        filename={deleteModal.doc?.filename || ""}
      />
    </div>
  );
}

export default App;
