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
  let group1Size = 0;
  let group2Size = 0;
  let saveTeams = [];

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

    //Check if there are more than 6 teams per group
    if (group1Size > 6 || group2Size > 6) {
      return res.json({ status: "error", reason: "Group size exceeded" });
    }
    if (parseInt(group) === 1) group1Size++;
    else if (parseInt(group) === 2) group2Size++;

    //Check the current team is already registered
    if (saveTeams.find((team) => team.name === name)) {
      return res.json({ status: "error", reason: "Team already registered" });
    } else {
      let team = new Team({
        name,
        registeredDate,
        group: parseInt(group),
        points: 0,
        alternatePoints: 0,
        totalGoals: 0,
        opponents: [],
      });

      saveTeams.push(team);
    }
  }

  if (saveTeams.length === teams.length) {
    for (let i = 0; i < saveTeams.length; i++) {
      await saveTeams[i].save();
    }
  } else {
    return res.json({ status: "error", reason: "Something went wrong" });
  }

  return res.json(teams);
});

//POST
//Update teams' points, totalGoals, alternatePoints & opponents
router.patch("/", async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.json({ status: "error", reason: "Content cannot be empty" });
  }

  let matches = req.body.matches;

  //Get all teams
  let teams;
  try {
    teams = await Team.find({});
  } catch (err) {
    return res.json({ status: "error", reason: err.message });
  }

  for (let i = 0; i < matches.length; i++) {
    const { teamA, teamB, goalsA, goalsB } = matches[i];

    //check for missing fields
    if (!teamA || !teamB || !goalsA || !goalsB) {
      return res.json({ status: "error", reason: "Missing field(s)" });
    }

    //check if teamA === teamB
    if (teamA === teamB) {
      return res.json({
        status: "error",
        reason: "Teams cannot play against themselves",
      });
    }

    //check if teamA and teamB are registered
    let firstTeam;
    let secondTeam;
    for (let j = 0; j < teams.length; j++) {
      if (teams[j].name === teamA) {
        firstTeam = teams[j];
      } else if (teams[j].name === teamB) {
        secondTeam = teams[j];
      }
    }

    if (!firstTeam && !secondTeam) {
      return res.json({
        status: "error",
        reason: `Both ${teamA} and ${teamB} are not regsitered`,
      });
    } else if (!firstTeam) {
      return res.json({
        status: "error",
        reason: `${teamA} is not registered`,
      });
    } else if (!secondTeam) {
      return res.json({
        status: "error",
        reason: `${teamB} is not registered`,
      });
    }

    //check if teamA and teamB are from the same group
    if (parseInt(firstTeam.group) !== parseInt(secondTeam.group)) {
      return res.json({
        status: "error",
        reason: `${teamA} and ${teamB} are not from the same group`,
      });
    }

    //check if teamA and teamB have played against each other before
    if (
      firstTeam.opponents.includes(teamB) ||
      secondTeam.opponents.includes(teamA)
    ) {
      return res.json({
        status: "error",
        reason: `${teamA} and ${teamB} have played against each other before`,
      });
    }

    //update teamA's & teamB's points, totalGoals, alternatePoints, opponents
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

    firstTeam.opponents.push(teamB);
    secondTeam.opponents.push(teamA);
  }

  for (let i = 0; i < teams.length; i++) {
    await teams[i].save();
  }

  return res.json({ matches });
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
