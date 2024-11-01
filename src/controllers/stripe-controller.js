const prisma = require("../config/prisma");
const tryCatch = require("../utils/try-catch");
const stripe = require("stripe")(
  "sk_test_51QGAMTELH1fq6TmuSBZAnTpyNAESEhf56sDA7YQogQ1qpSk82RaoYRLNk7YDQKhmiNpGhmUGx0d1TEZAP9KczRyW00mBYrQXKp"
);

exports.createPayment = tryCatch(async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5000,
    currency: "thb",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
