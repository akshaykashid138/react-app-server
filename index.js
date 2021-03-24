const express=require("express")
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const userRouter=require('./routes/userRegistration')


const app=express()
dotenv.config()
app.use(cors())
app.use(express.json())

//connect mongodb
mongoose.connect(process.env.MONGO_URL)
        .then(()=> console.log("connected to mongodb"))
        .catch((error)=> console.log("Somthing went wrong while connecting to mongodb",error))

//Router register
app.use('/users',userRouter)


//
const PORT=process.env.PORT || 4000
app.listen(PORT, ()=> console.log("server started"))