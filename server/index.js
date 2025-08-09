const express = require("express");
const app = express();
const session = require("express-session");


const emailverification = require("./routes/emailverificationroutes");

app.use(express.json());
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(
    session({
        secret : "Britto123",
        resave : false,
        saveUninitialized : true,
        cookie : {maxAge : 10*60*1000}
    })
);




app.use("/email",emailverification);

app.listen(8000,()=>{
    console.log(`server is running in port no 8000`);
})