
import { useEffect, useState } from "react";

import Customers from "./pages/Customers";
import ProductsServices from "./pages/ProductsServices";
import Projects from "./pages/Projects";
import Quotations from "./pages/Quotations";
import Login from "./pages/Login";

import {
  getCurrentUser,
  logout
} from "./services/authApi";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("customers");
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, []);

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      setActivePage("customers");
    } catch (error) {
      alert(error.message);
    }
  }

  if (checkingSession) {
    return <p>Checking session...</p>;
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>ExpoCraft</h1>
        <p>Exhibition Quotation Management System</p>

        <p>Welcome, {user.name}</p>

        <nav
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap"
          }}
        >
          <button
            type="button"
            onClick={() => setActivePage("customers")}
          >
            Customers
          </button>

          <button
            type="button"
            onClick={() => setActivePage("products")}
          >
            Products &amp; Services
          </button>

          <button
            type="button"
            onClick={() => setActivePage("projects")}
          >
            Exhibition Projects
          </button>

          <button
            type="button"
            onClick={() => setActivePage("quotations")}
          >
            Quotations
          </button>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      {activePage === "customers" && <Customers />}

      {activePage === "products" && <ProductsServices />}

      {activePage === "projects" && <Projects />}

      {activePage === "quotations" && <Quotations />}
    </div>
  );
}

export default App;
