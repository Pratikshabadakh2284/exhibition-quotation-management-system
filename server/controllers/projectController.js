
const mongoose = require("mongoose");
const Project = require("../models/Project");
const Customer = require("../models/Customer");

const validStatuses = [
  "Planning",
  "In Progress",
  "Completed",
  "Cancelled"
];

function validateProject(data) {
  const requiredFields = [
    "projectName",
    "customer",
    "exhibitionName",
    "location",
    "startDate",
    "endDate",
    "standSize",
    "status",
    "description"
  ];

  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      String(data[field]).trim() === ""
    ) {
      return `${field} is required`;
    }
  }

  if (!mongoose.isValidObjectId(data.customer)) {
    return "Please select a valid customer";
  }

  if (!validStatuses.includes(data.status)) {
    return "Invalid project status";
  }

  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return "Please enter valid project dates";
  }

  if (end < start) {
    return "End date cannot be earlier than start date";
  }

  if (
    !Number.isFinite(Number(data.standSize)) ||
    Number(data.standSize) <= 0
  ) {
    return "Stand size must be greater than zero";
  }

  return null;
}

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("customer")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Unable to load projects"
    });
  }
};

// Get a single project
exports.getProjectById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID"
      });
    }

    const project = await Project.findById(req.params.id)
      .populate("customer");

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: "Unable to load project"
    });
  }
};

// Create a project
exports.createProject = async (req, res) => {
  try {
    const validationError = validateProject(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const customerExists = await Customer.exists({
      _id: req.body.customer
    });

    if (!customerExists) {
      return res.status(400).json({
        message: "Selected customer does not exist"
      });
    }

    const project = await Project.create(req.body);

    await project.populate("customer");

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Unable to create project"
    });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID"
      });
    }

    const validationError = validateProject(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const customerExists = await Customer.exists({
      _id: req.body.customer
    });

    if (!customerExists) {
      return res.status(400).json({
        message: "Selected customer does not exist"
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate("customer");

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: "Unable to update project"
    });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID"
      });
    }

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json({
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete project"
    });
  }
};
