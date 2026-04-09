# Production Code Of Backend
- do `npm init` in root folder
- install nodemon `npm install --save-dev nodemon `
- install prettier `npm install -D prettier `
- install mongoose `npm install mongoose`
- install dotenv `npm install dotenv `
- install express `npm install express `
- install cors `npm install cors `
- install bcrypt `npm install bcrypt `
- install aggregatePaginate `npm install mongoose-aggregate-paginate-v2 `
- install multer `npm install multer` 
- install cloudinary `npm install cloudinary` 
- create `.env`
- create `.gitignore`
- create `.prettierrc`
- create `.prettierignore`
- in scripts , 
```js
"dev": "nodemon src/index.js"
```
>NOTE -->   
> - Nodemon restart the server automatically when we save the changes. it is a dev dependencry i.e. it do not go into production  
> - add content in .gitignore from website like gitignore generator  
> - prettier is used to follow the same formatting among the peers
## 1. Folder Setup
in `src`, 
- folders  
    - `controller`  
    - `db`  
    - `middlewares`  
    - `routes`  
    - `utils`  
    - `models`  

- files   
    - `app.js`
    - `index.js`
    - `constants.js`

## Database connection
- Create cluster in mongodb atlas  
- Copy string provided by the mongo and paste that in .env by the varibale MONGODB_URI
`MONGODB_URI=mongodb+srv://Himanshu:Himanshu123@cluster0.fw3kydq.mongodb.net`  
- In constants.js, add the database name and export it  
`export const DB_NAME = "project-Youtube"`   
> NOTE--> database is in other continent, use async await and try catch  
---
```js

// First approach -> we can write database code in index  

import mongoose from "mongoose"
import express from "express"
import { DB_NAME } from "../constants.js"
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error)=>{
            console.log("error in express while connecting to database", error)
            throw error
        })
        
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })


    } catch (error) {
        console.log("error in database connection is: ", error)
    }
})()

```
---
```js
// Second approach -> We can write database code in db folder than import it to index  

// constants.js -- src folder
export const DB_NAME = "project-Youtube"



// dbconnection.js -- db folder

import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"


const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)       
        console.log(`MongoDB connected || DB host: ${connectionInstance.connection.host}`) 
    } catch (error) {
        console.log("error in database connection--> ", error)
        process.exit(1)
        // this process is the process that is currently running in node
    }
}

export default connectDB


// index.js -- src folder
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./db/dbConnection.js"

connectDB()

```
---
## Small step
The database connection function will be called multiple time in different files , so it is better to create a utility to call the code and return response
- `utils` folder
    - `asyncHandler.js` file

```js
// using promises
// this accepts a function 

const asyncHandler = (requestHandler)=>{
    (req, res, next)=>{
        Promise.resolve((requestHandler(req, res, next))).catch((error)=>next(error))
    }
}

export {asyncHandler} 
```
 

```js
// using try catch
// this accepts a function 

// const asyncHandler = (fn)=>(
//     async(err, req, res,next)=>{
//         try {
//             await fn(req, res, next)
//         } catch (error) {
//             res.status(error.code || 500).json({
//                 success: false,
//                 message: err.message
//             })
//         }
//     }
// )

// export {asyncHandler}   
```
## Creating Server
```js
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// setitng up cors
// parse incoming data into json
// parse the url
// use public folder to access static files
// allows cookies and bearer tokens

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


export {app}

```

## Creating custom api errors and response utils
we create these utils to standardize the api errors and api responses messages.  
Now we can create a middleware and when we want to send error message or response message, we can call these utilities
### API Error handling
```js
class apiErrors extends Error{
    constructor(
        statusCode,
        message= "something went wrong",
        errors= [],
        stack= ""
    ){
        super(message)
        this.statusCode= statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {apiErrors}
```
### API Response handling
```js
class apiResponse{
    constructor(statusCode, data, message= "success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode<400
    }
}

export {apiResponse}
```
## Creating Models

mongodb automatically create a unique id when it saves new schemas  
mongodb stores in BSON format 

### 1. User model  
- We will create a pre middleware to hash passwords before saving to database.
- We will create a custom method to compare the passwords, that return true or false
- Than we will create methods to generate tokens 
```js
import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true // it helps in searching
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE"]  // it give choices
    },
    avatar: {
        type: String, // cloudinary string
        required: true
    },
    coverImage: {
        type: String, // cloudinary string
    },

    // watch history will have ids of watched videos
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    password: {
        type: String,
        required: [true, "password is required"]
    },
    refreshToken: {
        type: String
    }
},{timestamps: true})

// hook
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
    {
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
    {
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User", userSchema)
 

```
### 2. Video Model
- Paginate will help us to write aggregation pipeline
```js
import mongoose, {Schema} from "mongoose";
import aggregatePaginate  from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema({
    videoFile: {
        type: String, // cloudinary string
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number, // cloudinary 
        required: true,
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

videoSchema.plugin(aggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)
```

## Setting up Multer and Cloudinary files
- Multer stores files on server and returns a path
- cloudinary is used to store the files on the cloud  
- Then the files from the server are deleted  
### Multer
```js
// the file parameter have access to file uploaded in the form, express dont have this access
// original name is not a good practice because user might upload multiple files of same name
// this function return the path of uploaded file

import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage,})
```

### Cloudinary 
```js
// Files are already on the server, we will upload them to cloud

import { v2 as cloudinary } from 'cloudinary'
import fs from "node:fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath)return "file not uploaded";
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file is uploaded successfully", response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }   
}

export {uploadOnCloudinary}
```