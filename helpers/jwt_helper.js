const JWT = require('jsonwebtoken')
const createError = require('http-errors')




module.exports = {
    signAccessToken : (userid)=>{
        return new Promise((resolve,reject)=>{
            const payload = {
                
            }
            const secret = "super secret"
            const options = {
                expiresIn : "1h",
                issuer : "xyz.com",
                audience:userid
            }
            JWT.sign(payload,secret,options,(err,token)=>{
                if(err) reject(err)
                resolve(token)
            })
        })
    }
}