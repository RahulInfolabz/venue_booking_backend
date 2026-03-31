const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateVenue(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id, occasion_id, venue_type_id, city_id, description, price, status } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Valid venue ID is required" });
    }

    const db = await connectDB();
    const updateFields = { updated_at: new Date() };

    if (occasion_id && ObjectId.isValid(occasion_id)) updateFields.occasion_id = new ObjectId(occasion_id);
    if (venue_type_id && ObjectId.isValid(venue_type_id)) updateFields.venue_type_id = new ObjectId(venue_type_id);
    if (city_id && ObjectId.isValid(city_id)) updateFields.city_id = new ObjectId(city_id);
    if (description) updateFields.description = description;
    if (price) updateFields.price = parseInt(price);
    if (status) updateFields.status = status;
    if (req.file) updateFields.image = `/uploads/venues/${req.file.filename}`;

    const result = await db.collection("venues").updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Venue not found" });
    }

    return res.status(200).json({ success: true, message: "Venue updated successfully" });
  } catch (error) {
    console.error("UpdateVenue.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { UpdateVenue };
