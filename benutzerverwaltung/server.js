// Initialisierung des Webservers
const express = require('express');
const app = express();

// body-parser initialisieren
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// EJS Template Engine initialisieren
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// Webserver starten
// Aufruf im Browser: http://localhost:3000

app.listen(3000, function(){
	console.log("listening on 3000");
});

//TingoDB hinzufügen
const DB_COLLECTION = "benutzerverwaltung";
const Db = require("tingodb")().Db;
const db = new Db(__dirname + "/tingodb", {});
const ObjectID = require("tingodb")().ObjectID;

app.get('/', (request, response) =>{
	response.sendfile(__dirname + '/index.html');
});

