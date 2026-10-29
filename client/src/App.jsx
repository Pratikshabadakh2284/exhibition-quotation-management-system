
import { useState } from "react";

import Customers from "./pages/Customers";
import ProductsServices from "./pages/ProductsServices";
import Projects from "./pages/Projects";
import Quotations from "./pages/Quotations";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("customers");

  return (
    <div className="app">
      <header className="app-header">
        <h1>ExpoCraft</h1>
        <p>Exhibition Quotation Management System</p>

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
