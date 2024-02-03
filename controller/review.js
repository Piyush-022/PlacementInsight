const mongoose = require("mongoose");
const Process = require("../model/Process");

exports.getReview = async (req, res) => {
  const { company, minPackage, maxBondPeriod } = req.query;
  const query = {};
  if (company)
    query.company = { $regex: new RegExp("^" + company.toLowerCase(), "i") };
  if (minPackage) query.package = { $gte: minPackage };
  if (maxBondPeriod) query.bond = { $lte: maxBondPeriod };
  try {
    const reviews = await Process.find(query);
    res.json({ reviews });
  } catch (error) {
    console.log("error occured while getting reviews");
    console.log(error);
    res.status(500).json({
      error: "error occured while getting reviews",
    });
  }
};
exports.addReview = async (req, res) => {
  if (
    req.user.email[0].toLowerCase() !== "d" &&
    parseInt(req.user.email.slice(0, 2)) > 20
  ) {
    res.status(400).json({
      error: "only students of batch 2020 and before can add experience",
    });
  }
  if (
    req.user.email[0].toLowerCase() === "d" &&
    parseInt(req.user.email.slice(1, 3)) > 21
  ) {
    res.status(400).json({
      error: "only students of batch 2020 or before can add experience",
    });
  }
  const userId = req.user.id;
  const {
    company,
    bond,
    stipend,
    Package: package,
    selected,
    rounds,
  } = req.body;
  if (!company || !bond || !stipend || !package || !rounds) {
    res.status(400).json({ error: "please fill up all the fields" });
  }
  try {
    const review = await Process.create({
      userId: new mongoose.Types.ObjectId(userId),
      company,
      bond,
      stipend,
      package,
      selected,
      rounds,
    });
    res.json({
      message: "successfully added",
    });
  } catch (error) {
    console.log("error while adding a new review");
    console.log(error.message);
    return res.status(500).json({ eroor: "error while adding a new review" });
  }
};
