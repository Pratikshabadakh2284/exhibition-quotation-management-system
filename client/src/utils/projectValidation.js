
export function validateProject(project) {
  const errors = {};

  // Project name is required
  if (!project.projectName?.trim()) {
    errors.projectName = "Project name is required";
  }

  // Customer is required
  if (!project.customer) {
    errors.customer = "Please select a customer";
  }

  // Exhibition name is required
  if (!project.exhibitionName?.trim()) {
    errors.exhibitionName = "Exhibition name is required";
  }

  // Start date is required
  if (!project.startDate) {
    errors.startDate = "Start date is required";
  }

  // End date is required
  if (!project.endDate) {
    errors.endDate = "End date is required";
  }

  // End date must not be earlier than start date
  if (
    project.startDate &&
    project.endDate &&
    project.endDate < project.startDate
  ) {
    errors.endDate = "End date cannot be before start date";
  }

  // Stand size is optional, but must be positive if entered
  if (
    project.standSize !== "" &&
    project.standSize != null &&
    (!Number.isFinite(Number(project.standSize)) ||
      Number(project.standSize) <= 0)
  ) {
    errors.standSize = "Stand size must be greater than zero";
  }

  // Validate status if provided
  const validStatuses = [
    "Planning",
    "In Progress",
    "Completed",
    "Cancelled"
  ];

  if (
    project.status &&
    !validStatuses.includes(project.status)
  ) {
    errors.status = "Please select a valid status";
  }

  return errors;
}
