
import { useEffect, useState } from "react";

import {
  getProductsServices,
  addProductService,
  updateProductService,
  deleteProductService
} from "../services/productServiceApi";

import "../styles/productsServices.css";

const emptyForm = {
  name: "",
  type: "",
  unitPrice: ""
};

function ProductsServices() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const data = await getProductsServices();
      setItems(data);
    } catch (error) {
      setMessage(error.message);
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
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.type ||
      form.unitPrice === ""
    ) {
      setMessage("Please complete all fields");
      return;
    }

    const price = Number(form.unitPrice);

    if (!Number.isFinite(price) || price <= 0) {
      setMessage("Unit price must be greater than zero");
      return;
    }

    setSaving(true);
    setMessage("");

    const itemData = {
      name: form.name.trim(),
      type: form.type,
      unitPrice: price
    };

    try {
      if (editId) {
        await updateProductService(editId, itemData);
        setMessage("Item updated successfully");
      } else {
        await addProductService(itemData);
        setMessage("Item added successfully");
      }

      resetForm();
      await loadItems();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item) {
    setEditId(item._id);

    setForm({
      name: item.name || "",
      type: item.type || "",
      unitPrice: String(item.unitPrice ?? "")
    });

    setMessage("");
    window.scrollTo(0, 0);
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteProductService(item._id);

      if (editId === item._id) {
        resetForm();
      }

      await loadItems();
      setMessage("Item deleted successfully");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="products-page">
      <h1>Products &amp; Services</h1>

      <p>
        Manage items used in exhibition quotations.
      </p>

      <section className="product-card">
        <h2>
          {editId ? "Edit Item" : "Add Product / Service"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Item Name *</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Exhibition Stand"
            required
          />

          <label htmlFor="type">Type *</label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Product">Product</option>
            <option value="Service">Service</option>
          </select>

          <label htmlFor="unitPrice">
            Unit Price (€) *
          </label>
          <input
            id="unitPrice"
            name="unitPrice"
            type="number"
            min="0.01"
            step="0.01"
            value={form.unitPrice}
            onChange={handleChange}
            placeholder="e.g. 500"
            required
          />

          <div className="product-form-buttons">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editId
                  ? "Update Item"
                  : "Add Item"}
            </button>

            {editId && (
              <button
                type="button"
                className="product-cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && (
          <p className="product-message" role="status">
            {message}
          </p>
        )}
      </section>

      <section className="product-card">
        <h2>Products &amp; Services List</h2>

        {loading ? (
          <p>Loading items...</p>
        ) : (
          <div className="product-table-container">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Type</th>
                  <th>Unit Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      No products or services found.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.type}</td>
                      <td>
                        {Number(item.unitPrice).toLocaleString(
                          "en-IE",
                          {
                            style: "currency",
                            currency: "EUR"
                          }
                        )}
                      </td>
                      <td>
                        <div className="product-table-actions">
                          <button
                            type="button"
                            className="product-edit-btn"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="product-delete-btn"
                            onClick={() => handleDelete(item)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductsServices;
