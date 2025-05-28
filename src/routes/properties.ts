import { Router, Response, Request } from "express";
import { Property } from "../models/Property";
import { protectMiddleware } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth";

// Extends properties of default "Request" from express [req.body] [req.params] etc.


const router = Router();

// 1. Create new property
router.post("/add-prop", protectMiddleware, async (req: AuthRequest, res: Response) => {
  const property = new Property({ ...req.body, createdBy: req.user.id });
  await property.save();
  res.status(200).json("Property Added Successfully");
});

// 2. Read new property
router.get('/read-prop',async(req,res)=>{
    const allProperties = await Property.find();
    res.json(allProperties);
})

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
router.put('/update-prop/:id',protectMiddleware,async(req:AuthRequest,res)=>{
    // Find by property ID which is unique
    const propToUpdate = await Property.findById(req.params.id);
    // case-1: property not found
    if(!propToUpdate){
        res.status(401).json("Property not found");
        return;
    }
    // case-2: property found but user not createdBy
    if(propToUpdate.createdBy?.toString() !== req.user.id){
        res.status(403).json("Unauthorised to update");
        return;
    }

    // case-3: property found and updated
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json(`Updated : ${propToUpdate._id}`);
})


router.delete("/delete-prop/:id", protectMiddleware, async(req: AuthRequest, res)=>{
    // Find Prop to delete
    const propetyToDelete = await Property.findById(req.params.id);

    // case-1: property not present
    if(!propetyToDelete){
        res.status(401).json("Property not found");
        return;
    }

    // case-2: property not allowed to delete
    if(propetyToDelete.createdBy?.toString() !== req.user.id){
        res.status(401).json("Unauthorised to delete");
        return;
    }

    // case-3: property deleted
    const deleted = await Property.findByIdAndDelete(req.params.id);
    res.json(`Deleted : ${propetyToDelete._id}`);
})

export default router;
