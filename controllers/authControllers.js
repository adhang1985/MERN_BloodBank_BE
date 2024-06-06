const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async(req,res) => {
    try {
        const {email,password} = req.body;
        const existUser = await userModel.findOne({email});
        if(existUser){
            return res.status(200).send({
                success:false,
                message:"User is exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body);
        await newUser.save();

        return res.status(201).send({
            success:true,
            message: "User Registered Successfully",
            newUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in Register API",
            success: false,
            error
        })
    }
}

const loginUser = async(req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message: "Please fill the credentials"
            })
        }

        const existUser = await userModel.findOne({email});
        if(!existUser){
            return res.status(404).send({
                success:false,
                message:"Email is not registered"
            })
        }

        if(existUser.role !== req.body.role){
            return res.status(404).send({
                success:false,
                message:"Role doesn't match"
            })
        }

        const isMatched = await bcrypt.compare(password,existUser.password);
        if(!isMatched){
            return res.status(401).send({
                success:false,
                message: "Invalid password!"
            })
        }

        const token = jwt.sign({id:existUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:'1d'
        })

        return res.status(200).send({
            success:true,
            message: "Logged in successfully",
            token,
            user:existUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:"Error in login API",
            success:false
        })
    }
}

const getCurrentUser = async(req,res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        return res.status(200).send({
          success: true,
          message: "User Fetched Successfully",
          user
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          success: false,
          message: "unable to get current user",
          error
        });
      }
}

module.exports = {registerUser,loginUser,getCurrentUser}