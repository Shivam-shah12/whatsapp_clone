import getPrismaInstance from "../utils/PrismaClient.js";
import {generateToken04} from '../utils/TokenGenerator.js';

export const checkUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        // console.log(req.body)
         // Correctly extract the email from req.body
        // Check if the email is present or not
        if (!email) {
            return res.json({
                success: false,
                message: "Email is required"
            });
        }
        const prisma = getPrismaInstance(); // Make sure getPrismaInstance is correctly implemented
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.json({  message: 'User not found' ,status:false});
        } else {
            return res.json({ status:true, message: "User Found successfully", data: user });
        }
    } catch (error) {
        next(error);
    }
}


export const onBoardUser = async (req, res, next) => {
    try {
        const { email, name, about, image: profilePicture } = req.body;
        if (!email || !name || !profilePicture) {
            return res.json({ msg: "Email, Name, and Image are required", status: false });
        }

        const prisma = getPrismaInstance();

        // Check if a user with the provided email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.json({ msg: "User with this email already exists", status: false });
        }

        // If the user doesn't exist, create a new one
        const user = await prisma.user.create({
            data: { email, name, about, profilePicture }
        });

        return res.json({ msg: "User created successfully", status: true, user });
    } catch (error) {
        console.log(error);
        return res.json({ msg: "Failed to create user", status: false });
    }
};


export const getAllUser=async(req,res,next)=>{
    try {
       const prisma=getPrismaInstance();
       const users=await prisma.user.findMany({
         orderBy:{name:"asc"},
         select:{
            id:true,
            email:true,
            name:true,
            profilePicture:true,
            about:true
         }
       }) 
       const usersGroupedByInitialLetter={}
       users.forEach((user)=>{
        const initialLetter=user.name.charAt(0).toUpperCase();
         if(!usersGroupedByInitialLetter[initialLetter])
         {
            usersGroupedByInitialLetter[initialLetter]=[]
         }
         usersGroupedByInitialLetter[initialLetter].push(user)
       })
       return res.json({msg:"all user get successfully",data:{users}})
    } catch (error) {
        next(error)
    }
}


export const generateToken=(req,res,next)=>{
    try {
        const appId=parseInt(process.env.ZEGO_APP_ID);
        const serverId=process.env.ZEGO_SERVER_SECRET_ID;
        const userId=req.params.userId;
        const effectiveTime=3600;
        const payload="";
        // console.log("appId = "+appId+" serverId = "+serverId + " userId = "+userId);
        if(appId && serverId && userId)
        {
            const token=generateToken04(appId,userId,serverId,effectiveTime,payload);
            // console.log(token)
            return res.status(200).json({token});
        }
        return res.status(400).send("User id,app id and server secret is required");
    } catch (error) {
        console.log(error);
    }
}
