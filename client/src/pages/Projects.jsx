
import { useEffect, useState } from "react";

import {
  getProjects,
  getProjectCustomers,
  addProject,
  updateProject,
  deleteProject
} from "../services/projectApi";

import "../styles/projects.css";

const emptyForm = {
  projectName: "",
  customer: "",
  exhibitionName: "",
  exhibitionDate: ""
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadProjects() {
    const data = await getProjects();
    setProjects(data);
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [projectData, customerData] =
          await Promise.all([
            getProjects(),
            getProjectCustomers()
          ]);

        setProjects(projectData);
        setCustomers(customerData);
      } catch (error) {
        setMessage(error.message);
      }
    }

    loadData();
  }, []);

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
      !form.projectName.trim() ||
      !form.customer ||
      !form.exhibitionName.trim() ||
      !form.exhibitionDate
    ) {
      setMessage("Please complete all fields");
      return;
    }

    setSaving(true);
    setMessage("");

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
        project.customer?._id || project.customer || "",
      exhibitionName: project.exhibitionName || "",
      exhibitionDate: project.exhibitionDate
        ? project.exhibitionDate.slice(0, 10)
        : ""
    });

    window.scrollTo(0, 0);
  }

  async function handleDelete(project) {
    if (
      !window.confirm(
        `Are you sure you want to delete "${project.projectName}"?`
      )
    ) {
      return;
    }

    try {
      await deleteProject(project._id);
      setMessage("Project deleted successfully");
      await loadProjects();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="projects-page">
      <h1>Exhibition Projects</h1>

      <p>
        Create and manage exhibition projects.
      </p>

      <section className="project-card">
        <h2>
          {editId ? "Edit Project" : "Add Project"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Project Name *</label>
          <input
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            placeholder="Enter project name"
            required
          />

          <label>Customer *</label>
          <select
            name="customer"
            value={form.customer}
            onChange={handleChange}
            required
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option
                key={customer._id}
                value={customer._id}
              >
                {customer.companyName ||
                  customer.name}
              </option>
            ))}
          </select>

          <label>Exhibition Name *</label>
          <input
            name="exhibitionName"
            value={form.exhibitionName}
            onChange={handleChange}
            placeholder="Enter exhibition name"
            required
          />

          <label>Exhibition Date *</label>
          <input
            type="date"
            name="exhibitionDate"
            value={form.exhibitionDate}
            min={new Date().toLocaleDateString("en-CA")}
            onChange={handleChange}
            required
          />

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
        <p className="project-message">
          {message}
        </p>
      )}

      <section className="project-card">
        <h2>Project List</h2>

        <div className="project-table-container">
          <table>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Customer</th>
                <th>Exhibition</th>
                <th>Exhibition Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.projectName}</td>
                    <td>
                      {project.customer?.companyName ||
                        project.customer?.name ||
                        "Unknown"}
                    </td>
                    <td>{project.exhibitionName}</td>
                    <td>
                      {project.exhibitionDate
                        ? project.exhibitionDate.slice(0, 10)
                        : "-"}
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
