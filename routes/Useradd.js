const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userschema')
const router = express.Router();

const app = express();

router.put('/update/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)  //params means parameter value
        .then(() => res.json('user updated'))
        .catch(err => res.status(400).json(`Error: ${err}`));

})
router.delete('/delete/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)  //params means parameter value
        .then(() => res.json('user deleted'))
        .catch(err => res.status(400).json(`Error: ${err}`));

})
router.post('/adduser', async (req, res) => {
    const newUser = new User({
        Name: req.body.Name,
        Mail: req.body.Mail,
        Password: req.body.Password,
        
    });
    
    var Mobilenumber = req.body.Mobilenumber;
    //first check if user is alredy existed 
    User.findOne({ Name: req.body.Name }).select().exec().then(doc => {
        console.log(doc)
        if (doc == null) { //if no user found then create new user
            newUser.save().then(result => {
                // sendnotificationforplacebid(req.body.firstName + req.body.lastName,"You Registered As",req.body.role,req.body.uniqueDeviceId)
                res.status(200).json({
                    message: "User Added susccessfully",
                    status: "success",
                    Id: result._id,
                    selectType: result.role
                });

            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    status: "failed"
                });
            })

        } else {
            res.status(500).json({
                message: "user aleredy exists",
                status: "failed"

            })
        }


    });
});

router.get('/getuser', async (req, res) => {  //// async makes a function return a Promise
    try {
        const user = await User.find({})
        //await makes a function wait for a Promise
        res.status(200).json({ user })
    } catch (error) {
        res.status(400).send(error)
        console.log(error)
    }
})

module.exports = router;