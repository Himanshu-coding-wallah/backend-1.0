import dotenv from "dotenv"
dotenv.config()
import connectDB from "./db/dbConnection.js"

connectDB()

































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
