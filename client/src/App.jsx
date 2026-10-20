
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setError(false);
      })
      .catch(() => {
        setMessage("Unable to connect to Express backend");
        setError(true);
      });
  }, []);

  return (
    <main className="app-container">
      <h1>Exhibition_Quotation_Management_System</h1>
      <h2>Exhibition Quotation Management System</h2>

      <div className="status-card">
        <h3>Backend Connection Status</h3>
        <p className={error ? "error" : "success"}>
          {error ? "❌" : "✅"} {message}
        </p>
      </div>
    </main>
  );
}

export default App;
