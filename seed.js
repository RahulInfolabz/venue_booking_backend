const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "venue_platform";

async function seed() {
  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db(DB_NAME);

  console.log("🌱 Starting seed...");

  await db.collection("users").deleteMany({});
  await db.collection("cities").deleteMany({});
  await db.collection("occasions").deleteMany({});
  await db.collection("venue_types").deleteMany({});
  await db.collection("venues").deleteMany({});
  await db.collection("bookings").deleteMany({});
  await db.collection("payments").deleteMany({});
  await db.collection("feedbacks").deleteMany({});

  console.log("🗑️  Cleared existing collections");

  // ── Users ─────────────────────────────────────────────────────────────────
  const usersResult = await db.collection("users").insertMany([
    {
      name: "Admin User",
      email: "admin@venue.com",
      phone: "9900000001",
      password: "Admin@123",
      address: "Admin Office, Ahmedabad",
      profile_image: "",
      role: "Admin",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9900000002",
      password: "Rahul@123",
      address: "22, Satellite Road, Ahmedabad",
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Priya Patel",
      email: "priya@gmail.com",
      phone: "9900000003",
      password: "Priya@123",
      address: "45, Bodakdev, Ahmedabad",
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const userIds = Object.values(usersResult.insertedIds);
  console.log("✅ Users seeded");

  // ── Cities ────────────────────────────────────────────────────────────────
  const citiesResult = await db.collection("cities").insertMany([
    { name: "Ahmedabad", status: "Active", created_at: new Date() },
    { name: "Surat", status: "Active", created_at: new Date() },
    { name: "Vadodara", status: "Active", created_at: new Date() },
    { name: "Rajkot", status: "Active", created_at: new Date() },
    { name: "Gandhinagar", status: "Active", created_at: new Date() },
  ]);

  const cityIds = Object.values(citiesResult.insertedIds);
  console.log("✅ Cities seeded");

  // ── Occasions ─────────────────────────────────────────────────────────────
  const occasionsResult = await db.collection("occasions").insertMany([
    { name: "Wedding", created_at: new Date() },
    { name: "Birthday Party", created_at: new Date() },
    { name: "Corporate Event", created_at: new Date() },
    { name: "Conference", created_at: new Date() },
    { name: "Engagement", created_at: new Date() },
    { name: "Reception", created_at: new Date() },
    { name: "Anniversary", created_at: new Date() },
  ]);

  const occasionIds = Object.values(occasionsResult.insertedIds);
  console.log("✅ Occasions seeded");

  // ── Venue Types ───────────────────────────────────────────────────────────
  const venueTypesResult = await db.collection("venue_types").insertMany([
    { name: "Resort", created_at: new Date() },
    { name: "Banquet Hall", created_at: new Date() },
    { name: "Hotel", created_at: new Date() },
    { name: "Farmhouse", created_at: new Date() },
    { name: "Convention Centre", created_at: new Date() },
    { name: "Outdoor Garden", created_at: new Date() },
  ]);

  const venueTypeIds = Object.values(venueTypesResult.insertedIds);
  console.log("✅ Venue Types seeded");

  // ── Venues ────────────────────────────────────────────────────────────────
  const venuesResult = await db.collection("venues").insertMany([
    {
      occasion_id: occasionIds[0], // Wedding
      venue_type_id: venueTypeIds[0], // Resort
      city_id: cityIds[0], // Ahmedabad
      description: "A luxurious resort with sprawling lawns, exquisite décor options, world-class catering, and dedicated wedding planning services. Perfect for grand weddings.",
      price: 150000,
      image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      occasion_id: occasionIds[0], // Wedding
      venue_type_id: venueTypeIds[1], // Banquet Hall
      city_id: cityIds[0], // Ahmedabad
      description: "Elegant air-conditioned banquet hall with capacity for 500 guests, fully equipped stage, premium sound system, and in-house catering.",
      price: 80000,
      image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      occasion_id: occasionIds[2], // Corporate Event
      venue_type_id: venueTypeIds[4], // Convention Centre
      city_id: cityIds[0], // Ahmedabad
      description: "State-of-the-art convention centre with multiple halls, AV equipment, projectors, high-speed Wi-Fi, and parking for 200+ vehicles.",
      price: 60000,
      image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      occasion_id: occasionIds[1], // Birthday Party
      venue_type_id: venueTypeIds[3], // Farmhouse
      city_id: cityIds[1], // Surat
      description: "Spacious private farmhouse with pool, garden, DJ setup, and customizable décor. Ideal for birthday celebrations and private parties.",
      price: 45000,
      image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      occasion_id: occasionIds[4], // Engagement
      venue_type_id: venueTypeIds[2], // Hotel
      city_id: cityIds[2], // Vadodara
      description: "5-star hotel ballroom with crystal chandeliers, premium furniture, dedicated event managers, and exclusive catering packages.",
      price: 120000,
      image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      occasion_id: occasionIds[0], // Wedding
      venue_type_id: venueTypeIds[5], // Outdoor Garden
      city_id: cityIds[1], // Surat
      description: "Beautiful outdoor garden venue with lush greenery, fairy lights, open-air mandap setup, and breathtaking sunset views. Perfect for outdoor weddings.",
      price: 95000,
      image: "",
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const venueIds = Object.values(venuesResult.insertedIds);
  console.log("✅ Venues seeded");

  // ── Bookings ──────────────────────────────────────────────────────────────
  const bookingsResult = await db.collection("bookings").insertMany([
    {
      register_id: userIds[1], // Rahul
      venue_id: venueIds[0], // Luxury Resort
      booking_start_date: new Date("2025-12-20"),
      booking_end_date: new Date("2025-12-22"),
      booking_time: "18:00",
      total_amount: 300000,
      rental_days: 2,
      booking_status: "Approved",
      payment_mode: "Online",
      payment_status: "Success",
      created_at: new Date("2025-12-01"),
    },
    {
      register_id: userIds[2], // Priya
      venue_id: venueIds[2], // Convention Centre
      booking_start_date: new Date("2026-01-15"),
      booking_end_date: new Date("2026-01-15"),
      booking_time: "09:00",
      total_amount: 60000,
      rental_days: 1,
      booking_status: "Approved",
      payment_status: "Success",
      payment_mode: "Online",
      created_at: new Date("2025-12-10"),
    },
    {
      register_id: userIds[1], // Rahul
      venue_id: venueIds[4], // Hotel Ballroom
      booking_start_date: new Date("2026-02-14"),
      booking_end_date: new Date("2026-02-14"),
      booking_time: "19:00",
      total_amount: 120000,
      rental_days: 1,
      booking_status: "Pending",
      payment_status: "Pending",
      payment_mode: "Online",
      created_at: new Date(),
    },
  ]);

  const bookingIds = Object.values(bookingsResult.insertedIds);
  console.log("✅ Bookings seeded");

  // ── Payments ──────────────────────────────────────────────────────────────
  await db.collection("payments").insertMany([
    {
      register_id: userIds[1],
      booking_id: bookingIds[0],
      transaction_id: "pay_demo_001",
      total_amount: 300000,
      razorpay_order_id: "order_demo_001",
      razorpay_signature: "sig_demo_001",
      payment_status: "Done",
      date: new Date("2025-12-01"),
    },
    {
      register_id: userIds[2],
      booking_id: bookingIds[1],
      transaction_id: "pay_demo_002",
      total_amount: 60000,
      razorpay_order_id: "order_demo_002",
      razorpay_signature: "sig_demo_002",
      payment_status: "Done",
      date: new Date("2025-12-10"),
    },
  ]);

  console.log("✅ Payments seeded");

  // ── Feedbacks ─────────────────────────────────────────────────────────────
  await db.collection("feedbacks").insertMany([
    {
      register_id: userIds[1],
      venue_id: venueIds[0],
      message: "Your venue is absolutely wonderful! The decorations, food, and service were all top-notch.",
      review: "Excellent",
      rating: 5,
      created_at: new Date("2025-12-23"),
    },
    {
      register_id: userIds[2],
      venue_id: venueIds[2],
      message: "Great convention centre with all the facilities needed for a corporate event. Highly recommended.",
      review: "Very Good",
      rating: 4,
      created_at: new Date("2026-01-16"),
    },
  ]);

  console.log("✅ Feedbacks seeded");

  console.log("\n🎉 Seed completed successfully!");
  console.log("──────────────────────────────────────────");
  console.log("👤 Admin   → admin@venue.com     / Admin@123");
  console.log("👤 User 1  → rahul@gmail.com     / Rahul@123");
  console.log("👤 User 2  → priya@gmail.com     / Priya@123");
  console.log("──────────────────────────────────────────");

  await client.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
