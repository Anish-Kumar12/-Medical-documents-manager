import logo from "./assets/logo.png";
import "./App.css";
import Sidebar from "./components/Sidebar.jsx";
import UploadFile from "./components/uploadfile.jsx";
import React, { useContext } from "react";
import axios from "axios";
import { AppContext } from "./context/Appcontext.jsx";
import Cardview from "./components/DocumentCard.jsx";
import DeleteConfirmation from "./components/deleteconfirmationbox.jsx";
function App() {
  const { activeTab, documents } = useContext(AppContext);
  const [deleteModal, setDeleteModal] = React.useState({
    open: false,
    doc: null,
  });
  const { fetchDocuments } = useContext(AppContext);

  const handleDeleteClick = (id) => {
    const doc = documents.find((d) => d.id === id);
    setDeleteModal({ open: true, doc });
  };

  const handleCloseModal = () => setDeleteModal({ open: false, doc: null });
  const handleConfirmDelete = async () => {
  if (deleteModal.doc) {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/documents/${deleteModal.doc.id}`
      );
      fetchDocuments(); // Refresh the list
    } catch (err) {
      alert("Delete failed. Please try again.");
    } finally {
      handleCloseModal();
    }
  }
};
  // Add this handler in your App or pass down as prop
  const handleDownload = async (id, filename) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/documents/${id}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `document_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download the file.");
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
            {activeTab === "upload" && <UploadFile afterUpload={(success) => success && fetchDocuments()} />
}
            {activeTab === "documents" && (
              <div className="p-4 bg-white rounded-lg ">
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
                <DeleteConfirmation
                  isOpen={deleteModal.open}
                  onClose={handleCloseModal}
                  onConfirm={handleConfirmDelete}
                  filename={deleteModal.doc?.filename || ""}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
