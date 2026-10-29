
import { useEffect, useState } from "react";

import {
  getQuotations,
  addQuotation,
  updateQuotation,
  deleteQuotation,
  getQuotationProjects,
  getQuotationProducts
} from "../services/quotationApi";

import { validateQuotation } from "../utils/quotationValidation";
import "../styles/quotations.css";

const emptyForm = {
  project: "",
  items: [{ productService: "", quantity: 1 }],
  status: "Draft",
  notes: ""
};

const formatEuro = (amount) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR"
  }).format(amount);

function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadQuotations() {
    const data = await getQuotations();
    setQuotations(data);
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [quotationData, projectData, productData] =
          await Promise.all([
            getQuotations(),
            getQuotationProjects(),
            getQuotationProducts()
          ]);

        setQuotations(quotationData);
        setProjects(projectData);
        setProducts(productData);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function handleItemChange(index, field, value) {
    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item
      )
    }));
  }

  function addItemRow() {
    setForm((previous) => ({
      ...previous,
      items: [
        ...previous.items,
        { productService: "", quantity: 1 }
      ]
    }));
  }

  function removeItemRow(index) {
    setForm((previous) => ({
      ...previous,
      items: previous.items.filter((_, i) => i !== index)
    }));
  }

  function resetForm() {
    setForm({
      project: "",
      items: [{ productService: "", quantity: 1 }],
      status: "Draft",
      notes: ""
    });
    setEditId(null);
    setErrors({});
  }

  function calculateLineTotal(item) {
    const product = products.find(
      (p) => p._id === item.productService
    );

    if (!product) return 0;

    return Number(product.unitPrice) *
      Number(item.quantity || 0);
  }

  const subtotal = form.items.reduce(
    (total, item) => total + calculateLineTotal(item),
    0
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const validationErrors = validateQuotation(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);

    try {
      const payload = {
        project: form.project,
        items: form.items.map((item) => ({
          productService: item.productService,
          quantity: Number(item.quantity)
        })),
        notes: form.notes
      };

      if (editId) {
        payload.status = form.status;
        await updateQuotation(editId, payload);
        setMessage("Quotation updated successfully");
      } else {
        await addQuotation(payload);
        setMessage("Quotation created successfully");
      }

      resetForm();
      await loadQuotations();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(quotation) {
    setEditId(quotation._id);

    setForm({
      project:
        typeof quotation.project === "object"
          ? quotation.project?._id || ""
          : quotation.project || "",
      items: quotation.items.map((item) => ({
        productService: item.productService,
        quantity: item.quantity
      })),
      status: quotation.status,
      notes: quotation.notes || ""
    });

    setErrors({});
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(quotation) {
    if (!window.confirm(
      `Delete quotation ${quotation.quotationNumber}?`
    )) {
      return;
    }

    try {
      await deleteQuotation(quotation._id);
      setMessage("Quotation deleted successfully");

      if (editId === quotation._id) resetForm();

      await loadQuotations();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="quotations-page">
      <h1>Quotation Management</h1>
      <p>
        Prepare exhibition quotations using saved
        products and services.
      </p>

      <section className="quotation-card">
        <h2>
          {editId ? "Edit Quotation" : "Create Quotation"}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="project">Exhibition Project *</label>
          <select
            id="project"
            name="project"
            value={form.project}
            onChange={handleChange}
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.projectName}
              </option>
            ))}
          </select>
          {errors.project && (
            <small className="quotation-error">
              {errors.project}
            </small>
          )}

          <h3>Quotation Items</h3>

          {form.items.map((item, index) => {
            const product = products.find(
              (p) => p._id === item.productService
            );

            return (
              <div className="quotation-item-row" key={index}>
                <div>
                  <label>Product / Service *</label>
                  <select
                    value={item.productService}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        "productService",
                        event.target.value
                      )
                    }
                  >
                    <option value="">Select Item</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} — {formatEuro(p.unitPrice)}
                        / {p.unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Quantity *</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        "quantity",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="quotation-line-total">
                  <label>Line Total</label>
                  <strong>
                    {formatEuro(calculateLineTotal(item))}
                  </strong>
                  {product && (
                    <small>{product.unit}</small>
                  )}
                </div>

                <button
                  type="button"
                  className="quotation-remove-btn"
                  onClick={() => removeItemRow(index)}
                >
                  Remove
                </button>

                {errors[`item_${index}`] && (
                  <small className="quotation-error">
                    {errors[`item_${index}`]}
                  </small>
                )}
              </div>
            );
          })}

          {errors.items && (
            <small className="quotation-error">
              {errors.items}
            </small>
          )}

          <button
            type="button"
            className="quotation-add-item-btn"
            onClick={addItemRow}
          >
            + Add Another Item
          </button>

          <div className="quotation-subtotal">
            <span>Subtotal</span>
            <strong>{formatEuro(subtotal)}</strong>
          </div>

          {editId && (
            <>
              <label htmlFor="status">Quotation Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </>
          )}

          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={form.notes}
            onChange={handleChange}
            placeholder="Additional quotation information"
          />

          <div className="quotation-form-buttons">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editId
                  ? "Update Quotation"
                  : "Create Quotation"}
            </button>

            {editId && (
              <button
                type="button"
                className="quotation-cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {message && (
        <p className="quotation-message" role="status">
          {message}
        </p>
      )}

      <section className="quotation-card">
        <h2>Quotation List ({quotations.length})</h2>

        <div className="quotation-table-container">
          <table>
            <thead>
              <tr>
                <th>Quotation No.</th>
                <th>Project</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Subtotal</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading quotations...</td>
                </tr>
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan="7">No quotations found.</td>
                </tr>
              ) : (
                quotations.map((quotation) => (
                  <tr key={quotation._id}>
                    <td>{quotation.quotationNumber}</td>
                    <td>
                      {quotation.project?.projectName ||
                        "Unknown"}
                    </td>
                    <td>
                      {quotation.project?.customer?.companyName ||
                        quotation.project?.customer?.name ||
                        "Unknown"}
                    </td>
                    <td>{quotation.items.length}</td>
                    <td>{formatEuro(quotation.subtotal)}</td>
                    <td>{quotation.status}</td>
                    <td>
                      <div className="quotation-table-actions">
                        <button
                          type="button"
                          className="quotation-edit-btn"
                          onClick={() => handleEdit(quotation)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="quotation-delete-btn"
                          onClick={() => handleDelete(quotation)}
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
      </section>
    </main>
  );
}

export default Quotations;
