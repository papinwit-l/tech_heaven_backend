const prisma = require("../models/prisma");
const tryCatch = require("../utils/try-catch");

exports.createBooking = tryCatch(async (req, res) => {
    console.log(req.body);
    const { bookingDate, type, notes, status } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).send("User not authenticated");
    }

    const bookingTime = new Date(bookingDate);
    const timeSlot = `${bookingTime.getHours()}:${bookingTime.getMinutes()}`;

    try {
        const queueCount = await prisma.booking.count({
            where: {
                bookingDate: {
                    gte: new Date(bookingTime.setSeconds(0, 0)),
                    lt: new Date(bookingTime.setMinutes(bookingTime.getMinutes() + 30, 0)), // End of the time slot (30 minutes later)
                },
                queuePosition: { not: null }
            }
        });

        if (queueCount >= 2) {
            return res.status(400).send("Queue is full for this time slot");
        }

        const nextQueuePosition = queueCount + 1;

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
                queuePosition: nextQueuePosition,
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
    if (!req.user || !req.user.id) {
        return res.status(401).send("User not authenticated");
    }

    const booking = await prisma.booking.findUnique({
        where: { id: +bookingId },
    });

    if (!booking || booking.userId !== req.user.id) {
        return res.status(404).send("Booking not found or user not authorized");
    }

    await prisma.booking.update({
        where: { id: +bookingId },
        data: { queuePosition: null,
            status: status
         },
    });

    await prisma.booking.updateMany({
        where: {
            queuePosition: { gt: booking.queuePosition },
        },
        data: {
            queuePosition: {
                decrement: 1,
            },
        },
    });
    res.send(booking)
})

exports.deleteBooking = tryCatch(async (req, res) => {
    const { bookingId } = req.params
    const booking = await prisma.booking.delete({
        where: {
            id: +bookingId
        }
    })
    res.send(booking)
})