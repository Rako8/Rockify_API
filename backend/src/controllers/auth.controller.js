import{User} from "../models/user.model.js";

export const authCallback = async(req,res, next)=>{
    try{
     const{ id, firstName, lastName, imageUrl} = req.body;

     // to check if the user is already logged in 
     const user = await User.findOne({clerkId: id});

     if(!user){
        //sign up 
        await User.create({
            clerkId: id,
            fullName: `${firstName} ${lastName}`,
            imageUrl
        })
     }   
     res.status(200).json({success: true})
    } catch(error){
         console.log("Error in auth callback", error);
         next(error);
    }
}