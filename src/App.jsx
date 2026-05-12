// import React, { useState, useEffect } from "react";
// import axios from "axios";
// function App() {
//   const [file, setFile] = useState(null);
//   const [files, setFiles] = useState([]);
//   // const API_URL = "http://localhost:5000/api"; // Deployment ke waqt changehoga
//   const API_URL = "https://file-sharing-backend-z97w.vercel.app/api"; // Deployment ke waqt changehoga
//   const fetchFiles = async () => {
//     const res = await axios.get(`${API_URL}/files`);
//     setFiles(res.data);
//   };
//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append("file", file);
//     await axios.post(`${API_URL}/upload`, formData);
//     alert("File Uploaded!");
//     fetchFiles();
//   };
//   useEffect(() => {
//     fetchFiles();
//   }, []);
//   return (
//     <div style={{ padding: "20px", textAlign: "center" }}>
//       <h1>MERN File Share</h1>
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button onClick={handleUpload}>Upload</button>
//       <div style={{ marginTop: "30px" }}>
//         {files.map((f) => (
//           <div key={f._id} style={{ margin: "10px", border: "1px solid #ccc" }}>
//             <p>{f.name}</p>
//             <a href={f.url} target="_blank" rel="noreferrer">
//               Download / View
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// export default App;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://file-sharing-backend-z97w.vercel.app/api";

function getFileIcon(name = "") {
  const ext = name.split(".").pop().toLowerCase();
  if (["jpg","jpeg","png","gif","webp","svg"].includes(ext)) return "🖼️";
  if (["mp4","mov","avi","mkv"].includes(ext)) return "🎬";
  if (["mp3","wav","ogg"].includes(ext)) return "🎵";
  if (["pdf"].includes(ext)) return "📄";
  if (["zip","rar","tar","gz"].includes(ext)) return "📦";
  if (["doc","docx"].includes(ext)) return "📝";
  if (["xls","xlsx","csv"].includes(ext)) return "📊";
  return "📁";
}

function Toast({ message, type, show }) {
  return <div className={`toast ${type} ${show ? "show" : ""}`}>{message}</div>;
}

export default function App() {
  const [file, setFile]       = useState(null);
  const [files, setFiles]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState({ show: false, message: "", type: "success" });
  const inputRef              = useRef();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/files`);
      setFiles(res.data);
    } catch {
      showToast("Failed to load files.", "error");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`${API_URL}/upload`, formData);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      showToast("File uploaded successfully!", "success");
      fetchFiles();
    } catch {
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-badge"><span>⚡</span> File Sharing</div>
        <h1>Drop it. <em>Share it.</em></h1>
        <p>Upload any file and get an instant shareable link.</p>
      </header>

      <div className="upload-card">
        <div className={`upload-zone ${file ? "has-file" : ""}`}>
          <input ref={inputRef} type="file" onChange={(e) => setFile(e.target.files[0])} />
          <span className="upload-icon">{file ? getFileIcon(file.name) : "☁️"}</span>
          <div className="upload-zone-title">{file ? "File ready" : "Click or drag a file here"}</div>
          <div className="upload-zone-sub">
            {file ? <span className="file-selected">{file.name}</span> : "Any format supported"}
          </div>
        </div>
        <button className="upload-btn" onClick={handleUpload} disabled={!file || loading}>
          {loading ? <><span className="spinner" />Uploading…</> : "Upload File"}
        </button>
      </div>

      <div>
        <div className="section-header">
          <span className="section-title">Uploaded Files</span>
          <span className="file-count">{files.length} files</span>
        </div>

        {files.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🗂️</div>
            <p>No files yet.<br />Upload something to get started.</p>
          </div>
        ) : (
          <div className="file-list">
            {files.map((f, i) => (
              <div className="file-item" key={f._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="file-icon-wrap">{getFileIcon(f.name)}</div>
                <div className="file-info">
                  <div className="file-name">{f.name}</div>
                  <div className="file-meta">
                    {new Date(f.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <a href={f.url} target="_blank" rel="noreferrer" className="download-btn">↓ View</a>
              </div>
            ))}
          </div>
        )}
      </div>

      <Toast {...toast} />
    </div>
  );
}
