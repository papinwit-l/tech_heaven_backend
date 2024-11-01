const express = require("express");
const bookRouter = express.Router();
const bookController = require("../controllers/booking-controller");
const authenticate = require("../middlewares/authenticate");

bookRouter.post("/create-booking", authenticate.auth, bookController.createBooking)
bookRouter.get("/get-all-bookings", bookController.getAllBookings)
bookRouter.get("/get-booking-by-id/:bookingId", bookController.getBookingById)
bookRouter.get("/get-booking-by-user-id", authenticate.auth, bookController.getBookingByUserId);
bookRouter.patch("/update-booking/:bookingId", bookController.updateBooking)

module.exports = bookRouter