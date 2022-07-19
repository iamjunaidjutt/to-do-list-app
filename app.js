const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", function(req, res){
  let date = new Date();
  res.send(date.getDate());

});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});