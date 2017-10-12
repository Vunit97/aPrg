
// Initialisierung des Webservers
const express = require('express');
const app = express();

// body-parser initialisieren
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// EJS Template Engine initialisieren
app.set('view engine', 'ejs');

// Webserver starten
// Aufruf im Browser: http://localhost:3000

app.listen(3000, function(){
	console.log("listening on 3000");
});


//Tingodb initialisieren
const DB_COLLECTION = "products";
const Db = require("tingodb")().Db;
const db = new Db(__dirname + "/tingodb", {});
const ObjectID = require("tingodb")().ObjectID; 

//Startseite festlegen
app.get("/", (request, response) => {
	response.sendFile(__dirname + "/index.html");
});

//Daten speichern
app.post("/addToCart", function(request, response){
	const artikel = request.body["artikel"];
	const preis = request.body["preis"];
	const document = {"artikel": artikel, "preis": preis};

	db.collection(DB_COLLECTION).save(document, (err, result) => {
		if (err) return console.log(err);

		console.log("saved to database");
		res.redirect("/"); 
	});
	const array = db.collection(DB_COLLECTION).find().toArray(function(err, result){
 		response.render("shop", {"products": result});
 	});
 });

	app.get("/shop", function(request,response){
	const array = db.collection(DB_COLLECTION).find().toArray(function(err, result){
 		response.render("shop", {"products": result});
	});
});

// Produkt löschen

app.post('/deleteProduct/:id', (request, response) => {
	const id = request.params.id;
	const o_id = new ObjectID(id);
	db.collection(DB_COLLECTION).remove({"_id": o_id}, (err,result) => {
		response.redirect("/shop");
	})
});
