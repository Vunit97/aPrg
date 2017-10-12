
//ExpressJs initialieseen
const express = require ("express");
const app = express();

//Body-parser init
const bodyParser = require ("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//ejs init
app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

//Server starten
const port = 3000;
app.listen(port, function () {
	console.log("listening to port " + port);
});

//Startseite festlegen
app.get("/", (request, response) => {
	response.sendFile(__dirname + "/index.html");
});

app.post("/tabellen", function(request, response){
	const spalte = parseInt(request.body["spalten"]);
	const zeile = parseInt(request.body["zeilen"]);

	if(!isNaN(spalte) && !isNaN(zeile) && zeile > 0 && spalte > 0 ) {
		response.render("tabelle", {"zeilen": zeile, "spalten": spalte}) 
	} else {
		response.render("error", {});
	}
});