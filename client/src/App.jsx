
import Customers from "./pages/Customers";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>ExpoCraft</h1>
        <p>Exhibition Quotation Management System</p>
      </header>

      <Customers />
    </div>
  );
}

export default App;
