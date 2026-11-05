
import { useEffect, useState } from "react";

import Customers from "./pages/Customers";
import ProductsServices from "./pages/ProductsServices";
import Projects from "./pages/Projects";
import Quotations from "./pages/Quotations";
import Login from "./pages/Login";
import ManageUsers from "./pages/ManageUsers";
import ChangePassword from "./pages/ChangePassword";

import {
  getCurrentUser,
  logout
} from "./services/authApi";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("customers");
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check whether the user is already logged in
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

  // Logout
  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      setActivePage("customers");
    } catch (error) {
      alert(error.message);
    }
  }

  // After changing password, return to login
  function handlePasswordChanged() {
    setUser(null);
    setActivePage("customers");
  }

  // Loading screen
  if (checkingSession) {
    return <p>Checking session...</p>;
  }

  // Show login page when user is not logged in
  if (!user) {
    return (
      <Login
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);
          setActivePage("customers");
        }}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>ExpoCraft</h1>
        <p>Exhibition Quotation Management System</p>

        <p>
          Welcome, {user.name} (
          {user.role === "admin" ? "Admin" : "Staff"})
        </p>

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

          {/* Only admin can see Manage Users */}
          {user.role === "admin" && (
            <button
              type="button"
              onClick={() => setActivePage("users")}
            >
              Manage Users
            </button>
          )}

          {/* Both admin and staff can change password */}
          <button
            type="button"
            onClick={() => setActivePage("changePassword")}
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </header>

      <main>
        {activePage === "customers" && (
          <Customers />
        )}

        {activePage === "products" && (
          <ProductsServices />
        )}

        {activePage === "projects" && (
          <Projects />
        )}

        {activePage === "quotations" && (
          <Quotations />
        )}

        {/* Admin-only user management */}
        {activePage === "users" &&
          user.role === "admin" && (
            <ManageUsers />
          )}

        {/* Password change for all logged-in users */}
        {activePage === "changePassword" && (
          <ChangePassword
            onLogout={handlePasswordChanged}
          />
        )}
      </main>
    </div>
  );
}

export default App;
