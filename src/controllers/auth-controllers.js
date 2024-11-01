const createError = require("../utils/createError");
const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();


// Import Cloudinary
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

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
  console.log("login");
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
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
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

module.exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return createError(404, "User not found");
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const transporter = nodemailer.createTransport({
    service: "gmail", // Configure your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const resetUrl = `${process.env.BASE_URL}/reset-Password/${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request",
    text: `Reset your password by clicking the link: ${resetUrl}`,
    html: ``,
  });
  res.status(200).json({ message: "Password reset link sent to your email" });
};
module.exports.resetPassword = async (req, res, next) => {
  const { password, token } = req.body;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: payload.id },
      data: { password: hashedPassword },
    });

    // Send a response only if there is no error
    return res.status(200).json({ message: "Password successfully changed" });
  } catch (err) {
    // Pass the error to the error-handling middleware
    next(err);
  }
};
module.exports.updateUser = async (req, res, next) => {
  const userId = req.user.id;
  const { firstName, lastName, email, password } = req.body;

  console.log("Received update request from auth-cont:", req.body);

  // 1. Check user exists in the database
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return createError(404, "User not found");
  }

  // 2. Update user details
  const updatedData = {
    firstName,
    lastName,
    email,
  };

  // 3. Check if a new password is provided
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updatedData.password = hashedPassword;
  }

  // 4. Check if an avatar exists and handle profile image upload if a new file is provided
  if (req.file) {
    console.log("File uploaded:", req.file);

    // Get the public ID of the existing image from the user's data
    const existingImagePublicId = user.profileImage
      ? path.parse(user.profileImage).name
      : null;

    // If there is an existing image, delete it from Cloudinary
    if (existingImagePublicId) {
      try {
        await cloudinary.uploader.destroy(existingImagePublicId);
        console.log("Existing image deleted from Cloudinary.");
      } catch (error) {
        console.error(
          "Failed to delete existing image from Cloudinary:",
          error
        );
      }
    }

    // Upload avatar to Cloudinary
    try {
      console.log("Uploading image to Cloudinary...");
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        public_id: path.parse(req.file.path).name,
        timeout: 60000,
      });

      console.log("Upload successful:", uploadResult);
      // Save the secure URL to the profileImage field
      updatedData.profileImage = uploadResult.secure_url;

      // Delete the local file after upload
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Failed to delete local file:", err);
        } else {
          console.log("Local file deleted successfully.");
        }
      });
    } catch (error) {
      console.error("Upload failed:", error);
      return createError(500, "Failed to upload image");
    }
  }

  // 5. Update the user in the database
  await prisma.user.update({
    where: { id: userId },
    data: updatedData,
  });

  return res.json({
    message: "User updated successfully",
    user: updatedData,
  });
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
