const express = require('express');
const router = express.Router();
const userModel = require('../models/user.model');



/* POST /api/auth/register */
router.post('/register', async (req, res) => {
    try{
        const {name , age , email , password} = req.body;
        const  user = await userModel.create({name, age, email, password});
        res.status(201).json({message:'User registered successfully', user});

    }
    catch(error){
        console.error('Error registering user:', error);
        res.status(500).json({message:'Server error'});
    }
})





module.exports = router;