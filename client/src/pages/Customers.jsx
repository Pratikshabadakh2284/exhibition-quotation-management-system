
import { useEffect, useState } from "react";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
} from "../services/customerApi";
import { validateCustomer } from "../utils/customerValidation";
import "../styles/customers.css";

const emptyCustomer = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  address: ""
};

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ ...emptyCustomer });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ""
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    setMessage("");

    const validationErrors = validateCustomer(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setMessage("Please correct the highlighted fields.");
      setMessageType("error");
      return;
    }

    setSaving(true);

    const customerData = {
      name: form.name.trim(),
      companyName: form.companyName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      address: form.address.trim()
    };

    try {
      if (editId) {
        await updateCustomer(editId, customerData);
        setMessage("Customer updated successfully.");
      } else {
        await addCustomer(customerData);
        setMessage("Customer added successfully.");
      }

      setMessageType("success");
      setForm({ ...emptyCustomer });
      setErrors({});
      setEditId(null);

      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(customer) {
    setEditId(customer._id);

    setForm({
      name: customer.name,
      companyName: customer.companyName,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address || ""
    });

    setErrors({});
    setMessage("");
    window.scrollTo(0, 0);
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ ...emptyCustomer });
    setErrors({});
    setMessage("");
  }

  async function handleDelete(id) {
    if (deletingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      await deleteCustomer(id);

      if (editId === id) {
        setEditId(null);
        setForm({ ...emptyCustomer });
        setErrors({});
      }

      const data = await getCustomers();
      setCustomers(data);

      setMessage("Customer deleted successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const keyword = search.trim().toLowerCase();

    return (
      customer.name.toLowerCase().includes(keyword) ||
      customer.companyName.toLowerCase().includes(keyword) ||
      customer.email.toLowerCase().includes(keyword)
    );
  });

  return (
    <main className="customers-page">
      <h1>Customer Management</h1>
      <p>Manage customer details for exhibition projects and quotations.</p>

      <section className="customer-card">
        <h2>{editId ? "Edit Customer" : "Add New Customer"}</h2>
        <p className="required-note">* All fields are mandatory</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Contact Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            maxLength={60}
            aria-invalid={Boolean(errors.name)}
            required
          />
          {errors.name && (
            <span className="field-error">{errors.name}</span>
          )}

          <label htmlFor="companyName">Company Name *</label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            value={form.companyName}
            onChange={handleChange}
            maxLength={100}
            aria-invalid={Boolean(errors.companyName)}
            required
          />
          {errors.companyName && (
            <span className="field-error">{errors.companyName}</span>
          )}

          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            required
          />
          {errors.email && (
            <span className="field-error">{errors.email}</span>
          )}

          <label htmlFor="phone">Phone Number *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            aria-invalid={Boolean(errors.phone)}
            required
          />
          {errors.phone && (
            <span className="field-error">{errors.phone}</span>
          )}

          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            maxLength={250}
            rows={3}
            aria-invalid={Boolean(errors.address)}
            required
          />
          {errors.address && (
            <span className="field-error">{errors.address}</span>
          )}

          <div className="form-buttons">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editId
                  ? "Update Customer"
                  : "Add Customer"}
            </button>

            {editId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={cancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && (
          <p
            role="status"
            className={
              messageType === "error"
                ? "message error-message"
                : "message success-message"
            }
          >
            {message}
          </p>
        )}
      </section>

      <section className="customer-card">
        <div className="list-header">
          <h2>Customer List ({customers.length})</h2>

          <input
            type="search"
            placeholder="Search name, company or email"
            aria-label="Search customers"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading customers...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Contact Name</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>
                    <td>{customer.companyName}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => handleEdit(customer)}
                          disabled={saving || Boolean(deletingId)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDelete(customer._id)}
                          disabled={saving || Boolean(deletingId)}
                        >
                          {deletingId === customer._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCustomers.length === 0 && (
              <p className="empty-message">
                {customers.length === 0
                  ? "No customers added yet."
                  : "No matching customers found."}
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Customers;
