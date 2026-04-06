const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function AddFeedback(req, res) {
  try {
    const { venue_id, message, review, rating } = req.body;
    if (!venue_id || !message || !review || !rating) return res.status(400).json({ success: false, message: "Venue ID, message, review and rating are required" });
    if (!ObjectId.isValid(venue_id)) return res.status(400).json({ success: false, message: "Invalid venue ID" });
    if (rating < 1 || rating > 5) return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });

    const db = await connectDB();
    await db.collection("feedbacks").insertOne({
      register_id: new ObjectId(req.user._id),
      venue_id: new ObjectId(venue_id),
      message, review,
      rating: parseInt(rating),
      created_at: new Date(),
    });
    return res.status(201).json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("AddFeedback.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { AddFeedback };
