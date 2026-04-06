const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function UpdateBooking(req, res) {
  try {
    const { id, booking_status } = req.body;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Valid booking ID is required" });
    const validStatuses = ["Pending", "Approved", "Cancelled"];
    if (!validStatuses.includes(booking_status)) return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(", ")}` });
    const db = await connectDB();
    const result = await db.collection("bookings").updateOne({ _id: new ObjectId(id) }, { $set: { booking_status, updated_at: new Date() } });
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Booking not found" });
    return res.status(200).json({ success: true, message: "Booking updated successfully" });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { UpdateBooking };
