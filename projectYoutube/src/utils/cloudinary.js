// server pe file aa chuki h , hume abb cloudinary pe upload krna h and then server se delete krna h. This is the functionality

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
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file is uploaded successfully", response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)// remove files from server if not uploaded
        return null
    }   
}

export {uploadOnCloudinary}