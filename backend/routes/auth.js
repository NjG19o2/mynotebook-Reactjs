const express= require('express');//install
const router = express.Router();
const User =require('../models/User');
const { body, validationResult } = require('express-validator');//install
const bcrypt = require('bcryptjs'); //install
var jwt = require('jsonwebtoken'); //install
var fetchuser= require('../middleware/fetchuser');

const JWT_SECRET = 'Njgisagoodb$oy';


//Route1: Create a user using: POST "/api/auth/createUser" . Doesn't require login
router.post('/createUser',[
    body('name','Enter a valid name').isLength({ min: 3}),
    body('email','Enter a valid email').isEmail(),
    body('password','password must be at least 5 characters').isLength({ min: 5}),
],async(req,res)=>{ //req=request,res=response
// if there are errors then return bad request and errors
let success= false;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(404).json({success, errors: errors.array()});
        }
//check wheather the user with this email exists already
try {
          let user  =await User.findOne({email:req.body.email});
       if(user){
        return res.status(404).json({success,error:"sorry a user with this email already exists"})
       }
       const salt= await bcrypt.genSalt(10);
       const secPass=await bcrypt.hash(req.body.password,salt);
       //create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
          });
          const data ={
            user:{
                id:user.id  
            }
          }
          const authToken= jwt.sign(data, JWT_SECRET);
        //   res.json(user)
        success=true;
          res.json({success,authToken})
        } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
    }
})
//Route2: Authenticate a user using: POST "/api/auth/login" . Doesn't require login
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','password can not be blank').exists(),
],async(req,res)=>{
    let success= false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({errors: errors.array()});
    }
    const {email,password}=req.body;
    const user =await User.findOne({email});
    try {
        if(!user){
            return res.status(404).json({error:"Please try to login with correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success=false
            return res.status(404).json({success,error:"Please try to login with correct credentials"});
        }
        const data ={
            user:{
                id:user.id  
            }
          }
          const authToken= jwt.sign(data, JWT_SECRET);
          success=true;
          res.json({success,authToken})

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
        }
   
})
//Route3:Get loggedin user Details using: POST "/api/auth/getuser" .login required
router.post('/getuser',fetchuser,async(req,res)=>{ 
    try {
        userId=req.user.id;
        const user=await User.findById(userId).select("-password")
        res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
        }
    })
module.exports=router