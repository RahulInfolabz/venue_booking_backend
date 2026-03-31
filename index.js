const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./db/dbConnect");
require("dotenv").config();

// ── Multer ────────────────────────────────────────────────────────────────────
const { venueUpload, profileUpload } = require("./multer/multer");

// ── Common ────────────────────────────────────────────────────────────────────
const Logout = require("./apis/common/logout");
const Session = require("./apis/common/session");
const { Login } = require("./apis/common/login");
const { Signup } = require("./apis/common/signup");
const { ChangePassword } = require("./apis/common/changePassword");

// ── Public ────────────────────────────────────────────────────────────────────
const { GetCities } = require("./apis/user/GetCities");
const { GetOccasions } = require("./apis/user/GetOccasions");
const { GetVenueTypes } = require("./apis/user/GetVenueTypes");
const { GetVenues } = require("./apis/user/GetVenues");
const { GetVenueDetails } = require("./apis/user/GetVenueDetails");
const { GetFeedbacks } = require("./apis/user/GetFeedbacks");

// ── User ──────────────────────────────────────────────────────────────────────
const { GetProfile } = require("./apis/user/GetProfile");
const { UpdateProfile } = require("./apis/user/UpdateProfile");
const { BookVenue } = require("./apis/user/BookVenue");
const { MyBookings } = require("./apis/user/MyBookings");
const { CancelBooking } = require("./apis/user/CancelBooking");
const { GenOrderId } = require("./apis/user/GenOrderId");
const { VerifyPayment } = require("./apis/user/VerifyPayment");
const { AddFeedback } = require("./apis/user/AddFeedback");

// ── Admin ─────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "venue_platform_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);


app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

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
// filters: ?city_id= ?occasion_id= ?venue_type_id= ?min_price= ?max_price=
app.get("/venues", GetVenues);
app.get("/venues/:id", GetVenueDetails);
app.get("/feedbacks", GetFeedbacks);
app.get("/feedbacks/:venue_id", GetFeedbacks);

// ── USER ──────────────────────────────────────────────────────────────────────
app.get("/user/profile", GetProfile);
app.post("/user/updateProfile", profileUpload.single("profile_image"), UpdateProfile);
app.post("/user/bookVenue", BookVenue);
app.get("/user/myBookings", MyBookings);
app.post("/user/cancelBooking", CancelBooking);
app.post("/user/genOrderId", GenOrderId);
app.post("/user/verifyPayment", VerifyPayment);
app.post("/user/addFeedback", AddFeedback);

// ── ADMIN ─────────────────────────────────────────────────────────────────────
app.get("/admin/users", GetUsers);
app.post("/admin/updateUserStatus", UpdateUserStatus);

app.post("/admin/addCity", AddCity);
app.post("/admin/updateCity", UpdateCity);
app.get("/admin/deleteCity/:id", DeleteCity);
app.get("/admin/cities", GetAdminCities);

app.post("/admin/addOccasion", AddOccasion);
app.post("/admin/updateOccasion", UpdateOccasion);
app.get("/admin/deleteOccasion/:id", DeleteOccasion);
app.get("/admin/occasions", GetAdminOccasions);

app.post("/admin/addVenueType", AddVenueType);
app.post("/admin/updateVenueType", UpdateVenueType);
app.get("/admin/deleteVenueType/:id", DeleteVenueType);
app.get("/admin/venueTypes", GetAdminVenueTypes);

app.post("/admin/addVenue", venueUpload.single("image"), AddVenue);
app.post("/admin/updateVenue", venueUpload.single("image"), UpdateVenue);
app.get("/admin/deleteVenue/:id", DeleteVenue);
app.get("/admin/venues", GetAdminVenues);

app.get("/admin/bookings", GetBookings);
app.post("/admin/updateBooking", UpdateBooking);

app.get("/admin/payments", GetPayments);
app.get("/admin/feedbacks", GetAdminFeedbacks);
app.get("/admin/dashboardStats", DashboardStats);

// ─────────────────────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.send("Welcome to Venue Booking Service Platform API!");
});


app.listen(PORT, () =>
  console.log(`✅ Venue Reservation server started on PORT ${PORT}!`)
);
