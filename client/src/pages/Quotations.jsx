
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

import {
  getQuotations,
  addQuotation,
  updateQuotation,
  deleteQuotation,
  getQuotationProjects,
  getQuotationProducts
} from "../services/quotationApi";

import "../styles/quotations.css";

const emptyForm = {
  project: "",
  items: [{ productService: "", quantity: 1 }]
};

const formatEuro = (amount) =>
  Number(amount || 0).toLocaleString("en-IE", {
    style: "currency",
    currency: "EUR"
  });

function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  async function loadQuotations() {
    const data = await getQuotations();
    setQuotations(data);
  }

  function handleProjectChange(event) {
    setForm({
      ...form,
      project: event.target.value
    });
  }

  function handleItemChange(index, field, value) {
    const updatedItems = [...form.items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    setForm({
      ...form,
      items: updatedItems
    });
  }

  function addItemRow() {
    setForm({
      ...form,
      items: [
        ...form.items,
        { productService: "", quantity: 1 }
      ]
    });
  }

  function removeItemRow(index) {
    if (form.items.length === 1) {
      setMessage("At least one item is required");
      return;
    }

    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index)
    });
  }

  function calculateLineTotal(item) {
    const product = products.find(
      (p) => p._id === item.productService
    );

    if (!product) return 0;

    return Number(product.unitPrice) *
      Number(item.quantity || 0);
  }

  const totalAmount = form.items.reduce(
    (total, item) => total + calculateLineTotal(item),
    0
  );

  function resetForm() {
    setForm({
      project: "",
      items: [{ productService: "", quantity: 1 }]
    });

    setEditId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.project) {
      setMessage("Please select an exhibition project");
      return;
    }

    if (
      form.items.some(
        (item) =>
          !item.productService ||
          item.quantity === "" ||
          !Number.isFinite(Number(item.quantity)) ||
          Number(item.quantity) <= 0
      )
    ) {
      setMessage("Please select valid items and quantities");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      project: form.project,
      items: form.items.map((item) => ({
        productService: item.productService,
        quantity: Number(item.quantity)
      }))
    };

    try {
      if (editId) {
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
        quotation.project?._id ||
        quotation.project ||
        "",
      items: quotation.items.map((item) => ({
        productService:
          item.productService?._id ||
          item.productService ||
          "",
        quantity: item.quantity
      }))
    });

    setMessage("");
    window.scrollTo(0, 0);
  }

  async function handleDelete(quotation) {
    if (
      !window.confirm(
        `Delete quotation ${quotation.quotationNumber}?`
      )
    ) {
      return;
    }

    try {
      await deleteQuotation(quotation._id);
      await loadQuotations();

      if (editId === quotation._id) {
        resetForm();
      }

      setMessage("Quotation deleted successfully");
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Download quotation as PDF
  function downloadQuotationPDF(quotation) {
    const pdf = new jsPDF();

    const formatAmount = (amount) =>
      Number(amount || 0).toFixed(2);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("ExpoCraft", 20, 20);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text(
      "Exhibition Quotation Management System",
      20,
      28
    );

    pdf.line(20, 34, 190, 34);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("QUOTATION", 20, 46);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    pdf.text(
      `Quotation No: ${quotation.quotationNumber}`,
      20,
      57
    );

    const quotationDate = quotation.createdAt
      ? new Date(quotation.createdAt).toLocaleDateString("en-IE")
      : new Date().toLocaleDateString("en-IE");

    pdf.text(`Date: ${quotationDate}`, 20, 65);

    const projectName =
      quotation.project?.projectName || "N/A";

    const customerName =
      quotation.project?.customer?.companyName ||
      quotation.project?.customer?.name ||
      "N/A";

    pdf.text(
      pdf.splitTextToSize(`Project: ${projectName}`, 170),
      20,
      74
    );

    pdf.text(
      pdf.splitTextToSize(`Customer: ${customerName}`, 170),
      20,
      86
    );

    let y = 108;

    function drawTableHeader() {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);

      pdf.text("Item", 20, y);
      pdf.text("Qty", 105, y);
      pdf.text("Price (EUR)", 126, y);
      pdf.text("Total (EUR)", 160, y);

      pdf.line(20, y + 3, 190, y + 3);

      y += 12;

      pdf.setFont("helvetica", "normal");
    }

    drawTableHeader();

    quotation.items.forEach((item) => {
      const itemName = pdf.splitTextToSize(
        String(item.name || "Item"),
        78
      );

      const rowHeight = Math.max(
        10,
        itemName.length * 5 + 5
      );

      if (y + rowHeight > 270) {
        pdf.addPage();
        y = 25;
        drawTableHeader();
      }

      pdf.text(itemName, 20, y);
      pdf.text(String(item.quantity), 105, y);

      pdf.text(
        formatAmount(item.unitPrice),
        126,
        y
      );

      pdf.text(
        formatAmount(item.lineTotal),
        160,
        y
      );

      y += rowHeight;
    });

    if (y > 260) {
      pdf.addPage();
      y = 25;
    }

    pdf.line(20, y, 190, y);
    y += 12;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);

    pdf.text("Total Amount (EUR):", 105, y);

    pdf.text(
      formatAmount(quotation.subtotal),
      160,
      y
    );

    pdf.save(
      `${quotation.quotationNumber || "quotation"}.pdf`
    );
  }

  return (
    <main className="quotations-page">
      <h1>Quotation Management</h1>
      <p>
        Create and download quotations for exhibition projects.
      </p>

      <section className="quotation-card">
        <h2>
          {editId ? "Edit Quotation" : "Create Quotation"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Exhibition Project *</label>

          <select
            value={form.project}
            onChange={handleProjectChange}
            required
          >
            <option value="">Select Project</option>

            {projects.map((project) => (
              <option
                key={project._id}
                value={project._id}
              >
                {project.projectName}
              </option>
            ))}
          </select>

          <h3>Quotation Items</h3>

          {form.items.map((item, index) => (
            <div
              className="quotation-item-row"
              key={index}
            >
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
                  required
                >
                  <option value="">Select Item</option>

                  {products.map((product) => (
                    <option
                      key={product._id}
                      value={product._id}
                    >
                      {product.name} - {formatEuro(product.unitPrice)}
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
                  required
                />
              </div>

              <div className="quotation-line-total">
                <label>Line Total</label>
                <strong>
                  {formatEuro(calculateLineTotal(item))}
                </strong>
              </div>

              <button
                type="button"
                className="quotation-remove-btn"
                onClick={() => removeItemRow(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="quotation-add-item-btn"
            onClick={addItemRow}
          >
            + Add Another Item
          </button>

          <div className="quotation-subtotal">
            <span>Total Amount</span>
            <strong>{formatEuro(totalAmount)}</strong>
          </div>

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
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    Loading quotations...
                  </td>
                </tr>
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    No quotations found.
                  </td>
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

                    <td>
                      {formatEuro(quotation.subtotal)}
                    </td>

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

                        <button
                          type="button"
                          className="quotation-download-btn"
                          onClick={() =>
                            downloadQuotationPDF(quotation)
                          }
                        >
                          Download PDF
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
