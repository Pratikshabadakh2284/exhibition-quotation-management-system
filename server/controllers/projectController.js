
const mongoose = require("mongoose");
const Project = require("../models/Project");
const Customer = require("../models/Customer");
const Quotation = require("../models/Quotation");

// Validate project details

function validateProject(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Invalid project details";
  }

  if (
    typeof data.projectName !== "string" ||
    data.projectName.trim().length < 2 ||
    data.projectName.trim().length > 100
  ) {
    return "Project name must contain 2 to 100 characters";
  }

  if (!data.customer) {
    return "Please select a customer";
  }

  if (!mongoose.isValidObjectId(data.customer)) {
    return "Invalid customer";
  }

  if (
    typeof data.exhibitionName !== "string" ||
    data.exhibitionName.trim().length < 2 ||
    data.exhibitionName.trim().length > 100
  ) {
    return "Exhibition name must contain 2 to 100 characters";
  }

  if (!data.exhibitionDate) {
    return "Exhibition date is required";
  }

  if (
    typeof data.exhibitionDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data.exhibitionDate)
  ) {
    return "Please enter a valid exhibition date in YYYY-MM-DD format";
  }

  const date = new Date(data.exhibitionDate);

  if (Number.isNaN(date.getTime())) {
    return "Please enter a valid exhibition date";
  }

  // Prevent past exhibition dates
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());

  const exhibitionDate = date.toISOString().slice(0, 10);

  if (exhibitionDate < today) {
    return "Exhibition date cannot be in the past";
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
    // Check if project ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID"
      });
    }

    // Check if project exists
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    // Check if project has any quotations
    const linkedQuotation = await Quotation.findOne({
      project: project._id
    });

    if (linkedQuotation) {
      return res.status(409).json({
        message: "Cannot delete this project because it has an existing quotation. Delete the quotation first."
      });
    }

    // Delete only if no quotation exists
    await Project.findByIdAndDelete(project._id);

    return res.status(200).json({
      message: "Project deleted successfully"
    });

  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      message: "Failed to delete project"
    });
  }
};

