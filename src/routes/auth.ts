import { Router }  from "express";
import bcrypt from "bcrypt";
import jwtToken from "jsonwebtoken"
import {User} from '../models/User'
import { Request, Response } from "express";


const router = Router();

// router.get/post/put/delete("/route",handlerfunction)
router.post('/register',async(req,res)=>{
    const {email, password} = req.body;
    const passwordHash = await bcrypt.hash(password,10);
    const newUser = new User({email,passwordHash});
    await newUser.save();
    res.status(201).json({ message: "User registered" });
})

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ message: "Invalid credentials" });
  }
  // Creating the token using "jwt library"
  // [  jwt.sign(payload, secretOrPrivateKey, [options, callback])  ]
  const token = jwtToken.sign({ id: user?._id }, process.env.JWT_SECRET!, { expiresIn: "10h",});
  res.json({ token });
});


export default router;