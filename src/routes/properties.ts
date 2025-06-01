import { Router, Response, Request } from "express";
import { Property } from "../models/Property";
import { protectMiddleware } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth";
import { redisClient } from "../config/redis";

const router = Router();

// 1. Create new property
router.post("/add-prop",protectMiddleware,async (req: AuthRequest, res: Response) => {
    const property = new Property({ ...req.body, createdBy: req.user.id });
    await property.save();
    res.status(200).json("Property Added Successfully");
  }
);

// 2. Read new property
router.get("/read-prop", async (req, res) => {
    // Advance filtering
  const query: any = {}; // using any as a filter like price can be a number or a string "price["gte"]"

  const queryStr = JSON.stringify(req.query);
  const cacheKey = `props:${queryStr}`;

  const cached = await redisClient.get(cacheKey);
  if (cached){
    res.json(JSON.parse(cached));
    return;
  }
  // Simple string matching filter
  if (req.query.type) query.type = req.query.type;
  if (req.query.state) query.state = req.query.state;
  if (req.query.city) query.city = req.query.city;
  if (req.query.listedBy) query.listedBy = req.query.listedBy;
  if (req.query.colorTheme) query.colorTheme = req.query.colorTheme;
  if (req.query.listingType) query.listingType = req.query.listingType;
  if (req.query.isVerified) query.isVerified = req.query.isVerified;
  if (req.query.furnished) query.furnished = req.query.furnished;

  // Range based filter : price[lte] / price[gte]
  if (req.query["price[gte]"])
    query.price = { ...query.price, $gte: Number(req.query["price[gte]"]) };
  if (req.query["areaSqFt[gte]"])
    query.areaSqFt = {
      ...query.areaSqFt,
      $gte: Number(req.query["areaSqFt[gte]"]),
    };
  if (req.query["rating[gte]"])
    query.rating = { ...query.rating, $gte: Number(req.query["rating[gte]"]) };
  if (req.query["bedrooms[gte]"])
    query.bedrooms = {
      ...query.bedrooms,
      $gte: Number(req.query["bedrooms[gte]"]),
    };
  if (req.query["bathrooms[gte]"])
    query.bathrooms = {
      ...query.bathrooms,
      $gte: Number(req.query["bathrooms[gte]"]),
    };

  if (req.query.availableFrom)
    query.availableFrom = { $gte: new Date(req.query.availableFrom as string) };

  if (req.query["areaSqFt[lte]"])
    query.areaSqFt = {
      ...query.areaSqFt,
      $lte: Number(req.query["areaSqFt[lte]"]),
    };
  if (req.query["rating[lte]"])
    query.rating = { ...query.rating, $lte: Number(req.query["rating[lte]"]) };
  if (req.query["bedrooms[lte]"])
    query.bedrooms = {
      ...query.bedrooms,
      $lte: Number(req.query["bedrooms[lte]"]),
    };
  if (req.query["bathrooms[lte]"])
    query.bathrooms = {
      ...query.bathrooms,
      $lte: Number(req.query["bathrooms[lte]"]),
    };

  if (req.query.availableFrom)
    query.availableFrom = { $lte: new Date(req.query.availableFrom as string) };

  // Array match
  if (req.query.tags)
    query.tags = { $in: (req.query.tags as string).split(",") };
  if (req.query.amenities)
    query.amenities = { $in: (req.query.amenities as string).split(",") };

  try {
    const allProperties = await Property.find(query);
    await redisClient.set(cacheKey, JSON.stringify(allProperties), { EX: 3600 });
    res.json(allProperties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching properties", error: err });
  }
});

// 3. Update old property
/*
    req.user --> 
    {
        id: "64f7d13a12bc0c001f123abc",
        name: "John Doe",
        iat: 1716880000,
        exp: 1716883600
    }

*/
router.put("/update-prop/:id",protectMiddleware,async (req: AuthRequest, res) => {
    // Find by property ID which is unique
    const propToUpdate = await Property.findById(req.params.id);
    // case-1: property not found
    if (!propToUpdate) {
      res.status(401).json("Property not found");
      return;
    }
    // case-2: property found but user not createdBy
    if (propToUpdate.createdBy?.toString() !== req.user.id) {
      res.status(403).json("Unauthorised to update");
      return;
    }

    // case-3: property found and updated
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(`Updated : ${propToUpdate._id}`);
  }
);

router.delete("/delete-prop/:id",protectMiddleware,async (req: AuthRequest, res) => {
    // Find Prop to delete
    const propetyToDelete = await Property.findById(req.params.id);

    // case-1: property not present
    if (!propetyToDelete) {
      res.status(401).json("Property not found");
      return;
    }

    // case-2: property not allowed to delete
    if (propetyToDelete.createdBy?.toString() !== req.user.id) {
      res.status(401).json("Unauthorised to delete");
      return;
    }

    // case-3: property deleted
    const deleted = await Property.findByIdAndDelete(req.params.id);
    res.json(`Deleted : ${propetyToDelete._id}`);
  }
);

export default router;
