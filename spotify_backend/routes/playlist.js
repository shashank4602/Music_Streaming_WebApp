const express = require("express");
const passport = require("passport");
const Playlist = require("../models/Playlist");
const User = require("../models/User");
const router = express.Router();
const Song = require("../models/Song");

//create a playlist
router.get("/create",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const currentUser = req.user;
        const { name, thumbnail, songs } = req.body;
        if (!name || !thumbnail || !songs) {
            return res.status(301).json({ err: "Insufficient data" });
        }
        const playlistData = {
            name,
            thumbnail,
            songs,
            owner: currentUser._id,
            collaborators: [],
        };
        const playlist = await Playlist.create(playlistData);
        return res.status(200).json(playlist);
    })

//get playlist by id
//we will get the playlist id as a route parameter and will return playlist having that id
router.get("/get/me",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        //In Express.js, route parameters are values that are part of the URL path. 
        //These parameters are specified in the route path and can be accessed in the route handler function.
        const playlistId = req.user._id;
        //I need to find a playlist with the _id = playlistId
        const playlist = await Playlist.findOne({ owner: artistId }).populate("owner");
        if (!playlist) {
            return res.status(301).json({ err: "Invalid ID" });
        }
        return res.status(200).json(playlist);
    })

//get all playlist by an artist
//get/artist/:artistId
router.get("/get/artist/:artistId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const artistId = req.params.artistId;

        const artist = await User.findOne({ _id: artistId });
        if (!artist) {
            return res.status(304).json({ err: "Invalid Artist ID" });
        }

        const playlists = await Playlist.find({ owner: artistId });
        return res.status(200).json({ data: playlists });
    })

router.post("/add/song",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const currentUser = req.body;
        const { playlistId, songId } = req.user;

        const playlist = await Playlist.findOne({ _id: playlistId });
        if (!playlist) {
            return res.status(304).json({ err: "Playlist does not exist" });3
        }
        //check if the currentUser owns the playlist or is a collaborator
        if (
            playlist.owner != currentUser._id &&
            !playlist.collaborators.includes(currentUser._id)
        ) {
            return res.status(400).json({ err: "Not allowed" });
        }
        //check if the song exists or not
        const song = await Song.findOne({ _id: songId });
        if (!song) {
            return res.status(304).json({ err: "Song does not exist" });
        }
        //add song to playlist
        playlist.songs.push(songId);
        //updating value in database
        await playlist.save();
        return res.status(200).json("Song is successfully added into the playlist");
    })

module.exports = router;