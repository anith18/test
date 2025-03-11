const express=require('express');
const router=express.Router();
const User=require('../modules/User');
const {body,validationResult}= require('express-validator');
const bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser'); // Import middleware
const jwt_SECRET="Iamgoodboy";
//ROUTER:1 for creating user using "/api/auth/createuser"
router.post('/createuser',[
    body('name','enter a valid name').isLength({min:3}),
    body('email','enter a valid email').isEmail(),
    body('password','enter a valid password').isLength({min:5})
],async  (req,res)=>{
    let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors:errors.array()});
    }
    try{
    let user=await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({success,error:"sorry already exists"})
    }
    const salt=await bcrypt.genSalt(10);
    const secpass=await bcrypt.hash(req.body.password,salt);
    user=await User.create({
        name:req.body.name,
        password:secpass,
        email:req.body.email,
    });
    const data={
        user:{
            id:user.id,
        }
    }
    const authtoken=jwt.sign(data,jwt_SECRET);

    success=true; 
    res.json({success,authtoken});
}
catch(error){
    console.error(error.message);
    res.status(500).send("internal sever error");
}
})

//ROUTER:2 for login  user  using "/api/auth/login"
router.post('/login',[
    body('email','enter a valid email').isEmail(),
    body('password','password cannot be empty').exists(),
],async  (req,res)=>{
    let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(!user){
            success=false;
            return res.status(400).json({success,error:"please try to login with correct credentials"});
        }
        const passwordcompare=await bcrypt.compare(password,user.password);
        if(!passwordcompare){
            success=false;
            return res.status(400).json({success,error:"please try to login with correct credentials"});
        }
        const data={
            user:{
                id:user.id,
            }
        }
        const authtoken=jwt.sign(data,jwt_SECRET);
        success=true;
        res.json({success,authtoken});

    }
    catch(error){
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})

//ROUTER:3 getting loged in details using "/api/auth/getUser"

router.post('/getuser',fetchuser,async(req,res)=>{
    try{
        const userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        res.json(user);
    }
    catch(error){
        console.error(error.message);
        res.status(400).send("internal error");
    }
})

module.exports=router;
   