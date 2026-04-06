const express = require("express");
const cors = require("cors");
const connectDB = require("./db/dbConnect");
const authMiddleware = require("./middleware/auth");
require("dotenv").config();

const { venueUpload, profileUpload } = require("./multer/multer");

const Logout = require("./apis/common/logout");
const Session = require("./apis/common/session");
const { Login } = require("./apis/common/login");
const { Signup } = require("./apis/common/signup");
const { ChangePassword } = require("./apis/common/changePassword");

const { GetCities } = require("./apis/user/GetCities");
const { GetOccasions } = require("./apis/user/GetOccasions");
const { GetVenueTypes } = require("./apis/user/GetVenueTypes");
const { GetVenues } = require("./apis/user/GetVenues");
const { GetVenueDetails } = require("./apis/user/GetVenueDetails");
const { GetFeedbacks } = require("./apis/user/GetFeedbacks");

const { GetProfile } = require("./apis/user/GetProfile");
const { UpdateProfile } = require("./apis/user/UpdateProfile");
const { BookVenue } = require("./apis/user/BookVenue");
const { MyBookings } = require("./apis/user/MyBookings");
const { CancelBooking } = require("./apis/user/CancelBooking");
const { GenOrderId } = require("./apis/user/GenOrderId");
const { VerifyPayment } = require("./apis/user/VerifyPayment");
const { AddFeedback } = require("./apis/user/AddFeedback");

const { GetUsers } = require("./apis/admin/GetUsers");
const { UpdateUserStatus } = require("./apis/admin/UpdateUserStatus");
const { AddCity } = require("./apis/admin/AddCity");
const { UpdateCity } = require("./apis/admin/UpdateCity");
const { DeleteCity } = require("./apis/admin/DeleteCity");
const { GetAdminCities } = require("./apis/admin/GetCities");
const { AddOccasion } = require("./apis/admin/AddOccasion");
const { UpdateOccasion } = require("./apis/admin/UpdateOccasion");
const { DeleteOccasion } = require("./apis/admin/DeleteOccasion");
const { GetAdminOccasions } = require("./apis/admin/GetOccasions");
const { AddVenueType } = require("./apis/admin/AddVenueType");
const { UpdateVenueType } = require("./apis/admin/UpdateVenueType");
const { DeleteVenueType } = require("./apis/admin/DeleteVenueType");
const { GetAdminVenueTypes } = require("./apis/admin/GetVenueTypes");
const { AddVenue } = require("./apis/admin/AddVenue");
const { UpdateVenue } = require("./apis/admin/UpdateVenue");
const { DeleteVenue } = require("./apis/admin/DeleteVenue");
const { GetAdminVenues } = require("./apis/admin/GetVenues");
const { GetBookings } = require("./apis/admin/GetBookings");
const { UpdateBooking } = require("./apis/admin/UpdateBooking");
const { GetPayments } = require("./apis/admin/GetPayments");
const { GetAdminFeedbacks } = require("./apis/admin/GetFeedbacks");
const { DashboardStats } = require("./apis/admin/DashboardStats");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "http://localhost:3000", "http://localhost:3001",
    "http://localhost:5173", "http://localhost:5174",
    "https://your-frontend.onrender.com", // ← replace with your actual frontend URL
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use("/uploads/venues", express.static("uploads/venues"));
app.use("/uploads/profiles", express.static("uploads/profiles"));

connectDB();

// ── COMMON ────────────────────────────────────────────────────────────────────
app.post("/signup", Signup);
app.post("/login", Login);
app.get("/logout", Logout);
app.get("/session", Session);
app.post("/changePassword", ChangePassword);

// ── PUBLIC ────────────────────────────────────────────────────────────────────
app.get("/cities", GetCities);
app.get("/occasions", GetOccasions);
app.get("/venueTypes", GetVenueTypes);
app.get("/venues", GetVenues);
app.get("/venues/:id", GetVenueDetails);``
app.get("/feedbacks", GetFeedbacks);
app.get("/feedbacks/:venue_id", GetFeedbacks);

// ── USER (JWT required) ───────────────────────────────────────────────────────
app.get("/user/profile", authMiddleware, GetProfile);
app.post("/user/updateProfile", authMiddleware, profileUpload.single("profile_image"), UpdateProfile);
app.post("/user/bookVenue", authMiddleware, BookVenue);
app.get("/user/myBookings", authMiddleware, MyBookings);
app.post("/user/cancelBooking", authMiddleware, CancelBooking);
app.post("/user/genOrderId", authMiddleware, GenOrderId);
app.post("/user/verifyPayment", authMiddleware, VerifyPayment);
app.post("/user/addFeedback", authMiddleware, AddFeedback);

// ── ADMIN (JWT required) ──────────────────────────────────────────────────────
app.get("/admin/users", authMiddleware, GetUsers);
app.post("/admin/updateUserStatus", authMiddleware, UpdateUserStatus);

app.post("/admin/addCity", authMiddleware, AddCity);
app.post("/admin/updateCity", authMiddleware, UpdateCity);
app.get("/admin/deleteCity/:id", authMiddleware, DeleteCity);
app.get("/admin/cities", authMiddleware, GetAdminCities);

app.post("/admin/addOccasion", authMiddleware, AddOccasion);
app.post("/admin/updateOccasion", authMiddleware, UpdateOccasion);
app.get("/admin/deleteOccasion/:id", authMiddleware, DeleteOccasion);
app.get("/admin/occasions", authMiddleware, GetAdminOccasions);

app.post("/admin/addVenueType", authMiddleware, AddVenueType);
app.post("/admin/updateVenueType", authMiddleware, UpdateVenueType);
app.get("/admin/deleteVenueType/:id", authMiddleware, DeleteVenueType);
app.get("/admin/venueTypes", authMiddleware, GetAdminVenueTypes);

app.post("/admin/addVenue", authMiddleware, venueUpload.single("image"), AddVenue);
app.post("/admin/updateVenue", authMiddleware, venueUpload.single("image"), UpdateVenue);
app.get("/admin/deleteVenue/:id", authMiddleware, DeleteVenue);
app.get("/admin/venues", authMiddleware, GetAdminVenues);

app.get("/admin/bookings", authMiddleware, GetBookings);
app.post("/admin/updateBooking", authMiddleware, UpdateBooking);

app.get("/admin/payments", authMiddleware, GetPayments);
app.get("/admin/feedbacks", authMiddleware, GetAdminFeedbacks);
app.get("/admin/dashboardStats", authMiddleware, DashboardStats);

app.get("/", (req, res) => { res.send("Welcome to Venue Booking Service Platform API!"); });

app.listen(PORT, () => console.log(`✅ Venue Reservation server started on PORT ${PORT}!`));
