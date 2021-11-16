//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogDB");

const itemSchema = {
  name:String,
  content:String
};




const Item = mongoose.model("Item",itemSchema);

const Blog = mongoose.model("Blog",itemSchema);

const homeStartingContent = new Item({
  name: "homeStartingContent",
  content:"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});
const aboutContent = new Item({
  name: "aboutStartingContent",
  content: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
});
const contactContent = new Item({
  name: "contactStartingContent",
  content:"Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
});


const app = express();



const defaultPosts = [aboutContent,homeStartingContent,contactContent];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));





app.get("/",function(req,res){

  Item.find({},function(err, foundItems){
    if(foundItems.length == 0){
      Item.insertMany(defaultPosts,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Succesfully Adeed Default Items");
          res.redirect("/");
        }
      });
    }
    else{
      foundItems.forEach(function(item){
        if(item.name === "homeStartingContent"){

          Blog.find({},function(err,foundBlogs){
            if(err){
              console.log(err);
            }
            else{
              res.render("home",{homeText: item.content, stories: foundBlogs });
            }
          });

        }
      });

    }
  });
});


app.get("/posts/:postId",function(req,res){


  const requestedPostId = req.params.postId;

    Blog.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.name,
        body: post.content
      });
    });

});




app.get("/about",function(req,res){
  Item.findOne({name:"aboutStartingContent"},function(err,foundItem){
    if(err){
      console.log(err);
    }
    else{
      res.render("about" ,{aboutIntro: foundItem.content});
    }
  });

});


app.get("/contact",function(req,res){
  Item.findOne({name:"contactStartingContent"},function(err,foundItem){
    if(err){
      console.log(err);
    }
    else{
      res.render("contact",{contactIntro:foundItem.content});
    }
  });

});

app.get("/compose",function(req,res){

  res.render("compose");
});

app.post("/compose",function(req,res){
const postObject = new Blog({
  name: req.body.story,
  content: req.body.storybody
});

postObject.save();

res.redirect("/");
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
