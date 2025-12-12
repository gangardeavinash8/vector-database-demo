import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [newDoc, setNewDoc] = useState("");
  const [results, setResults] = useState([]);
  const [uploadMsg, setUploadMsg] = useState("");

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const API_URL = "/api";

  const handleSearch = async () => {
    if (!query) return;
    setLoadingSearch(true);
    try {
      const res = await axios.post(`${API_URL}/search`, {
        query,
        top_k: 5
      });
      setResults(res.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleUpload = async () => {
    if (!newDoc) return;
    setLoadingUpload(true);
    try {
      const res = await axios.post(`${API_URL}/add-document`, {
        text: newDoc
      });
      setUploadMsg("Document added successfully!");
      setNewDoc("");
      setTimeout(() => setUploadMsg(""), 3000);
    } catch (error) {
      console.error(error);
      setUploadMsg("Error adding document");
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <main className="container">
      <header>
        <h1>✨ Semantic Search</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          Powered by AI Embeddings & Qdrant
        </p>
      </header>

      <div className="main-content">
        <section className="search-section">
          <h2> Search Documents</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Ask a question or search for a topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={loadingSearch}>
              {loadingSearch ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="results-grid">
            {results.length > 0 ? (
              results.map((item, idx) => (
                <div className="result-card" key={idx}>
                  <div className="result-score">Similarity: {(item.score * 100).toFixed(1)}%</div>
                  <p className="result-text">{item.text}</p>
                </div>
              ))
            ) : (
              results.length === 0 && !loadingSearch && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                  No results found. Try searching for something else.
                </p>
              )
            )}
          </div>
        </section>

        <section className="upload-section">
          <h2> Add Document</h2>
          <textarea
            placeholder="Paste document text here to add it to the knowledge base..."
            value={newDoc}
            onChange={(e) => setNewDoc(e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={handleUpload} disabled={loadingUpload}>
              {loadingUpload ? "Adding..." : "Add Document"}
            </button>
            {uploadMsg && (
              <span className={`status-msg ${uploadMsg.includes("Error") ? "error" : "success"}`}>
                {uploadMsg}
              </span>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;


// # external disk 