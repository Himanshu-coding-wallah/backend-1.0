import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { apiErrors } from "../utils/apiErrors.js";

// first we will verfiy the user, we already sent the cookies so we will check if the tokens are same in database and on user, if same that means that the user is truly loggin

// in this middleware what we are trying to do is that we will add a new key "user" to the req object. this user will have the id of the user we are working on. so it solves the problem we were facing in the logout feature
// in logout we can only have the access to the fields that the user is sending like, usernma , password
// but we want accesss of the user id to logout the user
// since user is already loggedin so we have the accesss of cookies

// we use this middleware in routes

export const verifyJWT = asyncHandler(async (req, res, next)=>{
    try {
        // req have cookies access because we have used, app.use(cookieParser())
        // accessing token
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new apiErrors(401, "Unauthorized request")
        }
    
        // verifying if same token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        // we use select to deselect the items
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new apiErrors(401, "invalid access token")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new apiErrors(401, error?.message || "invalid access token")
    }

})

