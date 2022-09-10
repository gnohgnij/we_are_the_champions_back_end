const express = require("express");
const moment = require("moment");

const Team = require("../models/Team");

const router = express.Router();

//GET
//Get all teams
router.get("/", async (req, res) => {
  try {
    let teams = await Team.find({});
    return res.json({ teams });
  } catch (err) {
    return res.json({ status: "error", reason: err.message });
  }
});

//GET
//Get a team from name
router.get("/:name", async (req, res) => {
  let name = req.params.name;
  try {
    let team = await Team.findOne({ name });
    return res.json({ team });
  } catch (err) {
    return res.json({ status: "error", reason: "Could not find team" });
  }
});

//POST
//Create new teams
router.post("/", async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.json({ status: "error", reason: "Content cannot be empty" });
  }

  let teams = req.body.teams;

  for (let i = 0; i < teams.length; i++) {
    const { name, registeredDate, group } = teams[i];

    //Check for missing fields/empty line
    if (!name || !registeredDate || !group)
      return res.json({ status: "error", reason: "Missing fields" });

    //Check if registeredDate is valid
    if (!moment(registeredDate, "DD/MM", true).isValid()) {
      return res.json({
        status: "error",
        reason: "Invalid registered date",
      });
    }

    //Check if group is valid (i.e. either 1 or 2)
    if (parseInt(group) != 1 && parseInt(group) != 2) {
      return res.json({ status: "error", reason: "Invalid group number" });
    }

    //Check the current team is already registered
    let team;
    try {
      team = await Team.findOne({ name });
    } catch (err) {
      return res.json({ status: "error", reason: err.message });
    }

    if (team) {
      return res.json({ status: "error", reason: "Team already registered" });
    } else {
      team = new Team({
        name,
        registeredDate,
        group: parseInt(group),
        points: 0,
        alternatePoints: 0,
        totalGoals: 0,
      });

      await team.save();
    }
  }

  return res.json(teams);
});

//DELETE
//Delete all teams
router.delete("/", async (req, res) => {
  try {
    let deleteCount = await Team.deleteMany({});
    return res.json({ deleteCount });
  } catch (err) {
    return res.json({ status: "error", reason: err.message });
  }
});

module.exports = router;
