/**     Modules & Dependencies      **/
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();
const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
const saltRounds = 15;

const host = "0.0.0.0";
const port = 4000;


/**     Initialize EJS, BodyParser, Public Folder, and Session      **/
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));


/**     Connect Database    **/
mongoose.connect(process.env.MONGO, err => {
    if(err) console.log("[-] Could Not Connect to DB.");
});


/**     Schemas     **/
const postSchema = new mongoose.Schema({
    title: String,
    author: String,
    date: String,
    body: String
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

/**     Database Encryption      **/
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});


/**     Models      **/
const Post = mongoose.model("post", postSchema);
const User = new mongoose.model("User", userSchema);

/**     Routes      **/
// Home
app.route("/")
    .get((req, res) => { res.render("home"); });

// About
app.route("/about")
    .get((req, res) => { res.render("about"); });

// Contact
app.route("/contact")
    .get((req, res) => { res.render("contact"); });

// Blog
app.route("/blog")
    .get((req, res) => {
        Post.find({}, (err, foundPosts) => {
            if(foundPosts.length > 1) {
                res.render("blog", { posts: foundPosts });
            }
        });
    });

// Post
app.route("/post/:postId")
    .get((req, res) => {
        const postId = req.params.postId;
        Post.findOne({_id: postId}, (err, foundPost) => {
            if (!err) {
                res.render("post", {
                    title: foundPost.title, date: foundPost.date, body: foundPost.body
                });
            }
        });
    });

// Login
app.route("/login")
    .get((req,res) => { res.render("login")})
    .post((req, res) => {
        User.findOne({email: req.body.username}, (findErr, foundUser) => {
            if (!findErr) {
                if (foundUser) {
                    bcrypt.compare(req.body.password, foundUser.password, (err, bcryptResponse) => {
                        res.render("compose");
                    });
                }
            } else {
                console.log("[-] Login Unsuccessful!");
                alert("Invalid Username Or Password");
            }
        });
    });

// Compose
// FIXME: Use Passport?
app.route("/compose")
    .post( (req, res) => {
        const newPost = new Post({
            title: req.body.newTitle,
            date: date.getDate(),
            body: req.body.postBody
        });
        newPost.save((err) => {
            (!err) ? res.redirect("/blog") : console.log(err);
        });
    });


/**     Open Port       **/
app.listen(port, host,() => {
    console.log("[+] Server listening on http://" + host + ":" + port + "...");
});

