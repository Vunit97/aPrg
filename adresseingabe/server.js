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

app.get('/', function(req, res){
	res.render('error', {
        'name': '',
        'street': '',
        'place': '',
        'email': '',
        'errors': {}
    });
});

app.post('/checkAddress', (request, response) => {
    const name = request.body.name;
    const street = request.body.street;
    const place = request.body.place;
    const email = request.body.email;
    const errors = [];

    if (name == "" || name == null){
        errors.push('Bitte einen Namen eingeben!');
    }
    if (street == "" || street == null){
        errors.push('Bitte eine Straße eingeben!');
    }
    if (place == "" || place == null){
        errors.push('Bitte einen Ort eingeben!');
    }
    if (email == "" || email == null || !email.includes('@')){
        errors.push('Bitte eine korrekte E-Mail Adresse eingeben!');
    }

    if (errors.length == 0) {
        response.render('adresse', {
            'name': name,
            'street': street,
            'place': place,
            'email': email,
        });
    } else {
        response.render('error', {
            'name': name,
            'street': street,
            'place': place,
            'email': email,
            'errors': errors
        });
    }

   
});