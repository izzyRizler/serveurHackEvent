const express = require('express');
const app = express();

// répondre avec help world quand reçoit une requête GEt



const mysql = require('mysql')
var connection = mysql.createConnection({
    host : '192.168.4.1',
    user : 'sqlarasoaharimalala',
    password : 'savary',
    database :'tbremon_hackaton', 
    ssl :  {
        rejectUnauthorized : false 
    }

});
connection.connect(function(err){
   if(err)throw err;
    console.log("connection ok ")
});
app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/',(req ,res ) => {
    let sql ="select * from hackaton order by theme_hack";
    connection.query(sql,function(err,resultat){
        //console.log(resultat)
        res.json(resultat);
    })
    
});
app.get('/atelierHack/:idhack',(req,res)=>{
    let idhack = req.params.idhack;
    let sql= "select event_atelier.id, nb_participants, theme_hack, event.* from event_atelier join event on event_atelier.id= event.id join hackaton on hackaton.id = event.id_hack where id_hack =  "+idhack+"";
    connection.query(sql,function(err,resultat){
        console.log(resultat);
        res.json(resultat);
    })
});
app.post('/utilisateur', (req, res) => {
    let sql = "INSERT INTO utilisateur (prenom_util, nom_util, mail_util) VALUES ('" 
              + req.body.prenom + "','" 
              + req.body.nom + "','" 
              + req.body.email + "')";
    
    connection.query(sql, function(err, resultat) {
        if (err) {
            console.error('Erreur lors de l\'insertion dans utilisateur :', err);
            res.status(500).json({ message: 'Erreur lors de l\'insertion.' });
            return;
        }

        const userId = resultat.insertId;
        res.status(201).json({ message: 'Utilisateur inséré avec succès.', id: userId });
    });
});

app.post('/participer', (req, res) => {
    console.log(req.body)
    let sql = "INSERT INTO participer (id_util, id_event) VALUES ('"+req.body.id_utilisateur+"','"+req.body.id_event+"')";
    
    connection.query(sql, function(err, resultat) {
        if (err) {
            console.error('Erreur lors de l\'insertion dans participer :', err);
            res.status(500).json({ message: 'Erreur lors de l\'insertion.' });
            return;
        }

        res.status(201).json({ message: 'Participation insérée avec succès.' });  

        
    });
});

  
  

app.listen(3000, () => {
    console.log('Serveur Démarré ')
});
