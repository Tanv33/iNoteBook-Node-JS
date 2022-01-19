import jwt from "jsonwebtoken";

const jwtSECRET = "tanv3r";

const fetchuser = (req, res, next) => {
  try {
    const token = req.header("auth-header");
    if (!token) {
      return res.status(400).send("Token Required");
    }
    const string = jwt.verify(token, jwtSECRET);
    req.user = string.user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send("Invalid Token");
  }
};

export default fetchuser;
