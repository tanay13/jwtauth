const express = require("express")
const router = express.Router()
const joi = require("@hapi/joi")
const createError = require('http-errors')
const User = require('../models/user.model')
const {authSchema}= require('../helpers/validationSchema') 
const {signAccessToken} = require('../helpers/jwt_helper')

router.post("/register",async(req,res,next)=>{
    try{
        const result = await authSchema.validateAsync(req.body)
        
        const doesExist = await User.findOne({email:result.email})
        if(doesExist)
        throw createError.Conflict(`${result.email} is already register`)
        
        const user = new User(result)
        const savedUser = await user.save()
        const accessToken = await signAccessToken(savedUser.id)
        res.send(accessToken)


    }catch(error)
    {
        if(error.isJoi === true) error.status = 422;
        next(error)
    }
})

router.post("/login",async(req,res,next)=>{
    try{
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({email:result.email})

        if(!user) throw createError.NotFound("User not registered")
        const isMatch = await user.isValidPassword(result.password)
        if(!isMatch)
        throw createError.Unauthorized("Username/password not valid")

        const accessToken = await signAccessToken(user.id)
        res.send({accessToken})

    }catch(error)
    {
        if(error.isJoi === true) 
        {
            return next(createError.BadRequest("Invalid username/password"))
        }  
        next(error)
    }
})

router.delete("/logout",async(req,res,next)=>{
    res.send("logout route")
})





module.exports = router