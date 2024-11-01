const prisma = require("../models/prisma");
const tryCatch = require("../utils/try-catch");

exports.createBooking = tryCatch(async (req, res) => {
    console.log(req.body);
    const { bookingDate, type, notes, status } = req.body;
    if (!req.user || !req.user.id) {
        return res.status(401).send("User not authenticated");
    }
    try {
        const booking = await prisma.booking.create({
            data: {
                user: {
                    connect: {
                        id: +req.user.id,
                    },
                },
                bookingDate,
                status,
                type,
                notes,
            },
        });

        res.status(201).send("Booking created");
        console.log(booking);
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).send("Error creating booking");
    }
});

exports.getAllBookings = tryCatch(async (req, res) => {
    const bookings = await prisma.booking.findMany({
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

exports.getBookingById = tryCatch(async (req, res) => {
    const { bookingId } = req.params
    const booking = await prisma.booking.findUnique({
        where: {
            id: parseInt(bookingId)
        }
    })
    res.send(booking)
})

exports.getBookingByUserId = tryCatch(async (req, res) => {
    const userId = req.user.id;
    const bookings = await prisma.booking.findMany({
        where: {
            userId: Number(userId)
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });
    res.send(bookings);
});


exports.updateBooking = tryCatch(async (req, res) => {
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