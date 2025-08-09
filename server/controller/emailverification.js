const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport(
    {
        
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth : {
            user : process.env.emailid,
            pass : process.env.passcode
        }
    }
);

exports.sendemail = async (req,res)=>{
    // receive email id in request 
    console.log("hi inside sendemail");
    const {email} = req.body;
    console.log("received email : ",email);
    if(!email){
        return res.status(404).json({message : "email id is required for verification "});
    }
    console.log("2");
    // generate the six digit code 
    const code = Math.floor(100000 + Math.random() * 900000 ).toString();
    
    console.log("3");
    try{
        console.log("inside try");
        await transport.sendMail(
            {
                from : process.env.emailid,
                to : email,
                subject : "Email Verification ",
                text : `email code is ${code}`
            }
        );
        console.log("4");

        req.session.verification = {
            email,
            code,
            createdAt: Date.now() // Store current time in ms
          };
        // req.session.verification = {email,code};
        res.json({message : "email sent successfully "});

    }
    catch(err){
        res.status(500).json({message: "error in sending the code "});
    }


}

exports.verifyemail = async (req,res)=>{
    const {email,code} = req.body;

    if(!email){
        return res.status(404).json({message : "invalide email from the frontend"});
    }

    // take the code saved in the session in backend 
    const datainsession = req.session.verification;
    console.log("System code is : ",datainsession.code);
    console.log("receive code is : ",code);
    console.log("received email : ",email);

    const currentTime = Date.now();
    if (currentTime - datainsession.createdAt > 60000) {
        req.session.verification = null; // Clear expired data
        return res.status(400).json({ message: 'Code expired. Please request a new one.' });
    }
    
    if(!datainsession){
        return res.status(400).json({ message: "No verification data in session" });
    }

    if(datainsession.email !== email){
        return res.status(400).json({ message: "Email mismatch" });
    }

    if(datainsession.code !== code){
        return res.json({message : "code is wrong "});
    }

    req.session.verification = null;
    res.json({message:"successfully verified",emailid : email});
}