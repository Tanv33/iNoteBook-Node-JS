import mongoose from "mongoose";

const mongoURI =
  "mongodb://localhost:27017/iNotebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connect To Mongoose Successfully");
  });
};

export default connectToMongo;
