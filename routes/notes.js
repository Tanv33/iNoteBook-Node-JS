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
      // console.log("fetcggg:", fetchData);
      res.send(fetchData);
    }
    // console.log(fetchData);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send("Error in fetching All Data");
  }
});

//  Route 2 Add Note corresponding to user "/addnote" -- login required + validation so user can't send empty fields
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

//  Route 3 Updating note corresponding to user "/updatenote" -- login required
router.put("/updatenote:id", fetchuser, async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, tag } = req.body;
    let newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    // find the note and update it
    const note = Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(402).send("Not Allowed");
    }
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    // console.log(updated);
    res.send(updated);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send("Error in fetching All Data");
  }
});

export default router;
