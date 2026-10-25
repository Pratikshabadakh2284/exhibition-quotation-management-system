
import { useEffect, useState } from "react";
import {
  getProductsServices,
  addProductService,
  updateProductService,
  deleteProductService
} from "../services/productServiceApi";
import { validateProductService } from "../utils/productServiceValidation";
import "../styles/productsServices.css";

const emptyForm = {
  type: "",
  name: "",
  category: "",
  description: "",
  unitPrice: "",
  unit: ""
};

function ProductsServices() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setLoading(true);
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

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: ""
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    const validationErrors = validateProductService(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setMessage("Please correct the highlighted fields.");
      return;
    }

    const itemData = {
      type: form.type,
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      unitPrice: Number(form.unitPrice),
      unit: form.unit
    };

    try {
      setSaving(true);

      if (editId) {
        await updateProductService(editId, itemData);
        setMessage("Item updated successfully.");
      } else {
        await addProductService(itemData);
        setMessage("Item added successfully.");
      }

      setForm({ ...emptyForm });
      setEditId(null);
      setErrors({});
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
      type: item.type,
      name: item.name,
      category: item.category,
      description: item.description,
      unitPrice: String(item.unitPrice),
      unit: item.unit
    });

    setErrors({});
    setMessage("");
    window.scrollTo(0, 0);
  }

  function handleCancel() {
    setEditId(null);
    setForm({ ...emptyForm });
    setErrors({});
    setMessage("");
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product or service?"
    );

    if (!confirmed) return;

    try {
      await deleteProductService(id);

      if (editId === id) {
        handleCancel();
      }

      await loadItems();
      setMessage("Item deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  const filteredItems = items.filter((item) => {
    const keyword = search.trim().toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword);

    const matchesType =
      filterType === "All" || item.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <main className="products-page">
      <h1>Products &amp; Services</h1>
      <p>Manage products and services for exhibition quotations.</p>

      <section className="product-card">
        <h2>{editId ? "Edit Product / Service" : "Add Product / Service"}</h2>
        <p className="product-required-note">All fields are mandatory.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="type">Type *</label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="Product">Product</option>
            <option value="Service">Service</option>
          </select>
          {errors.type && <span className="product-field-error">{errors.type}</span>}

          <label htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            maxLength={100}
            required
          />
          {errors.name && <span className="product-field-error">{errors.name}</span>}

          <label htmlFor="category">Category *</label>
          <input
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Lighting, Furniture, Installation"
            required
          />
          {errors.category && (
            <span className="product-field-error">{errors.category}</span>
          )}

          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength={300}
            rows={3}
            required
          />
          {errors.description && (
            <span className="product-field-error">{errors.description}</span>
          )}

          <label htmlFor="unitPrice">Unit Price (€) *</label>
          <input
            id="unitPrice"
            name="unitPrice"
            type="number"
            min="0.01"
            step="0.01"
            value={form.unitPrice}
            onChange={handleChange}
            required
          />
          {errors.unitPrice && (
            <span className="product-field-error">{errors.unitPrice}</span>
          )}

          <label htmlFor="unit">Unit *</label>
          <select
            id="unit"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            required
          >
            <option value="">Select unit</option>
            <option value="Each">Each</option>
            <option value="m²">m²</option>
            <option value="Metre">Metre</option>
            <option value="Hour">Hour</option>
            <option value="Job">Job</option>
            <option value="Trip">Trip</option>
            <option value="Set">Set</option>
          </select>
          {errors.unit && <span className="product-field-error">{errors.unit}</span>}

          <div className="product-form-buttons">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : editId ? "Update Item" : "Add Item"}
            </button>

            {editId && (
              <button
                type="button"
                className="product-cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && <p className="product-message" role="status">{message}</p>}
      </section>

      <section className="product-card">
        <div className="product-list-header">
          <h2>Products &amp; Services ({items.length})</h2>

          <div className="product-filters">
            <select
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
              aria-label="Filter by type"
            >
              <option value="All">All Types</option>
              <option value="Product">Products</option>
              <option value="Service">Services</option>
            </select>

            <input
              type="search"
              placeholder="Search items..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search items"
            />
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="product-table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Unit Price</th>
                  <th>Unit</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.type}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.description}</td>
                    <td>
                      {new Intl.NumberFormat("en-IE", {
                        style: "currency",
                        currency: "EUR"
                      }).format(item.unitPrice)}
                    </td>                    <td>{item.unit}</td>
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
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredItems.length === 0 && (
              <p className="product-empty-message">
                {items.length === 0
                  ? "No products or services added yet."
                  : "No matching records found."}
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductsServices;
