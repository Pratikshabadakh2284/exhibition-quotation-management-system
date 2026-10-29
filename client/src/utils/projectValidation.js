
export function validateProject(project) {
  const errors = {};

  if (!project.projectName.trim()) {
    errors.projectName = "Project name is required";
  }

  if (!project.customer) {
    errors.customer = "Please select a customer";
  }

  if (!project.exhibitionName.trim()) {
    errors.exhibitionName = "Exhibition name is required";
  }

  if (!project.location.trim()) {
    errors.location = "Location is required";
  }

  if (!project.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!project.endDate) {
    errors.endDate = "End date is required";
  }

  if (
    project.startDate &&
    project.endDate &&
    project.endDate < project.startDate
  ) {
    errors.endDate = "End date cannot be before start date";
  }

  if (
    project.standSize === "" ||
    !Number.isFinite(Number(project.standSize)) ||
    Number(project.standSize) <= 0
  ) {
    errors.standSize = "Stand size must be greater than zero";
  }

  if (!project.status) {
    errors.status = "Please select a status";
  }

  if (!project.description.trim()) {
    errors.description = "Description is required";
  }

  return errors;
}
