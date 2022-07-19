const express = require("express");
const bodyParser = require("body-parser");
const { response } = require("express");

const app = express();
app.use("view engine", "ejs");

app.get("/", function(req, res){
  let date = new Date();
  if(date.getDay() === 2) {
    res.sendFile(__dirname + "/index.html");
  } else {
    res.send("Its a weedend!");  
  }
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});