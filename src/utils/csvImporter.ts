import fs from "fs";
import csv from "csv-parser";
import { Property } from "../models/Property";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL!).then(() => {
  const results: any[] = [];

  fs.createReadStream("properties.csv").pipe(csv()).on("data", (data) => {
      // Convert string fields to correct types
      const cleaned = {
        ...data,
        furnished: data.furnished.toLowerCase() === "furnished" || data.furnished.toLowerCase() === "true",
        isVerified: data.isVerified.toLowerCase() === "true",
        price: parseFloat(data.price),
        areaSqFt: parseInt(data.areaSqFt),
        rating: parseFloat(data.rating),
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        availableFrom: new Date(data.availableFrom),
        amenities: data.amenities?.split(',').map((a: string) => a.trim()) || [],
        tags: data.tags?.split(',').map((t: string) => t.trim()) || [],
      };

      results.push(cleaned);
    }).on("end", async () => {
      try {
        await Property.insertMany(results);
        console.log("Imported successfully");
      } catch (err) {
        console.error("Insert error:", err);
      } finally {
        process.exit();
      }
    });
});
