import React, { useState, useEffect } from "react";
import axios from "axios";
function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const API_URL = "http://localhost:5000/api"; // Deployment ke waqt changehoga
  const fetchFiles = async () => {
    const res = await axios.get(`${API_URL}/files`);
    setFiles(res.data);
  };
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await axios.post(`${API_URL}/upload`, formData);
    alert("File Uploaded!");
    fetchFiles();
  };
  useEffect(() => {
    fetchFiles();
  }, []);
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>MERN File Share</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <div style={{ marginTop: "30px" }}>
        {files.map((f) => (
          <div key={f._id} style={{ margin: "10px", border: "1px solid #ccc" }}>
            <p>{f.name}</p>
            <a href={f.url} target="_blank" rel="noreferrer">
              Download / View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
