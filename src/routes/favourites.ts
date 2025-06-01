import {Router} from 'express'
import { AuthRequest, protectMiddleware } from '../middleware/auth';
import { User } from '../models/User';
import { Property } from '../models/Property';
import mongoose from 'mongoose';
import { redisClient } from '../config/redis';


const router = Router();

router.get('/read-fav',protectMiddleware,async(req : AuthRequest,res)=>{
    const cacheKey = `user${req.user.id}:favourites`;

    // Check cache
    const cached = await redisClient.get(cacheKey);

    // Cache HIT
    if (cached) {
        res.json(JSON.parse(cached));
        return;
    }

    // Cache MISS : 1. Check DB  ---> Set in redis Cache
    const allFav = await User.find({ _id: req.user.id }).populate('favourites');
    await redisClient.set(cacheKey, JSON.stringify(allFav), { EX: 3600 })
    res.json(allFav.length > 0 ? allFav[0].favourites : []);
})

router.post('/post-fav/:id',protectMiddleware, async(req: AuthRequest, res)=>{
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

  const user = await User.findById(req.user?.id);
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

router.delete('/delete-fav',protectMiddleware,async(req:AuthRequest, res)=>{
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
  await redisClient.del(`user:${req.user.id}:favorites`);
  res.json({ favourites: user.favourites });
})

export default router;