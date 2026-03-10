const mongoose = require("mongoose");
const User = require("../models/user.model");
const Role = require("../models/role.model");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createUser = async (req, res) => {
  const { role } = req.body;
  if (!isValidObjectId(role)) {
    return res.status(400).json({ message: "Invalid role id" });
  }

  const existingRole = await Role.findOne({ _id: role, isDeleted: false });
  if (!existingRole) {
    return res.status(404).json({ message: "Role not found" });
  }

  try {
    const user = await User.create(req.body);
    const fullUser = await User.findById(user._id).populate("role");
    return res.status(201).json(fullUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  const { username = "" } = req.query;
  const users = await User.find({
    isDeleted: false,
    username: { $regex: username, $options: "i" }
  })
    .populate("role")
    .sort({ createdAt: -1 });

  return res.json(users);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const user = await User.findOne({ _id: id, isDeleted: false }).populate("role");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (req.body.role && !isValidObjectId(req.body.role)) {
    return res.status(400).json({ message: "Invalid role id" });
  }

  if (req.body.role) {
    const existingRole = await Role.findOne({ _id: req.body.role, isDeleted: false });
    if (!existingRole) {
      return res.status(404).json({ message: "Role not found" });
    }
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const softDeleteUser = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const user = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ message: "User soft deleted", user });
};

const enableUser = async (req, res) => {
  const { email, username } = req.body;
  if (!email || !username) {
    return res.status(400).json({ message: "email and username are required" });
  }

  const user = await User.findOneAndUpdate(
    { email, username, isDeleted: false },
    { status: true },
    { new: true }
  ).populate("role");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ message: "User enabled", user });
};

const disableUser = async (req, res) => {
  const { email, username } = req.body;
  if (!email || !username) {
    return res.status(400).json({ message: "email and username are required" });
  }

  const user = await User.findOneAndUpdate(
    { email, username, isDeleted: false },
    { status: false },
    { new: true }
  ).populate("role");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ message: "User disabled", user });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  enableUser,
  disableUser
};
