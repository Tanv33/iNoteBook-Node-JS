import connectToMongo from "./database.js";
import express from "express";
import notesRoute from "./routes/notes.js";
import authRoute from "./routes/auth.js";

const app = express();
const port = 5000;
connectToMongo();

app.use(express.json());

// Available routes
// For creating user and Authentication
app.use("/api/auth", authRoute);
// For creating notes and CRUD operation
app.use("/api/notes", notesRoute);

app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);
