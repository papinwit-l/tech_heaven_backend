const prisma = require("../config/prisma");
const tryCatch = require("../utils/try-catch");
const stripe = require("stripe")("sk_test_51QGAMTELH1fq6TmuSBZAnTpyNAESEhf56sDA7YQogQ1qpSk82RaoYRLNk7YDQKhmiNpGhmUGx0d1TEZAP9KczRyW00mBYrQXKp");
const nodemailer = require("nodemailer");

exports.createPayment = tryCatch(async (req, res) => {
  const { id } = req.user;

  const cart = await prisma.cart.findFirst({
    where: {
      userId: id,
    },
    include: {
      CartItems: {
        include: {
          product: {
            include : {
              ProductImages : true
            }
          }
        },
      },
    },
  });
console.log(cart.CartItems[0],"cartttttttttttttttttttttttttttttttttttttttttttt")
  const amountTHB = cart.total * 100;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountTHB,
    currency: "thb",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const productImages = cart.CartItems.map((item) => item.product.ProductImages[0]);
console.log(productImages)
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Order Received",
    html: `<div>
      <h3>Thank you for your order!</h3>
      <p>Here are the products you ordered:</p>
      <div>
        ${productImages
          .map((image) => `<img src='${image.imageUrl}' style='width:100px; height:auto; margin:10px;' />`)
          .join('')}
      </div>
    </div>`,
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});