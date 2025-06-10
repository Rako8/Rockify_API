import { clerkClient} from "@clerk/express";

// this function is to check if the user is authenticated or not! 
export const protectRoute =  async(req, res, next ) => {
        if(!req.auth.userId){
            return res.status(401).json({message: "Unauthorized - you must be logged in! "});
        } 
        next(); // to continue the cycle
}

export const requiredAdmin = async(req, res, next) => {
    try {
        const currentUser = await clerkClient.users.getUser(req.auth.userId);
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

        if(!isAdmin){
            return res.status(403).json({message: "Unauthorized- you must be an admin!" });

        } next(); // if they are the admin , call the next function to be performed !
    } catch (error) {
        next(error);
    }
}