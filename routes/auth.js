import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetchuser from "../middleware/fetchuser.js";

const router = express.Router();
const jwtSECRET = "tanv3r";

// Route 1:  Creating a new User with POST request on "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password length should be 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // checking body data comming from user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    try {
      // finding a user exist or not
      let user = await User.findOne({ email: req.body.email });
      // if exist return bad request with res
      if (user) {
        return res
          .status(400)
          .send("Sorry a user with this email already exist");
      }
      // otherwise create a new user and send created object
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, jwtSECRET);
      // console.log(authToken);
      res.send({ authToken });
      // res.send(user);
    } catch (error) {
      res.status(500).send("Some Error occured");
    }
  }
);

// Route 2: Authenticating User with POST request on "/api/auth/login".
router.post(
  "/login",
  [
    body("email", "Please! Enter a valid email").isEmail(),
    body("password", "Password should not be blank").exists(),
  ],
  async (req, res) => {
    // checking body data comming from user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      // Firstly authenticating user with email
      let user = await User.findOne({ email });
      // if not exist return bad request with res
      if (!user) {
        return res.status(400).send("Please Login with correct credentials");
      }
      // otherwise move to next step: check password
      const checkPass = await bcrypt.compare(password, user.password);
      if (!checkPass) {
        return res.status(400).send("Please Login with correct credentials");
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, jwtSECRET);
      // console.log(authToken);
      // console.log(user);
      res.send({ authToken });
      // res.send(user);
    } catch (error) {
      res.status(500).send("Some Error occured");
    }
  }
);

// Route 3: Authenticating User with POST request on "/api/auth/getuser".
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).send("User Not Found");
    }
    res.send(user);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send("Error in getting user");
  }
});

export default router;
