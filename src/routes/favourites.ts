import {Router} from 'express'
import { AuthRequest, protectMiddleware } from '../middleware/auth';
import { User } from '../models/User';
import { Property } from '../models/Property';
import mongoose from 'mongoose';


const router = Router();

router.get('/read-fav',protectMiddleware,async(req : AuthRequest,res)=>{
    const allFav = await User.find({ _id: req.user.id }).populate('favourites');
    res.json(allFav.length > 0 ? allFav[0].favourites : []);
})

router.post('/post-fav/:id', async(req: AuthRequest, res)=>{
    const propId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(propId)){
    res.status(400).json({ message: "Invalid Property ID" });
    return;
  }

  const property = await Property.findById(propId);
  if (!property){
    res.status(404).json({ message: "Property not found" });
    return;
  }

  const user = await User.findById(req.user.id);
  if (!user){
    res.sendStatus(404);
    return;
  }

  if (!user.favourites.includes(propId as any)) {
    user.favourites.push(propId as any);
    await user.save();
  }

  res.json({ favourites: user.favourites });
})

router.delete('/delete-fav',async(req:AuthRequest, res)=>{
    const propId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(propId)){
    res.status(400).json({ message: "Invalid Property ID" });
    return;
  }

  const user = await User.findById(req.user.id);
  if (!user){
    res.sendStatus(404);
    return;
  }

  user.favourites = user.favourites.filter((id) => id.toString() !== propId);
  await user.save();

  res.json({ favourites: user.favourites });
})