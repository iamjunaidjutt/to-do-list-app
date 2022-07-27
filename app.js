const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/toDoListDB");

const itemsSchema = mongoose.Schema({
	name: String
});
const Item = mongoose.model("Item", itemsSchema);
const listSchema = mongoose.Schema({
	name: String,
	items: [itemsSchema]
});
const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {
	Item.find({}, (err, foundItems) => {

		if (err) {
			console.error(err);
		} else {
			res.render("list", {
				listTitle: "Today",
				newListItems: foundItems,
			});
		}

	});
});

app.get("/:customList", function (req, res) {
	const customListName = (req.params.customList);

	List.findOne({ name: customListName }, (err, foundList) => {
		if (!err) {

			if (foundList) {

				res.render("list", {
					listTitle: foundList.name,
					newListItems: foundList.items,
				});
			} else {

				List.create({
					name: customListName,
				});
				res.redirect(`/${customListName}`);
      }

		}

	});
});

app.post("/", function (req, res) {
	const newItem = req.body.newItem;
	const listName = req.body.list;
	const item = new Item({
		name: newItem,
	});
	if (listName === "Today") {
		item.save();
		res.redirect("/");
	} else {
		List.findOne({ name: listName }, function (err, foundList) {
			foundList.items.push(item);
			foundList.save();
			res.redirect(`/${listName}`);
		});
	}
});

app.post("/delete", function (req, res) {
	const itemId = req.body.checkbox;
  const listName = req.body.itemList;

  if(listName === "Today") {
    Item.findByIdAndRemove(itemId, function (err, item) {
      res.redirect("/");
    });
  } else {
	List.findOneAndUpdate({id: itemId}, {$pull: {items: {_id: itemId}}}, function(err, list) {
		res.redirect(`/${listName}`);
	});
  }
	
});


app.listen(3000, function () {
	console.log("Server started on port 3000");
});
