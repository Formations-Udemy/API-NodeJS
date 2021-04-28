// Code nécessaire au bon fonctionnement du serveur --------
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
// fin du code nécessaire ----------------------------------


// Initialisation de EJS et body-parser
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : false}));

// Initialisation et Connexion à la BDD mongoDB
mongoose.connect('mongodb://localhost/sothebyDB', {useNewUrlParser : true, useUnifiedTopology: true});

/* On crée un schema, genre de table en SQL, squelette de la COLLECTION (ou obljet JS pour la DB) */
const paintingSchema = new mongoose.Schema({
    name : String,
    author: String,
    price : Number
});

/* On crée un model (une collection pour mongoDB) avec un label de notre choix (ici 'Movies') */
const Painting = mongoose.model('paintingSold', paintingSchema);

/* On ajoute un (ou plusieurs) objets (ou document) dans notre DB */
const Joconde = new Painting({
    name : 'La Joconde',
    author : 'Leonard de Vinci',
    price : 400
});

const Guernica = new Painting({
    name : 'Guernica',
    author : 'Picasso',
    price : 200
});

const NuitEtoilee = new Painting({
    name : 'La Nuit Etoilee',
    author : 'Van Gogh',
    price : 300
});

// On insert les 3 peintures créées au dessus
/* Painting.insertMany([Joconde, Guernica, NuitEtoilee], function(err){
    if (err) {
        console.log(err);
    }else {
        console.log("Insertion effectuée !")
    }
}); */

/* service de ROUTE mis à disposition par Express (cf documentation d'Express pour nodeJS) */
app.route('/paintings')
    .get(function(req, res){
        Painting.find({}, function(err, peintures){
            if (err) {
                console.log(err);
            }else {
                res.send(peintures);
            }
        });
    })
    .post(function(req, res){
        const Object = new Painting({
            name : req.body.name,
            author : req.body.author,
            price : req.body.price
        });
        Object.save(function(err){
            if (err) {
                console.log(err);
            }else{
                console.log("Méthode POST opérationnelle !")
            }
        });
    })
    .delete(function(req, res){
        Painting.deleteMany({}, function(err){
            if (err) {
                console.log(err);
            }else{
                console.log("Suppression effectuée avec succès !")
            }
        });
    });

app.route('/paintings/:paintingName')
    .get(function(req, res){
        Painting.findOne({name : req.params.paintingName}, function(err, peinture){
            if (err) {
                console.log(err);
            }else{
                res.send(peinture);
            }
        });
    })
    .delete(function(req, res){
        Painting.deleteOne({name : req.params.paintingName}, function(err){
            if (err) {
                console.log(err);
            } else {
                console.log("DELETE ONE success !")
            }
        });
    })
    .put(function(req, res){
        Painting.update(
            {name : req.params.paintingName},
            {
                name : req.body.name,
                author : req.body.author,
                price : req.body.price
            },
            {overwrite : true},
            function(err){
                if (err) {
                    console.log(err);
                }else{
                    console.log("PUT updated !")
                }
            }
        );
    })
    .patch(function(req, res){
        Painting.update({name : req.params.paintingName}, {$set: req.body}, function(err){
            if (err) {
                console.log(err);
            }else{
                console.log("PATCH updated !");
            }
        });
    });

/* Route GET (pour toutes les infos) de l'API RESTFUL */
app.get('/paintings', function(req, res){
    Painting.find({}, function(err, peintures){
        if (err) {
            console.log(err);
        }else {
            res.send(peintures);
        }
    });
});

/* Route GET pour un seul élément de l'API RESTFUL */ /* Ici req.params.paintingName est le nom rentré dans l'URL de l'API */
app.get('/paintings/:paintingName', function(req, res){
    //console.log(req.params.paintingName);
    Painting.findOne({name : req.params.paintingName}, function(err, peinture){
        if (err) {
            console.log(err);
        }else{
            res.send(peinture);
        }
    });
});

/* Route POST de l'API RESTFUL (en utilisant Postman pour faire la requête POST de l'API) */
app.post('/paintings', function(req,res){
    const Object = new Painting({
        name : req.body.name,
        author : req.body.author,
        price : req.body.price
    });
    Object.save(function(err){
        if (err) {
            console.log(err);
        }else{
            console.log("Méthode POST opérationnelle !")
        }
    });
});

/* Route DELETE de l'API RESTFUL (supprime tous les documents de la collection) */
app.delete('/paintings', function(req, res){
    Painting.deleteMany({}, function(err){
        if (err) {
            console.log(err);
        }else{
            console.log("Suppression effectuée avec succès !")
        }
    });
});

/* Route DELETE (d'UN SEUL document) de l'API RESTFUL */ /* paintingName peut être remplacer par paintingAuthor si on veut faire une suppression par rapport au peintre directement */
app.delete('/paintings/:paintingName', function(req, res){
    Painting.deleteOne({name : req.params.paintingName}, function(err){
        if (err) {
            console.log(err);
        } else {
            console.log("DELETE ONE success !")
        }
    });
});

/* Route PUT de l'API RESTFUL (remplacer un document par un autre) */
app.put('/paintings/:paintingName', function(req, res){
    Painting.update(
        {name : req.params.paintingName},
        {
            name : req.body.name,
            author : req.body.author,
            price : req.body.price
        },
        {overwrite : true},
        function(err){
            if (err) {
                console.log(err);
            }else{
                console.log("PUT updated !")
            }
        }
    );
});

/* Route PATCH de l'API RESTFUL (remplacer les infos d'un document par un autre) */
app.patch('/paintings/:paintingName', function(req, res){
    //console.log(req.body);
    Painting.update({name : req.params.paintingName}, {$set: req.body}, function(err){
        if (err) {
            console.log(err);
        }else{
            console.log("PATCH updated !");
        }
    });
});

app.get('/', function(req, res){
    res.send("Salut Steph !");
});

app.listen(port, function(){
    console.log("Le serveur tourne parfaitement sur le port " + port);
});