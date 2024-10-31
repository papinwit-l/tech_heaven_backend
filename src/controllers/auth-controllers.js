const createError = require("../utils/createError");
const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

module.exports.register = async (req, res, next) => {
  const { email, password, firstName, lastName, dateOfBirth } = req.input;
  try {
    const { SignupMethod } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return createError(400, "Email already exist");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        dateOfBirth,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
      },
    });
    res.status(201).json({ newUser });
  } catch (err) {
    next(err);
    console.log(err);
  }
};
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return createError(400, "Email is not Valid");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return createError(400, "Wrong Password");
    }
    const PayloadToken = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(PayloadToken, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({ user: PayloadToken, token: token });
  } catch (err) {
    next(err);
    console.log(err);
  }
};
module.exports.loginGoogle = async (req, res, next) => {
  try {
    console.log("check body -->", req.body);
    const { email, given_name, family_name, picture } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    console.log(user);
    let newUser = null;
    if (user) {
      newUser = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          email: email,
          firstName: given_name,
          lastName: family_name,
          profileImage: picture,
        },
      });
    } else {
      newUser = await prisma.user.create({
        data: {
          email: email,
          firstName: given_name,
          lastName: family_name,
          profileImage: picture,
        },
      });
    }
    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      address: newUser.address,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      profileImage: newUser.profileImage,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          return createError(500, "Server Error");
        }
        res.json({ payload, token });
      }
    );
  } catch (err) {
    next(err);
    console.log(err);
  }
};
module.exports.getMe = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};
// module.exports.forgetPassword = (async(req,res,next) => {
//   const { email } = req.body
//   const user = await prisma.user.findUnique({ where: { email } })
//   if (!user) {
//       return createError(404, "User not found")
//   }
//   const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

//   const transporter = nodemailer.createTransport({
//       service: 'gmail', // Configure your email service
//       auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//       }
//   });
//   const resetUrl = `${process.env.BASE_URL}/ResetPassword/${token}`;
//   await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: 'Password Reset Request',
//       text: `Reset your password by clicking the link: ${resetUrl}`,
//       html: ``
//   })
//   res.status(200).json({ message: "Password reset link sent to your email" });
// })
