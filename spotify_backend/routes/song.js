const express = require("express");
const passport = require("passport");
const router = express.Router();
const Song = require("../models/Song");
const User = require("../models/User");

router.post("/create",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        //req.user gets the user because of passport.authenticate
        const { name, thumbnail, track } = req.body;
        if (!name || !thumbnail || !track) {
            return res
                .status(301)
                .json({ err: "Insufficient details to create song" });
        }
        const artist = req.user._id;
        const songDetails = { name, thumbnail, track, artist };
        const createdSong = await Song.create(songDetails);
        return res.status(200).json(createdSong);
    })

//get route to get all songs I have published
router.get("/get/mysongs",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const currentUser = req.user;
        //we need to get all songs where artist id == currentUser._id;
        const songs = await Song.find({ artist: req.user._id }).populate("artist");
        return res.status(200).json({ data: songs });
    })

//get route to get all songs any artist has published
//i will send artist id and i want to see all songs artist has published
router.get("/get/artist/:artistId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { artistId } = req.params;
        //here we will not use find as ![] is false hence we will not get { err: "Artist does not exist" }
        const artist = await User.findOne({ _id: artistId })
        console.log(artist);
        console.log("jkeccwnefwkleefk23j3kjd2n2oi2io32ip3293932239032999023j230j32");
        if (!artist) {
            return res.status(301).json({ err: "Artist does not exist" });
        }
        const songs = await Song.find({ artist: artistId });
        return res.status(200).json({ data: songs });
    })

//get route a single song by name
router.get("/get/songname/:songName",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { songName } = req.params;

        const songs = await Song.find({ name: songName }).populate("artist");
        return res.status(200).json({ data: songs });
    })

module.exports = router;