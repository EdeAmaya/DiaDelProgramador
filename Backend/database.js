import mongoose from "mongoose";
import {config} from "./src/config.js"


mongoose.connect(config.db.URI);


const connection = mongoose.connection;

connection.once("open", () =>{
    console.log("DB is conected");
});

connection.on("disconected", () => {
    console.log("DB is disconected");
});

connection.on("error", (error) => {
    console.log("error found" + error);
});