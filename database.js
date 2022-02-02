import mongoose from "mongoose";

// "mongodb://localhost:27017/iNotebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const mongoURI =
  "mongodb+srv://harry:harry@cluster0.dnw0h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connect To Mongoose Successfully");
  });
};

export default connectToMongo;
