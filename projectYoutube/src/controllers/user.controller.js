import { asyncHandler } from "../utils/asyncHandler.js";
import {apiErrors} from "../utils/apiErrors.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { create } from "node:domain";
import {apiResponse} from "../utils/apiResponse.js"
import { devNull } from "node:os";
import jwt from "jsonwebtoken"
import { trusted } from "mongoose";

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken =user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // assigning the generated refresh token to the user instance
        user.refreshToken = refreshToken

        // now we save, but if we save normally then everything will be saved so password will be validated, so to avoid this we use validateBeforeSave: false
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new apiErrors(500, "something went wrong while generating access and refresh token")
    }
}

const registerUser =  asyncHandler(async(req, res)=>{
    // res.status(200).json({
    //     message: "working fine"
    // })

    // get user details
    // validation -- not empty
    // check if user already exists -- using username and email
    // check if user sends files -- avatar 
    // upload them to cloudinary , avatar
    // create user object --create entry in db
    // remove password and refesh token field from response
    // check for user creation
    // return response  

    //getting user details
    const {fullName, email, userName, password} = req.body
    console.log(email)

    console.log(req.body)

    // validation
    if(
        [fullName, email, userName, password].some((field)=>(field?.trim() === ""))
    ){
        throw new apiErrors(400, "all fields are required")
    }

    // checking if user already exists by using email
    const existedUser = await User.findOne({
        $or: [{email}, {userName}]
    })
    if(existedUser){
        throw new apiErrors(409, "user already exists")
    }

    // checking for images
    const avatarLocalPath = req.files?.avatar?.[0]?.path 
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path
    console.log(req.files)

    if(!avatarLocalPath){
        throw new apiErrors(400, "avatar file is required")
    }

    // upload to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiErrors(400, "avatar file is required")
    }

    // create user 
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if(!createdUser){
        throw new apiErrors(500, "something went wrong when registering user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "user registered successfully")
    )


})

const loginUser = asyncHandler(async(req, res)=>{
    // req.body => data
    // username or email validationn
    // find the user
    // access and refresh token
    // send cookies

    const {email, userName, password} = req.body
    
    // username ya email , kisi se bhi login ho jayega
    if(!(userName || !email)){
        throw new apiErrors(400, "username or password is required")
    }

    //ya to username , ya to email dhund do
    // this is the user we are extracting from the database so it will have acess to all the methods that we have defined by userSchema.methods 
    // while the User is the model and it will have the methods like find , findone
    const user = await User.findOne({
        $or: [{userName}, {email}]
    })

    if(!user){
        throw new apiErrors(404, "user not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiErrors(401, "password is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)


    // this step ,we extracted user from database in line 112 and generated the tokens in 136, so it might be possible that the user may not have the tokens 
    // so we again find the user by the id and then sends the data back to user , remove password and refreshtoken
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // setting up cookies
    // this is a security step
    const options = {
        httpOnly: true, // cookies cannot be accessed in browser
        secure: true // will only be sent over https, not on http
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "user loggedin successfully"
        )
    )





})

const logOut = asyncHandler(async(req, res)=>{
    // now we need user id to log the user out, but we dont have the accesss to the id, because the req object sends data like usermane, password,
    // we solve this issue by middleware -> auth.middleware
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "user logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiErrors(401, "unauthorized request")
    }

   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
 
     const user = await User.findById(decodedToken?._id)
 
     if(!user){
         throw new apiErrors(401, "invalid refresh token")
     }
 
     if(incomingRefreshToken !== user?.refreshToken){
         throw new apiErrors(401, "refresh token is expired or used")
     }
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
     const {accessToken, newrefreshToken} = await generateAccessAndRefreshToken(user._id)
 
     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newrefreshToken, options)
     .json(
         new apiResponse(
             200,
             {accessToken, refreshToken: newrefreshToken},
             "access token refreshed"
 
         )
     )
   } catch (error) {
        throw new apiErrors(401, error?.message || "invalid access token")
   }
})
export {registerUser, loginUser, logOut, refreshAccessToken }