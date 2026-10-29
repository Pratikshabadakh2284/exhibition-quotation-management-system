
import { useEffect, useState } from "react";

import {
  getProjects,
  getProjectCustomers,
  addProject,
  updateProject,
  deleteProject
} from "../services/projectApi";

import { validateProject } from "../utils/projectValidation";
import "../styles/projects.css";

const emptyForm = {
  projectName: "",
  customer: "",
  exhibitionName: "",
  location: "",
  startDate: "",
  endDate: "",
  standSize: "",
  status: "Planning",
  description: ""
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProjects() {
    const data = await getProjects();
    setProjects(data);
  }

  async function loadCustomers() {
    const data = await getProjectCustomers();
    setCustomers(data);
  }

  useEffect(() => {
    async function loadData() {
      try {
        await Promise.all([
          loadProjects(),
          loadCustomers()
        ]);
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

    setErrors((previous) => ({
      ...previous,
      [name]: ""
    }));
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setErrors({});
    setEditId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const validationErrors = validateProject(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSaving(true);

    try {
      if (editId) {
        await updateProject(editId, form);
        setMessage("Project updated successfully");
      } else {
        await addProject(form);
        setMessage("Project added successfully");
      }

      resetForm();
      await loadProjects();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(project) {
    setEditId(project._id);

    setForm({
      projectName: project.projectName || "",
      customer:
        typeof project.customer === "object"
          ? project.customer?._id || ""
          : project.customer || "",
      exhibitionName: project.exhibitionName || "",
      location: project.location || "",
      startDate: project.startDate
        ? project.startDate.slice(0, 10)
        : "",
      endDate: project.endDate
        ? project.endDate.slice(0, 10)
        : "",
      standSize: project.standSize ?? "",
      status: project.status || "Planning",
      description: project.description || ""
    });

    setErrors({});
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function handleDelete(project) {
    const confirmed = window.confirm(
      `Delete project "${project.projectName}"?`
    );

    if (!confirmed) return;

    try {
      await deleteProject(project._id);
      setMessage("Project deleted successfully");

      if (editId === project._id) {
        resetForm();
      }

      await loadProjects();
    } catch (error) {
      setMessage(error.message);
    }
  }

  const filteredProjects = projects.filter((project) => {
    const customerName =
      project.customer?.companyName ||
      project.customer?.name ||
      "";

    const searchText = [
      project.projectName,
      project.exhibitionName,
      project.location,
      customerName
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(
      search.toLowerCase()
    );

    const matchesStatus =
      filterStatus === "All" ||
      project.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="projects-page">
      <h1>Exhibition Projects</h1>
      <p>
        Create and manage exhibition projects for your customers.
      </p>

      <section className="project-card">
        <h2>{editId ? "Edit Project" : "Add New Project"}</h2>
        <p className="project-required-note">
          All fields are required.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="projectName">Project Name *</label>
          <input
            id="projectName"
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            placeholder="e.g. Tech Expo Stand 2026"
          />
          {errors.projectName && (
            <small className="project-error">
              {errors.projectName}
            </small>
          )}

          <label htmlFor="customer">Customer *</label>
          <select
            id="customer"
            name="customer"
            value={form.customer}
            onChange={handleChange}
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.companyName ||
                  customer.name ||
                  customer.email ||
                  customer._id}
              </option>
            ))}
          </select>
          {errors.customer && (
            <small className="project-error">
              {errors.customer}
            </small>
          )}

          {customers.length === 0 && (
            <small className="project-help">
              No customers found. Add a customer from the
              Customers page first.
            </small>
          )}

          <label htmlFor="exhibitionName">
            Exhibition Name *
          </label>
          <input
            id="exhibitionName"
            name="exhibitionName"
            value={form.exhibitionName}
            onChange={handleChange}
            placeholder="e.g. Dublin Technology Expo"
          />
          {errors.exhibitionName && (
            <small className="project-error">
              {errors.exhibitionName}
            </small>
          )}

          <label htmlFor="location">Location *</label>
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. RDS Dublin"
          />
          {errors.location && (
            <small className="project-error">
              {errors.location}
            </small>
          )}

          <div className="project-form-grid">
            <div>
              <label htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
              />
              {errors.startDate && (
                <small className="project-error">
                  {errors.startDate}
                </small>
              )}
            </div>

            <div>
              <label htmlFor="endDate">End Date *</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
              />
              {errors.endDate && (
                <small className="project-error">
                  {errors.endDate}
                </small>
              )}
            </div>
          </div>

          <div className="project-form-grid">
            <div>
              <label htmlFor="standSize">
                Stand Size (m²) *
              </label>
              <input
                id="standSize"
                name="standSize"
                type="number"
                min="0.01"
                step="0.01"
                value={form.standSize}
                onChange={handleChange}
                placeholder="e.g. 24"
              />
              {errors.standSize && (
                <small className="project-error">
                  {errors.standSize}
                </small>
              )}
            </div>

            <div>
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <small className="project-error">
                  {errors.status}
                </small>
              )}
            </div>
          </div>

          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the exhibition project"
          />
          {errors.description && (
            <small className="project-error">
              {errors.description}
            </small>
          )}

          <div className="project-form-buttons">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editId
                  ? "Update Project"
                  : "Add Project"}
            </button>

            {editId && (
              <button
                type="button"
                className="project-cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {message && (
        <p className="project-message" role="status">
          {message}
        </p>
      )}

      <section className="project-card">
        <div className="project-list-header">
          <h2>Project List</h2>

          <div className="project-filters">
            <select
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(event.target.value)
              }
              aria-label="Filter by project status"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search projects..."
              aria-label="Search projects"
            />
          </div>
        </div>

        <div className="project-table-container">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Customer</th>
                <th>Exhibition</th>
                <th>Location</th>
                <th>Start Date</th>
                <th>Stand Size</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="project-empty">
                    Loading projects...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="8" className="project-empty">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.projectName}</td>
                    <td>
                      {project.customer?.companyName ||
                        project.customer?.name ||
                        "Unknown"}
                    </td>
                    <td>{project.exhibitionName}</td>
                    <td>{project.location}</td>
                    <td>
                      {project.startDate
                        ? project.startDate.slice(0, 10)
                        : "-"}
                    </td>
                    <td>{project.standSize} m²</td>
                    <td>
                      <span className="project-status">
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <div className="project-table-actions">
                        <button
                          type="button"
                          className="project-edit-btn"
                          onClick={() => handleEdit(project)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="project-delete-btn"
                          onClick={() => handleDelete(project)}
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

export default Projects;
