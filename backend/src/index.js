import dotenv from "dotenv";
import connectDB from "./config/db.js";
import {app} from "./app.js"

dotenv.config({
    path: "./.env",
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT|| 8000,()=>{
        console.log(`Your Server is Running on port:${process.env.PORT}`);
    });
})
.catch((err)=>{
console.log("Mongo db Connection failed !!!",err)
});
