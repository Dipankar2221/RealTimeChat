import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signup=async(req,res)=>{
    const {fullName,email,password} = req.body;

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All field are required"});
        }
        //hash password
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 character"});
        }

        const user = await User.findOne({email})

        if(user) return res.status(400).json({message:"Email already exists"});

        const salt = await bcrypt.genSalt(10)
        const hashedPAssword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName:fullName,
            email:email,
            password:hashedPAssword
        })

        if(newUser){
            // generate jwt token here
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                avatar:newUser.avatar
            })

        }else{
            res.status(400).json({message:"Invalid user data"})
        }

    } catch (error) {
        console.log("Error in signup",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}



export const login=async (req,res)=>{
    const {email,password} = req.body
    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"Invalid credintial"})
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credintaial"});
        }

        generateToken(user._id,res)

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            avatar:user.avatar,
        });

    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Inter server Error"});
    }
}

export const logout=(req,res)=>{

    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logout successfully"});

    } catch (error){
        console.log("Error in logged out controller",error.message);
        res.status(500).json({message:"Internal server Error"})        
    }
}

export const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;
    let avatarUrl;

    if (req.file) {
      const base64 = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataURI);
      avatarUrl = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, ...(avatarUrl && { avatar: avatarUrl }) },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkAuth =async (req,res)=>{
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message:"Internal server error"});
        
    }
}
