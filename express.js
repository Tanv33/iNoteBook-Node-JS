const connectToMongo = require("./database");
const express = require("express");
const app = express();
const port = 5000;
connectToMongo();

app.use(express.json());

// Available routes
// For creating user and Authentication
app.use("/api/auth", require("./routes/auth"));
// For creating notes and CRUD operation
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);
