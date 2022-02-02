import { body, validationResult } from "express-validator";
// checking body data comming from user

const addNoteValidation = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  } else {
    next();
  }
 return [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body(
      "description",
      "Description length should be 5 characters long"
    ).isLength({
      min: 5,
    }),
    body("tag", "Enter a valid tag").isLength({ min: 3 }),
  ];

};

export default addNoteValidation;
