const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const items = [];
const workListItems = [];

app.get("/", function(req, res){
  
  const formatDate = date.getDate();
  res.render("list", {listTitle: formatDate, newListItems: items});
});

app.post("/", (req, res) => {
    const item = req.body.newItem;
    if(req.body.list === "Work") {
        workListItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", (req, res) => {
    res.render("list", {listTitle: "Work List", newListItems:workListItems});
});

app.post("/work", (req, res) => {
    const item = req.body.newItem;
    workListItems.push(item);
    res.redirect("/work");
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});