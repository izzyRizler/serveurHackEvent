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

app.get('/',(req ,res ) => {
    let sql ="select hackaton.*, event.* from event join hackaton on event.id_hack = hackaton.id order by id asc ";
    connection.query(sql,function(err,resultat){
        console.log(resultat)
        res.json(resultat);
    })
    
});

app.listen(3000, () => {
    console.log('Serveur Démarré ')
});
