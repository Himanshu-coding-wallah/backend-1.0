import dotenv from "dotenv"
dotenv.config()
import connectDB from "./db/dbConnection.js"
import { app } from "./app.js"


// this function returns a promise because it is an async function
connectDB()
.then(()=>{
    app.on("error", (error)=>{
        console.log("error in express-->", error)
        throw error
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server running on port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("database connection error: ", err)
})

































// approach first, in which everything iswriiten in index file


// ;(async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (error)=>{
//             console.log("error in express while connecting to database", error)
//             throw error
//         })
        
//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })


//     } catch (error) {
//         console.log("error in database connection is: ", error)
//     }
// })()
