var path = require("path")
var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var axios = require("axios")
var sha256 = require("sha256")
var axios = require('axios')
const conf = require('../sever-web/config')
const {Banque ,User, Categorie, Produit, LigneCommande, Panier, sequelize} =  require('../sever-web/model')
const { Sequelize, Op, Model, DataTypes, HasOne } = require("sequelize");
var fileAttente = []

app.listen(conf.portOptions.serverBanque,()=>{
    console.log("express stock server is listening on port", conf.portOptions.serverBanque)
})

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use(express.static(__dirname))

app.get('/', (req, res)=>{
    res.json({message : `Hello i m the banque server i run on port : ${conf.portOptions.serverBanque}`})
})


.post('/facture', async (req, res)=>{
    res.set("Access-Control-Allow-Origin", "*")
    res.set("Access-Control-Allow-Credentials", "true")
    res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,cle_api")

    console.log(req.body)
    try {        
        req.body = JSON.parse(Object.keys(req.body)) 
    } catch (error) {
        console.log(error)
    }
    console.log(req.body)

    if(!req.body.compte){
        res.json({facture : false})
        return
    }
    var banque =await Banque.findOne({
        where : {client : req.body.iduser}
    })
    console.log(banque.dataValues)
    if(req.body.prix <= banque.dataValues.solde){
        res.json({facture : true})
        return
    }else{
        res.json({facture : false})
        return
    }
})

.post('/facturer', async (req, res)=>{
    res.set("Access-Control-Allow-Origin", "*")
    res.set("Access-Control-Allow-Credentials", "true")
    res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,cle_api")

    console.log(req.body)
    try {        
        req.body = JSON.parse(Object.keys(req.body)) 
    } catch (error) {
        console.log(error)
    }
    console.log(req.body)
    if(!req.body.facturer){
        res.json({res : true})
        return
    }
    var banque = await Banque.findOne({
        where : { client : req.body.iduser},
    })
    console.log(banque.solde)
    banque.solde = banque.solde - req.body.prix
    await banque.save()
    res.json({message : 'Ok'});
})