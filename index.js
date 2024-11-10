const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require('dotenv').config();
app.set('views', './views')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


const homeStartingContent = "Welcome to our travel blog, your passport to adventure and discovery! Whether you're a seasoned globetrotter or a novice explorer, our platform is your go-to resource for inspiration, tips, and insights to fuel your wanderlust. From hidden gems off the beaten path to iconic landmarks steeped in history, we're here to guide you on a journey of exploration and cultural immersion. Join us as we traverse the globe, uncovering the world's most captivating destinations, indulging in culinary delights, and forging unforgettable memories along the way. Let's embark on this extraordinary adventure together – because life is too short to stay in one place!";
const aboutContent = "Welcome to our travel blog! We believe that travel is not just about visiting new places; it's about immersing ourselves in diverse cultures, connecting with locals, and experiencing the world in all its richness. Founded by passionate travelers with a shared love for exploration, our blog is a labor of love aimed at inspiring and empowering fellow adventurers to embark on their own transformative journeys. Whether you're seeking adrenaline-pumping adventures, serene escapes, or cultural odysseys, our curated content offers practical advice, insider tips, and heartfelt stories to ignite your wanderlust and help you navigate the globe with confidence. Join our community of explorers as we embrace the unknown, foster meaningful connections, and create memories that will last a lifetime.";
const contactContent = "Have a burning question, a suggestion for a destination, or just want to share your latest travel tale? We'd love to hear from you! Our team is here to assist you with any inquiries, feedback, or collaboration opportunities you may have. Whether you're seeking travel advice, interested in partnering with us, or simply want to say hello, feel free to reach out via the contact form below or drop us an email at travel@blog.com. We're dedicated to providing timely and personalized responses to ensure that your travel experience with us is nothing short of exceptional. Let's connect and embark on this journey together!";

const uri = process.env.MONGODB_URI;

//console.log(process.env);

mongoose.connect(uri).then(() => {
  console.log("connected to the database!");
  app.listen((process.env.PORT || 4000), () => {
    console.log("Server is running");
  });
})
  .catch(() => {
    console.log("connection failed");
  })

//Defining mongoose Schema for blogposts

const blogSchema = mongoose.Schema({
  title: String,
  body: String
})

const Post = mongoose.model("blogPost", blogSchema);


//Defining GET and POST requests to server

app.get("/", async (req, res) => {

  //Fetching already made posts

  const postsMade = await Post.find({});



  res.render("home", { homeStartingContent: homeStartingContent, postsMade: postsMade })

})

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent })
})
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent })
})
app.get("/compose", function (req, res) {
  res.render("compose", {})
})

app.get("/posts/:postID", async function (req, res) {

  const searchedPost = req.params.postID;

  const foundPost = await Post.findOne({ _id: searchedPost })

  res.render("post", { postsMade: foundPost });

})

app.post("/delete", async function (req, res) {

  try {
    const postToDeleteID = Object.keys(req.body);
    await Post.findByIdAndDelete(postToDeleteID);

  } catch (error) {
    console.log("Unable to delete message");
  }

  finally {
    console.log("Post deleted successfully");
    res.redirect("/");
  }

})

app.post("/compose", async function (req, res) {

  try {
    const title = req.body.postTitle;
    const body = req.body.postBody;

    const post = new Post({
      title: title,
      body: body
    })

    await post.save();


  }
  catch (error) {
    console.log(error);
  }

  res.redirect("/")

})

module.exports = app;


