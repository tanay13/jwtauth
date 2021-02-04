const express = require("express")
const morgan = require("morgan")
const createError = require("http-errors")
require("dotenv").config()

require("./helpers/init_mongodb")

const AuthRoute = require("./routes/auth.route")

const app = express()
app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/auth',AuthRoute)

app.get("/",async(req,res,next)=>{
    res.send("Hello")
})

app.use(async(req,res,next)=>{
    //  const error = new Error("NOT FOUND")
    //  error.status = 404
    //  next(error)
    next(createError.NotFound())
})

app.use((err,req,res,next)=>{

    res.status(err.status || 500)
    res.send({
        error:{
            status:err.status||500,
            messgae:err.message,
        }
    })

})


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("server is running: "+"PORT "+PORT);
})