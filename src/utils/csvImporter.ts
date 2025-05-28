import fs from "fs";
import csv from "csv-parser";
import { Property } from "../models/Property";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL!).then(() => {
  const results: any[] = [];

  fs.createReadStream("properties.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      await Property.insertMany(results);
      console.log("Imported");
      process.exit();
    });
});
