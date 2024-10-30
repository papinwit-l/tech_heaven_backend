const express = require("express");
const bookRouter = express.Router();
const bookController = require("../controllers/booking-controller");

bookRouter.post("/booking/create-booking", bookController.createBooking)
bookRouter.get("/booking/get-all-bookings/:count", bookController.getAllBookings)
bookRouter.get("/booking/get-booking-by-id/:bookingId", bookController.getBookingById)
bookRouter.patch("/booking/update-booking/:bookingId", bookController.updateBooking)

module.exports = bookRouter