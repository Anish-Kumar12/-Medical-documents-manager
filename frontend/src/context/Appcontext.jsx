import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("upload");

  const [documents, setDocuments] = useState([]);

  const [loadingDocs, setLoadingDocs] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/documents`);
      setDocuments(res.data);
    } catch (err) {
      setError("Failed to load documents");
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        documents,
        fetchDocuments,
        loadingDocs,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
