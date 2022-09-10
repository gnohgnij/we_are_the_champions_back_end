const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();
app.use(express.json({ extended: false }));
app.use(cors());

connectDB();

app.use("/api/team", require("./routes/team"));
app.use("/api/match", require("./routes/match"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port 3000`);
});
