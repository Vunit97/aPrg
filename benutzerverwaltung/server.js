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

//Session
const session = require("express-session");
app.use(session({
	secret: "example",
	resave: false,
	saveUninitialized: true,
}));

app.post("/anmelden", (request,response) => {
	const nutzer = request.body["nutzer"];
	const passwort = request.body["passwort"];
	var accExtists = false;

	//Ein User suchen
	db.collection(DB_COLLECTION).findOne({'nutzer': nutzer}, (error,result) => {

		// If account is found in databank
		if(result != null) {
			accExtists = true;	
			console.log(result.passwort);

			// if given password matches with account username
			if (result.passwort == passwort) {
				request.session['authenticated'] = true;
				request.session["nutzer"] = nutzer;
				response.redirect("/inside");

			// wrong password given
			} else {
				console.log(error);
				message = "Falsches Passwort dude...";
				response.redirect("/");
			}			
		} 

		// username is not in the databank
		else {
			message = "Uknown User...";
			response.redirect("/");
		}
	});




});

app.get("/inside", (request, response) => {
	if(request.session['authenticated'] == true) {
		const nutzer = request.session['nutzer'];
		response.render("inside", {"user": nutzer });
	} else {
		message = "No permission! Please login.";
		response.redirect("/")
	}

});

app.get("/logout", (request,response) => {
	delete request.session.authenticated;
	message = "Logout successful."
	response.redirect("/");
});

app.get("/register", (request, response) => {
	response.render('register', {"error": "","on": ""});
});


app.post("/registerverify", (request, response) => {
	const nutzer = request.body["nutzer"];
	const passwort = request.body["passwort"];
	const passwordrepeat = request.body["passwordrepeat"];
	const email = request.body["email"];
	const error = [];

	if(nutzer == "" || nutzer == null) {
		error.push("Type a username!");
	}
	if(passwort == "" || passwort == null){
		error.push("Type a password!");
	} else {
		if(passwordrepeat == "" || passwordrepeat == null) {
			error.push("Don't forget to repeat your password!")
		}
	}
	
	if(email == "" || email == null || !email.includes("@")) {
		error.push("Type a correct Email adress!")
	}

	if(passwort != passwordrepeat) {
		error.push("Passwords dont match!")
	}

	// USER DATEN IN DATENBANK SPEICHERN 


	if(error.length == 0) {
		const on = "Succesfully registered!";
		const documents = {'nutzer': nutzer, 'passwort': passwort, 'email': email};

		db.collection(DB_COLLECTION).save(documents, (err, result) =>  {
			if(err) return console.log(err);
			console.log("saved to database");
		});

		response.render('register', {"error": error, "on": on});
	} else {
		response.render('register', {"error": error, 'on': ""});
	}

	
});


