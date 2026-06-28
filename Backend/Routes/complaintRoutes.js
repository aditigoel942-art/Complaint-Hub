const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// @POST /api/complaints — Submit new complaint
router.post("/", protect, async (req, res) => {
  try {
    const { title, category, description } = req.body;
    if (!title || !category || !description)
      return res.status(400).json({ message: "All fields required" });
    const complaint = await Complaint.create({ user: req.user._id, title, category, description });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/complaints/my — Get logged-in user's complaints
router.get("/my", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/complaints — Admin: get all complaints
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/complaints/:id — Admin: update status + reply
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, adminReply },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/complaints/:id — Admin: delete
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Complaint deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
