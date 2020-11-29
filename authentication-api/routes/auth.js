const router = require('express').Router();
const User = require('../model/Users');
const {Validation} = require('../validation');

//final url will be host/api/user/register
//coming from app.use('/api/user', authRoute); in index.js
router.post('/register', async(req,res) => {
    //validate the data before we make a user

    //this will return only the error part instead of the entire object
    const {error} = Validation.registerValidation(req.body);
    //sends response back with the error message
    //res.send(error.details[0].message);

    if(error) return res.status(400).send(error.details[0].message);

    //check if the user is already in the DB
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('Email already exists');

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    //trying to save the user
    try{
        const savedUser = await user.save();
        res.send(savedUser);
    }catch (err){
        res.status(400).send(err);
    }
});

module.exports = router;