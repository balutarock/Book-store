const express = require('express')
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const app = express();

const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/mongo-react")

const User=require("./models/user.model")
const Books=require("./models/books.model")

app.use(express.json())

const initializeDbAndServer = async () => {
    try {
        app.listen(3007, () =>
            console.log("Server Running at http://localhost:3007/")
            
        );
    } catch (error) {
        console.log(`DB Error: ${error}`);
        process.exit(1);
    }
};

initializeDbAndServer();

app.post("/signup/", async (request,response)=>{
    const {name,email,password}=request.body
    const hashedPassword=await bcrypt.hash(password, 10);
    const dbUser=await User.findOne({name:name})
    if(dbUser!==null){
        response.status(400)
        response.send({status:400,errror:"User name exist"});
    }else{
        const user=await User.create({
            name:name,
            email:email,
            password:hashedPassword
        })
        response.send({status:200,msg:"Registraction success"})
    }
})

app.post("/login/", async (request,response)=>{
    const {name,password}=request.body
    const dbUser=await User.findOne({name:name})
    const isPasswordMatched=await bcrypt.compare(password, dbUser.password);
    // console.log("dbuser >> ",dbUser)
    // console.log("ispa >> ",isPasswordMatched)
    if(dbUser===null){
        response.status(400)
        response.send({status:400,errror:"User name is not exist"});
    }else{
        if(isPasswordMatched){
            const payload={username:name}
            const jwtToken=jwt.sign(payload,"MY_SECREAT_TOKEN")
            response.status(200)
            response.send({status:200,msg:"Login success",jwtToken:jwtToken})
        }else{
            response.status(401)
            response.send({status:200,msg:"Invalid Password"})
        }
    }
})

const authonticateToken=(request,response,next)=>{
    let jwtToken;
    const authHeader=request.headers["authorization"]
    if(authHeader!==undefined){
        jwtToken=authHeader.split(" ")[1]
    }
    if(jwtToken===undefined){
        response.send(401)
        response.send("Unauthorized, Empty accesstoken");
    }else{
        jwt.verify(jwtToken,"MY_SECREAT_TOKEN",async(err,payload)=>{
            if(err){
                response.status(401)
                response.send("Invalid Access Token")
            }else{
                // console.log("user>> ",payload)
                request.username=payload.username
                next()
            }
        })
    }
}

app.get("/home/",authonticateToken ,async(request,response)=>{
    const booksData=await Books.find()
    // console.log("books >> ",booksData)
    response.status(200)
    response.send(JSON.stringify({...booksData}))
})

app.get("/profile/",authonticateToken,async(request,response)=>{
    // console.log(request)
    // console.log("username",request.username)
    const dbUser=await User.findOne({name:request.username})
    // console.log("dbUser >> ",dbUser)
    response.status(200)
    response.send(JSON.stringify({...dbUser}))
})