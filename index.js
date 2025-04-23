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
    let sql= "select SUM(montant) as montantTotal, event_atelier.id, nb_participants, theme_hack, event.* from event_atelier join event on event_atelier.id= event.id join hackaton on hackaton.id = event.id_hack join participer on participer.id_event = event_atelier.id where id_hack =  "+idhack+"";
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
    let sql = "INSERT INTO participer (id_util, id_event, montant) VALUES ('"+req.body.id_utilisateur+"','"+req.body.id_event+"',"+req.body.montantUtil+")";
    
    connection.query(sql, function(err, resultat) {
        if (err) {
            console.error('Erreur lors de l\'insertion dans participer :', err);
            res.status(500).json({ message: 'Erreur lors de l\'insertion.' });
            return;
        }

        res.status(201).json({ message: 'Participation insérée avec succès.' });  

        
    });
});
app.post('/commentaire',(req,res)=>{
    console.log(req.body)
     let sql="insert into avis (id_event_atelier, avis_utilisateur, email_utilisateur) values ('"+req.body.id_event_atelier+"','"+req.body.commentaireAvis+"','"+req.body.emailAvis+"')  "
    connection.query(sql, function(err, resultat) {
        if (err) {
            console.error('Erreur lors de l\'insertion dans avis :', err);
            res.status(500).json({ message: 'Erreur lors de l\'insertion.' });
            return;
        }

        res.status(201).json({ message: 'Avis inséré avec succès.' });  
    }); 

});
app.get('/commentaireAtelier/:id_event_atelier',(req,res)=>{
    let idEventAtelier = req.params.id_event_atelier;
    let sql = "select avis.id_event_atelier, avis_utilisateur, email_utilisateur from avis join event_atelier on avis.id_event_atelier = event_atelier.id where avis.id_event_atelier ="+idEventAtelier+" ";
    connection.query(sql,function(err,resultat){
        console.log(resultat);
        res.json(resultat);
    });
})

  

app.listen(3000, () => {
    console.log('Serveur Démarré ')
});
