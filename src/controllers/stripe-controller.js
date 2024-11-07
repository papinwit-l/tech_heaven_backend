const prisma = require("../config/prisma");
const tryCatch = require("../utils/try-catch");
const stripe = require("stripe")(
  "sk_test_51QGAMTELH1fq6TmuSBZAnTpyNAESEhf56sDA7YQogQ1qpSk82RaoYRLNk7YDQKhmiNpGhmUGx0d1TEZAP9KczRyW00mBYrQXKp"
);

exports.createPayment = tryCatch(async (req, res) => {
  const { id } = req.user;
  const cart = await prisma.cart.findFirst({
    where: {
      userId: id,
      status: "PENDING",
    }
  })

  const amountTHB = cart.total * 100

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountTHB,
    currency: "thb",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
