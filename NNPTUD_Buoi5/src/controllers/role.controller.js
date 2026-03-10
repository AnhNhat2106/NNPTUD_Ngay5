const mongoose = require("mongoose");
const Role = require("../models/role.model");
const User = require("../models/user.model");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    return res.status(201).json(role);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllRoles = async (req, res) => {
  const roles = await Role.find({ isDeleted: false }).sort({ createdAt: -1 });
  return res.json(roles);
};

const getRoleById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid role id" });
  }

  const role = await Role.findOne({ _id: id, isDeleted: false });
  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  return res.json(role);
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid role id" });
  }

  try {
    const role = await Role.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.json(role);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const softDeleteRole = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid role id" });
  }

  const role = await Role.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  return res.json({ message: "Role soft deleted", role });
};

const getUsersByRoleId = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid role id" });
  }

  const role = await Role.findOne({ _id: id, isDeleted: false });
  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  const users = await User.find({ role: id, isDeleted: false }).populate("role");
  return res.json(users);
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  softDeleteRole,
  getUsersByRoleId
};
