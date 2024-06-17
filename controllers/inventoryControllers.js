const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// create new inventory record
const createInventory = async(req,res) => {
    try {
        const {email} = req.body;
        const existUser = await userModel.findOne({email});
        if(!existUser){
            throw new Error("User not found");
        }

        // if(inventoryType === "in" && existUser.role !== "donar"){
        //     throw new Error("Not a donar account");
        // }

        // if(inventoryType === "out" && existUser.role !== "hospital"){
        //     throw new Error("Not a hospital account");
        // }

        if(req.body.inventoryType === "out"){
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityOfBlood = req.body.quantity;
            const organisation = new mongoose.Types.ObjectId(req.body.userId);

            //calculate Blood Quanitity
            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {
                $match: {
                    organisation,
                    inventoryType: "in",
                    bloodGroup: requestedBloodGroup,
                },
                },
                {
                $group: {
                    _id: "$bloodGroup",
                    total: { $sum: "$quantity" },
                },
                },
            ]);

            const totalIn = totalInOfRequestedBlood[0]?.total || 0;

            //calculate OUT Blood Quanitity

            const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
                {
                $match: {
                    organisation,
                    inventoryType: "out",
                    bloodGroup: requestedBloodGroup,
                },
                },
                {
                $group: {
                    _id: "$bloodGroup",
                    total: { $sum: "$quantity" },
                },
                },
            ]);
            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

            //in & Out Calc
            const availableQuanityOfBloodGroup = totalIn - totalOut;

            //quantity validation
            if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
                return res.status(500).send({
                success: false,
                message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
                });
            }

            req.body.hospital = existUser._id;
            
        }

        else {
            req.body.donar = existUser?._id;
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

// GET Donars Record

const getAllDonars = async(req,res) => {
    try {
        const organisation = req.body.userId;
        const donarId = await inventoryModel.distinct("donar",{organisation});  

        const donars = await userModel.find({_id:{$in:donarId}});
        return res.status(200).send({
            success: true,
            message: "Donar Record Fetched Successfully",
            donars
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message: "Error in donar records"
        })
    }
}

module.exports = {createInventory,getAllInventory,getAllDonars};