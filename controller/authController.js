const User = require("../model/User");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { sendmail } = require("../config/email");
exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(406).json({
      error: "Please fill up all the fields",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }
  const validuser = await bcrypt.compare(password, user.password);
  if (validuser) {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        company: user.company,
        verified: user.verified,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );
    user.password = null;
    if (!user.verified) {
      req.email = email;
      req.url = process.env.SERVERURL + "/verify/" + token;
      await sendmail(req, res);
      return;
    }
    return res.cookie("token", token).status(200).json({
      verified: user.verified,
      email: user.email,
      id: user._id,
    });
  } else {
    return res.status(401).json({ error: "Invalid Password" });
  }
};

exports.register = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const company = req.body.company;
  if (!email || !password || !company) {
    return res.status(400).json({
      error: "Please fill up all the fields",
    });
  }
  if (email.split("@")[1] !== "charusat.edu.in") {
    return res
      .status(401)
      .json({ error: "Please Register using your college email" });
  }
  // Check for existing user with same email or username
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        error: "User alredy exits, please login",
      });
    }
    const hashpass = bcrypt.hashSync(password, 10);
    const userdetail = await User.create({
      email,
      password: hashpass,
      company,
    });
    const token = jwt.sign(
      {
        id: userdetail._id,
        email: userdetail.email,
        company: userdetail.company,
        verified: userdetail.verified,
      },
      process.env.JWT_SECRET,
      {
        //   expiresIn: "3h",
      }
    );
    req.email = email;
    req.url = process.env.SERVERURL + "/verify/" + token;
    await sendmail(req, res);
    return;
  } catch (error) {
    return res.status(500).json({ error: "error occured on server side" });
  }
};

exports.verify = async (req, res) => {
  var token = req.params.token;
  if (!token) {
    return res.status(406).json({ error: "No token found while verification" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(data.);
    const user = await User.findById(data.id);
    if (!user) {
      return res.status(400).json({ error: "The user is not in the database" });
    }
    user.verified = true;
    await user.save();
    token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        company: user.company,
        verified: user.verified,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );
    res.cookie("token", token, { expiresIn: "3h" });
    return res.status(200).redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.log("error while email verification");
    console.log(error.message);
    return res.status(400).json({ error: "error while email verification" });
  }
};

exports.profile = async (req, res) => {
  return res.json(req.user);
};
exports.logOut = async (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully!" });
};
