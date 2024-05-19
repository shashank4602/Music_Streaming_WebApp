const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()
//console.log(process.env)
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const User = require("./models/User.js");
const authRoutes = require("./routes/authRoutes");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
const cors = require("cors");
const app = express();
const port = 8080;

app.use(cors());
//sets up middleware in your Express.js application to parse JSON bodies of incoming requests.
app.use(express.json());
//express.json(): This middleware function parses incoming requests with JSON payloads. 
//It parses the req object and populates it with a body object containing the parsed data.
//while connecting to cloud databse add your ip address

//2 arguments
mongoose.connect("mongodb+srv://anonymperson912:" + process.env.PASSWORD + "@shashank.avp41yn.mongodb.net/?retryWrites=true&w=majority&appName=Shashank",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((x) => {
        console.log("Connected to Mongo");
    }).catch((err) => {
        console.log("Error");
    });

//connecting passport
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisKeyIsSupposedToBeSecret";
passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        // Finding user
        const user = await User.findOne({ id: jwt_payload.sub });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // Or you could create a new account
        }
    } catch (error) {
        return done(error, false);
    }
}));

app.get("/", (req, res) => {
    //req contains all data for request
    //res contains all data for response    
    res.send("Hello World");
})

//You're setting up a middleware in your Express.js application to use the authRoutes router 
//for any requests that start with the /auth
app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);


app.listen(port, () => {
    console.log("App is running on " + port);
})