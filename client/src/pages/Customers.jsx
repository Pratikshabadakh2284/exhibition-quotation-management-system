
import { useEffect, useState } from "react";
import {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
} from "../services/customerApi";

import "../styles/customers.css";
import { validateCustomer } from "../utils/customerValidation";
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
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // Load customers when the page opens
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
        } finally {
            setLoading(false);
        }
    }

    // Update form fields

    function handleChange(event) {
        const { name, value } = event.target;

        setForm({
            ...form,
            [name]: value
        });

        // Clear the error when the user changes this field
        setErrors({
            ...errors,
            [name]: ""
        });
    }

    // Save new or edited customer

    async function handleSubmit(event) {
        event.preventDefault();

        if (saving) return;

        setMessage("");

        // Check form before saving
        const validationErrors = validateCustomer(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setMessage("Please correct the highlighted fields");
            return;
        }

        setSaving(true);

        try {
            const customerData = {
                name: form.name.trim(),
                companyName: form.companyName.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                address: form.address.trim()
            };

            if (editId) {
                await updateCustomer(editId, customerData);
                setMessage("Customer updated successfully");
            } else {
                await addCustomer(customerData);
                setMessage("Customer added successfully");
            }

            setForm({ ...emptyCustomer });
            setEditId(null);
            setErrors({});

            await loadCustomers();
        } catch (error) {
            setMessage(error.message);
        } finally {
            setSaving(false);
        }
    }


    // Fill the form with customer details
    function handleEdit(customer) {
        setEditId(customer._id);

        setForm({
            name: customer.name,
            companyName: customer.companyName,
            email: customer.email,
            phone: customer.phone || "",
            address: customer.address || ""
        });

        setMessage("");
        window.scrollTo(0, 0);
    }

    // Delete selected customer
    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmed) return;

        try {
            await deleteCustomer(id);
            setMessage("Customer deleted successfully");

            if (editId === id) {
                setEditId(null);
                setForm({ ...emptyCustomer });
            }

            await loadCustomers();
        } catch (error) {
            setMessage(error.message);
        }
    }

    function cancelEdit() {
        setEditId(null);
        setForm({ ...emptyCustomer });
        setMessage("");
    }

    // Search by customer or company name
    const filteredCustomers = customers.filter((customer) => {
        const keyword = search.toLowerCase();

        return (
            customer.name.toLowerCase().includes(keyword) ||
            customer.companyName.toLowerCase().includes(keyword)
        );
    });

    return (
        <main className="customers-page">
            <h1>Customer Management</h1>
            <p>Manage customers for exhibition projects and quotations.</p>

            <section className="customer-card">
                <h2>{editId ? "Edit Customer" : "Add Customer"}</h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Contact Name *</label>

                    <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        maxLength={60}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "name-error" : undefined}
                    />

                    {errors.name && (
                        <span id="name-error" className="field-error">
                            {errors.name}
                        </span>
                    )}

                    <label htmlFor="companyName">Company Name</label>
                    <input
                        id="companyName"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="phone">Phone</label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                    />

                    <label htmlFor="address">Address</label>
                    <textarea
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows="3"
                    />

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
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {message && <p role="status" className="message">{message}</p>}
            </section>

            <section className="customer-card">
                <div className="list-header">
                    <h2>Customer List ({customers.length})</h2>

                    <input
                        type="text"
                        placeholder="Search customers..."
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
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer._id}>
                                        <td>{customer.name}</td>
                                        <td>{customer.companyName}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone || "-"}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="edit-btn"
                                                onClick={() => handleEdit(customer)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() => handleDelete(customer._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredCustomers.length === 0 && (
                            <p className="empty-message">No customers found.</p>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Customers;
