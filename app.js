const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://Saurabh:React123@cluster0.9zml6.mongodb.net/todolistDB");

const itemSchema = new mongoose.Schema({
    name: String
});

const listSchema = new mongoose.Schema(
    {
       name: String,
       items: [itemSchema]
    }
);

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List",listSchema);

const item1 = new Item({
    name: "Welcome to your To-Do list"
});

const item2 = new Item({
    name: "Hit + to add a new item"
});

const item3 = new Item({
    name: "Hit there to delete a item"
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {

     Item.find({}, function (err, foundItems) {
        if(foundItems.length === 0)
        {
            Item.insertMany(defaultItems, function (err) {});
            res.redirect("/");
        }
        const day = date.getdate();
        res.render("list", {
            listTitle: day,
            newitems: foundItems
        });
    })
});

app.post("/", function (req, res) {
    const listName = req.body.newlist;
    const item = new Item({
        name: req.body.newitem
    });

    if(listName === date.getdate())
    {
        item.save();
        res.redirect("/");
    }
    else
    {
        //1st Method
        List.findOne({name: listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
        });

        //2nd Method
        //List.updateOne({name: listName},{$push: {items: item}},function(err){});

        //3rd Method
        //List.findOneAndUpdate({name: listName},{$push: {items: item}},function(err,foundList){});

        res.redirect("/" + listName);
        
    } 
});

app.post("/delete",function(req,res){
    const itemId = req.body.checked;
    const listName = req.body.mylist;

    if(listName === date.getdate())
    {
        Item.deleteOne({_id: itemId},function(err){});
        res.redirect("/");
    }
    else
    {
        //1st Method
        // List.findOne({name: listName},function(err,foundList){
        //     foundList.items = foundList.items.filter(function(element){
        //         return element._id != itemId;
        //     });
        //     foundList.save();
        // });
        //2nd Method
        List.updateOne({name: listName},{$pull: {items: {_id: itemId}}},function(err){});

        //3rd Method
        //List.findOneAndUpdate({name: listName},{$pull: {items: {_id: itemId}}},function(err,foundList){});

        res.redirect("/" + listName);
    }
});

app.get("/:listName",function(req,res){
    const customList = lodash.capitalize(req.params.listName);

    List.findOne({name: customList},function(err,foundList){
        if(!err)
        {
            if(!foundList)
            {
                const list = new List(
                    {
                        name: customList,
                        items: defaultItems
                    }
                );
                list.save();
                res.redirect("/" + customList);
            }
            else
            {
                if(foundList.items.length === 0)
                {
                    foundList.items = defaultItems;
                    foundList.save();
                    res.redirect("/" + customList);
                }
                else
                {
                    res.render("list",{listTitle: customList,newitems: foundList.items});
                }
            }            
        }
    });
});

let port = process.env.PORT || 3030;

app.listen(port, function () {
    console.log("server has started successfully");
});