const prisma = require("../models/prisma");
const trycatch = require("../utils/try-catch");

exports.createBooking = trycatch(async (req, res) => {
    const { bookingDate, type, notes, status } = req.body
    const booking = await prisma.booking.create({
        data: {
            bookingDate,
            status,
            type,
            notes,
        }
    })

    res.send("Booking created")
})

exports.getAllBookings = trycatch(async (req, res) => {
    const { count } = req.params
    const bookings = await prisma.booking.findMany({
        take: parseInt(count),
        orderBy: {
            createdAt: "desc"
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    })
    res.send(bookings)
})

exports.getBookingById = trycatch(async (req, res) => {
    const { bookingId } = req.params
    const booking = await prisma.booking.findUnique({
        where: {
            id: parseInt(bookingId)
        }
    })
    res.send(booking)
})

exports.updateBooking = trycatch(async (req, res) => {
    const { status } = req.body
    const { bookingId } = req.params
    const booking = await prisma.booking.update({
        where: {
            id: parseInt(bookingId)
        },
        data: {
            status: status
        }
    })
    res.send(booking)
})