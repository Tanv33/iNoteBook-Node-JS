import express from "express";
import fetchuser from "../middleware/fetchuser.js";
import Note from "../models/Notes.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

//  Route 1 Fetch All Data corresponding user "/fetchalldata" -- login required
router.get("/fetchalldata", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const fetchData = await Note.find({ user: userId });
    if (fetchData.length) {
      console.log("fetcggg:", fetchData);
    }
    console.log(fetchData);
    res.send(fetchData);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send("Error in fetching All Data");
  }
});

//  Route 2 Add Note corresponding user "/addnote" -- login required + validation so user can't send empty fields
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body(
      "description",
      "Description length should be 5 characters long"
    ).isLength({
      min: 5,
    }),
    body("tag", "Enter a valid tag").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const addNote = new Note({
        user: req.user.id,
        title,
        description,
        tag,
      });
      const addedData = await addNote.save();

      if (addedData) {
        console.log("Added Data:", addedData);
        res.send(addedData);
      }
    } catch (error) {
      console.log(error.message);
      return res.status(400).send("Error in fetching All Data");
    }
  }
);

export default router;
