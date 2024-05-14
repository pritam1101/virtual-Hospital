
const mongoose = require("mongoose");
const initData = require("./doctordata.js");
const Listing = require("../models/listing.js");
const Listing = require("../models/usersearch.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/sihvirtualhospital";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  // await Listing.deleteMany({});
initData.data = initData.data.map((obj) =>({...obj, owner: "660b9f3b9e41ec813af37194", 
  mobile_no: 8226812148,
}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();