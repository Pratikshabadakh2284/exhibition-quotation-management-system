
const mongoose = require("mongoose");
const Project = require("../models/Project");
const Customer = require("../models/Customer");

// Validate project details
function validateProject(data) {
  if (!data.projectName?.trim()) {
    return "Project name is required";
  }

  if (!data.customer) {
    return "Please select a customer";
  }

  if (!mongoose.isValidObjectId(data.customer)) {
    return "Invalid customer";
  }

  if (!data.exhibitionName?.trim()) {
    return "Exhibition name is required";
  }

  if (!data.exhibitionDate) {
    return "Exhibition date is required";
  }

  const date = new Date(data.exhibitionDate);

  if (Number.isNaN(date.getTime())) {
    return "Please enter a valid exhibition date";
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

// Get project by ID
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

// Create project
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

    const project = await Project.create({
      projectName: req.body.projectName,
      customer: req.body.customer,
      exhibitionName: req.body.exhibitionName,
      exhibitionDate: req.body.exhibitionDate
    });

    await project.populate("customer");

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Unable to create project"
    });
  }
};

// Update project
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
      {
        projectName: req.body.projectName,
        customer: req.body.customer,
        exhibitionName: req.body.exhibitionName,
        exhibitionDate: req.body.exhibitionDate
      },
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

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID"
      });
    }

    const project = await Project.findByIdAndDelete(
      req.params.id
    );

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
