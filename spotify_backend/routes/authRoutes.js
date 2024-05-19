const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers");

//to register a user using POST route
router.post("/register", async (req, res) => {
    //this code is run when the /register api is called as a POST request

    //req.body in format {email,password,firstName,lastName,username}
    const { email, password, firstName, lastName, username } = req.body;

    //does a user with this email already exist?if yes then error
    const user = await User.findOne({ email: email });
    if (user) {
        return res.status(403).json({ error: "A user with this email already exists" });
    }

    //create a new user in DB
    //we dont use password in plain texts, so converted to hash
    //bcrypt hash function
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserData = {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username
    };
    const newUser = await User.create(newUserData);

    //we want to create the token to return the user
    const token = await getToken(email, newUser);

    //return result to user
    const userToReturn = { ...newUser.toJSON(), token };
    //deleting hash password for security purpose
    delete userToReturn.password;
    return res.status(200).json(userToReturn);

})

router.post("/login", async (req, res) => {
    //get email n password 
    const { email, password } = req.body;
    //user exists or not
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(403).json({ err: "Invalid credentials" });
    }
    //if user exists, check password is correct or not
    //comparison of both in hashedPassword
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        //try to return same type of error
        return res.status(403).json({ err: "Invalid credentials" });
    }

    //we want to create the token to return the user
    const token = await getToken(user.email, user);
    //return result to user
    const userToReturn = { ...user.toJSON(), token };
    //deleting hash password for security purpose
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
})
module.exports = router;