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

app.listen(conf.portOptions.serverClientele,()=>{
    console.log("express stock server is listening on port", conf.portOptions.serverClientele)
})

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use(express.static(__dirname))

app.get('/', (req, res)=>{
    res.json({message : `Hello i m the client server i run on port : ${conf.portOptions.serverClientele}`})
})


.post('/validcommande', async (req, res)=>{
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
    if(fileAttente[req.body.iduser.toString()] && fileAttente[req.body.iduser.toString()].facture && fileAttente[req.body.iduser.toString()].facture !== 'undefined'){
        fileAttente[req.body.iduser.toString()].stock = req.body.validstock
        fileAttente[req.body.iduser.toString()].idpanier = req.body.idpanier
        console.log(fileAttente)
        axios({
            method : 'POST',
            url : `${conf.hostOptions.serverStock}:${conf.portOptions.serverStock}/decrStock`,
            data : {cart : req.body.cart, iduser : req.body.iduser, decrStock : fileAttente[req.body.iduser.toString()].stock && fileAttente[req.body.iduser.toString()].facture},
            headers : {"Content-Type": "application/x-www-form-urlencoded"}
        }).then(async (data)=>{
            console.log('Ok')
            if(fileAttente[req.body.iduser.toString()].stock && fileAttente[req.body.iduser.toString()].facture){
                var panier = await LigneCommande.findOne({ where : {idpanier : req.body.idpanier}})
                panier.livraison = 2
                await panier.save()
            }else{
                var panier = await LigneCommande.findOne({ where : {idpanier : req.body.idpanier}})
                panier.livraison = 0
                await panier.save()
                setTimeout(async ()=>{
        
                    fileAttente[req.body.iduser.toString()] = null
            
                },10000)
            }
        }).catch((err)=>{
            console.log('impossible de joindre le serveur stock pour décrémenter', err)
        })
        axios({
            method : 'POST',
            url : `${conf.hostOptions.serverBanque}:${conf.portOptions.serverBanque}/facturer`,
            data : {cart : req.body.cart, iduser : req.body.iduser, facturer : fileAttente[req.body.iduser.toString()].stock && fileAttente[req.body.iduser.toString()].facture, prix : req.body.prix},
            headers : {"Content-Type": "application/x-www-form-urlencoded"}
        }).then(async (data)=>{
            console.log('Ok')
            if(fileAttente[req.body.iduser.toString()].stock && fileAttente[req.body.iduser.toString()].facture){
                var panier = await LigneCommande.findOne({ where : {idpanier : req.body.idpanier}})
                panier.livraison = 2
                await panier.save()
            }else{
                var panier = await LigneCommande.findOne({ where : {idpanier : req.body.idpanier}})
                panier.livraison = 0
                await panier.save()
            }
            setTimeout(async ()=>{
        
                fileAttente[req.body.iduser.toString()] = null
        
            },10000)
        }).catch((err)=>{
            console.log('impossible de joindre le serveur Banque facturer', err)
        })
        if(fileAttente[req.body.iduser.toString()].stock && fileAttente[req.body.iduser.toString()].facture){
            var panier = await LigneCommande.findOne({ where : {idpanier : req.body.idpanier}})
            panier.livraison = 2
            await panier.save()
        }else{
            var panier = await LigneCommande.findOne({ where : {idpanier : req.body.idpanier}})
            panier.livraison = 0
            await panier.save()
        }
        

    }
    else{
        fileAttente[req.body.iduser.toString()]= {stock : req.body.validstock}
        fileAttente[req.body.iduser.toString()].idpanier = req.body.idpanier
        console.log(fileAttente)
    }
    res.json({validcommande : true});
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
    if(fileAttente[req.body.iduser.toString()] && fileAttente[req.body.iduser.toString()].stock && fileAttente[req.body.iduser.toString()].stock !== 'undefined'){
        fileAttente[req.body.iduser.toString()].facture = req.body.facture
        console.log('a facture', fileAttente[req.body.iduser.toString()])
        axios({
            method : 'POST',
            url : `${conf.hostOptions.serverStock}:${conf.portOptions.serverStock}/decrStock`,
            data : {cart : req.body.cart, iduser : req.body.iduser, decrStock : fileAttente[req.body.iduser.toString()].stock && fileAttente[req.body.iduser.toString()].facture},
            headers : {"Content-Type": "application/x-www-form-urlencoded"}
        }).then(async (data)=>{
            console.log('Ok')
            if(fileAttente[req.body.iduser.toString()] && fileAttente[req.body.iduser.toString()].stock && fileAttente[req.body.iduser.toString()].facture){
                var panier = await LigneCommande.findOne({ where : {idpanier : fileAttente[req.body.iduser.toString()].idpanier}})
                panier.livraison = 2
                await panier.save()
            }else{
                console.log("Facturer ou Stock est faux")
                var panier = await LigneCommande.findOne({ where : {idpanier : fileAttente[req.body.iduser.toString()].idpanier}})
                panier.livraison = 0
                await panier.save()
            }
            setTimeout(async ()=>{
        
                fileAttente[req.body.iduser.toString()] = null
        
            },10000)
        }).catch((err)=>{
            console.log('impossible de joindre le serveur stock pour décrémenter', err)
        })
        axios({
            method : 'POST',
            url : `${conf.hostOptions.serverBanque}:${conf.portOptions.serverBanque}/facturer`,
            data : {cart : req.body.cart, iduser : req.body.iduser, facturer : fileAttente[req.body.iduser.toString()].stock && fileAttente[req.body.iduser.toString()].facture, prix : req.body.prix},
            headers : {"Content-Type": "application/x-www-form-urlencoded"}
        }).then(async (data)=>{
            if(fileAttente[req.body.iduser.toString()] && fileAttente[req.body.iduser.toString()].stock && fileAttente[req.body.iduser.toString()].facture){
                var panier = await LigneCommande.findOne({ where : {idpanier : fileAttente[req.body.iduser.toString()].idpanier}})
                panier.livraison = 2
                await panier.save()
            }else{
                console.log("Facturer ou Stock est faux")
                var panier = await LigneCommande.findOne({ where : {idpanier : fileAttente[req.body.iduser.toString()].idpanier}})
                panier.livraison = 0
                await panier.save()
            }
            setTimeout(async ()=>{
        
                fileAttente[req.body.iduser.toString()] = null
        
            },10000)
            console.log('Ok')
        }).catch((err)=>{
            console.log('impossible de joindre le serveur Banque facturer', err)
            
        })
        

    }
    else{
        fileAttente[req.body.iduser.toString()]= {facture : req.body.facture}
        console.log(fileAttente)
    }
    res.json({command : 'Ok'})
})