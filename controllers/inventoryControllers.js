const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// create new inventory record
const createInventory = async(req,res) => {
    try {
        const {email,inventoryType} = req.body;
        const existUser = await userModel.findOne({email});
        if(!existUser){
            throw new Error("User not found");
        }

        if(inventoryType === "in" && existUser.role !== "donar"){
            throw new Error("Not a donar account");
        }

        if(inventoryType === "out" && existUser.role !== "hospital"){
            throw new Error("Not a hospital account");
        }

        const inventory = new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            success:true,
            message:"New blood record added"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message: "Error in inventory creation API",
            error
        })
    }
}

// GET all blood record
const getAllInventory = async(req,res) => {
    try {
        const inventory = await inventoryModel.find({organisation:req.body.userId}).populate('donar').populate('hospital').sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            message:"Get all records successfully",
            inventory
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message: "Error in Get all inventory"
        })
    }
}

module.exports = {createInventory,getAllInventory};