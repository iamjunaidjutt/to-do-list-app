const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");

app.get("/", function(req, res){
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  }
  let formatDate = today.toLocaleDateString("en-US", options);
  let currentDay = today.getDay();
  let day = "";
  switch(currentDay) {
    case 0:
        day = "Sunday";
        break;
    case 1:
        day = "Monday";
        break;
    case 2:
        day = "Tuesday";
        break;
    case 3:
        day = "Wednesday";
        break;
    case 4:
        day = "Thursday";
        break;
    case 5:
        day = "Friday";
        break;
    case 6:
        day = "Saturday";
        break;
    default:
        console.log("Invalid date");
  }
  res.render("list", {weekday: formatDate});
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});