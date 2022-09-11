const express = require("express");

const Match = require("../models/Match");
const Team = require("../models/Team");

const router = express.Router();

//GET
//Get all matches
router.get("/", async (req, res) => {
  try {
    let matches = await Match.find({});
    return res.json({ matches });
  } catch (err) {
    return res.json({ status: "error", reason: err.message });
  }
});

//GET
//Get all matches for a team
router.get("/:name", async (req, res) => {
  let name = req.params.name;
  let matches;

  //check if teamA is registered
  let team;
  try {
    team = await Team.findOne({ name });
  } catch (err) {
    return res.json({ status: "error", reason: err.message });
  }
  if (!team) {
    return res.json({ status: "error", reason: `${team} is not registered` });
  }

  //get matches where the team is teamA
  let teamAMatches;
  try {
    teamAMatches = await Match.find({ teamA: team });
  } catch (err) {
    return res.json({ status: "error", reason: err.message });
  }

  //get matches where the team is teamB
  let teamBMatches;
  try {
    teamBMatches = await Match.find({ teamB: team });
  } catch (err) {
    return res.json({ status: "error", reason: err.message });
  }

  matches = teamAMatches.concat(teamBMatches);

  return res.json({ matches });
});

//POST
//Create the match records
router.post("/", async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.json({ status: "error", reason: "Content cannot be empty" });
  }

  let matches = req.body.matches;

  for (let i = 0; i < matches.length; i++) {
    const { teamA, teamB, goalsA, goalsB } = matches[i];

    //check if teamA and teamB are registered
    let firstTeam;
    try {
      firstTeam = await Team.findOne({ name: teamA });
    } catch (err) {
      return res.json({ status: "error", reason: err.message });
    }

    if (!firstTeam) {
      return res.json({
        status: "error",
        reason: `${teamA} is not registered`,
      });
    }

    let secondTeam;
    try {
      secondTeam = await Team.findOne({ name: teamB });
    } catch (err) {
      return res.json({ status: "error", reason: err.message });
    }

    if (!secondTeam) {
      return res.json({
        status: "error",
        reason: `${teamB} is not registered`,
      });
    }

    //update teamA's & teamB's points, totalGoals, alternatePoints
    firstTeam.totalGoals += parseInt(goalsA);
    secondTeam.totalGoals += parseInt(goalsB);

    if (parseInt(goalsA) > parseInt(goalsB)) {
      firstTeam.points += 3;
      firstTeam.alternatePoints += 5;
      secondTeam.alternatePoints += 1;
    } else if (parseInt(goalsA) === parseInt(goalsB)) {
      firstTeam.points += 1;
      secondTeam.points += 1;
      firstTeam.alternatePoints += 3;
      secondTeam.alternatePoints += 3;
    } else {
      firstTeam.alternatePoints += 1;
      secondTeam.points += 3;
      secondTeam.alternatePoints += 5;
    }

    await firstTeam.save();
    await secondTeam.save();

    //check if teamA and teamB match already exists
    let match;
    try {
      match = await Match.findOne({ teamA: firstTeam, teamB: secondTeam });
    } catch (err) {
      return res.json({ status: "error", reason: err.message });
    }

    if (match) {
      return res.json({
        status: "error",
        reason: `Match between ${teamA} and ${teamB} is already recorded`,
      });
    } else {
      match = new Match({
        teamA: firstTeam,
        teamB: secondTeam,
        goalsA: goalsA,
        goalsB: goalsB,
      });

      await match.save();
    }
  }
  return res.json({ matches });
});

//DELETE
//Delete all records
router.delete("/", async (req, res) => {
  try {
    let deleteCount = await Match.deleteMany({});
    return res.json({ deleteCount });
  } catch (err) {
    return res.json({ status: "error", reason: err.message });
  }
});

module.exports = router;
