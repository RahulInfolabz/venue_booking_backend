const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function BookVenue(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth || user.session.role !== "User") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { venue_id, booking_start_date, booking_end_date, booking_time } = req.body;

    if (!venue_id || !booking_start_date || !booking_end_date || !booking_time) {
      return res.status(400).json({ success: false, message: "Venue ID, start date, end date and booking time are required" });
    }

    if (!ObjectId.isValid(venue_id)) {
      return res.status(400).json({ success: false, message: "Invalid venue ID" });
    }

    const db = await connectDB();
    const venueCollection = db.collection("venues");
    const bookingCollection = db.collection("bookings");

    const venue = await venueCollection.findOne({ _id: new ObjectId(venue_id), status: "Active" });
    if (!venue) {
      return res.status(404).json({ success: false, message: "Venue not found or unavailable" });
    }

    const startDate = new Date(booking_start_date);
    const endDate = new Date(booking_end_date);
    const rentalDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const total_amount = venue.price * rentalDays;

    await bookingCollection.insertOne({
      register_id: new ObjectId(user.session._id),
      venue_id: new ObjectId(venue_id),
      booking_start_date: startDate,
      booking_end_date: endDate,
      booking_time,
      total_amount,
      rental_days: rentalDays,
      booking_status: "Pending",
      payment_mode: "Online",
      payment_status: "Pending",
      created_at: new Date(),
    });

    return res.status(201).json({ success: true, message: "Venue booked successfully. Awaiting confirmation." });
  } catch (error) {
    console.error("BookVenue.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { BookVenue };
