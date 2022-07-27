const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const urlDB = "mongodb+srv://admin-junaid:KZ0yj8yXxmmY81bi@cluster0.afaucgl.mongodb.net/toDoListDB?retryWrites=true&w=majority";

mongoose.connect(urlDB, {
	useNewUrlParser: true, 
	useUnifiedTopology: true 
 }).then(() => {
	console.log("Connect to database");
 }).catch(err => {
	console.log(err.message);
 });

const itemsSchema = mongoose.Schema({
	name: String,
});

const Item = mongoose.model("Item", itemsSchema);
const listSchema = mongoose.Schema({
	name: String,
	items: [itemsSchema],
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
	const customListName = _.capitalize(req.params.customList);

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
	const listName = req.body.listName;

	if (listName === "Today") {
		Item.findByIdAndRemove(itemId, function (err, item) {
			res.redirect("/");
		});
	} else {
		List.findOneAndUpdate(
			{ name: listName },
			{ $pull: { items: { _id: itemId } } },
			function (err, list) {
				res.redirect(`/${listName}`);
			}
		);
	}
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
	console.log("Server started Successfully");
});
