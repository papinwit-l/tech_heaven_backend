const express = require("express");
const bookRouter = express.Router();
const bookController = require("../controllers/booking-controller");

bookRouter.post("/create-booking", bookController.createBooking)
bookRouter.get("/get-all-bookings/:count", bookController.getAllBookings)
bookRouter.get("/get-booking-by-id/:bookingId", bookController.getBookingById)
bookRouter.patch("/update-booking/:bookingId", bookController.updateBooking)

module.exports = bookRouter