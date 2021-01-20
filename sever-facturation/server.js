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


app.listen(conf.portOptions.serverFacturation,()=>{
    console.log("express stock server is listening on port", conf.portOptions.serverFacturation)
})

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use(express.static(__dirname))

app.get('/', (req, res)=>{
    res.json({message : `Hello i m the stock server i run on port : ${conf.portOptions.serverFacturation}`})
})


.post('/commande', async (req, res)=>{
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

    var cart = req.body.cart
    console.log(cart)
    var cartKeys = Object.keys(cart)
    var prix  = 0
    for(cartKey in cartKeys){
        prix = prix + cart[cartKeys[cartKey]].amount * cart[cartKeys[cartKey]].product.prix
        console.log('prix', prix)        
    }
    var user = await User.findAndCountAll({
        where : {iduser : req.body.iduser},
        include : Banque
    })
    if(user.count < 1 ){
        axios({
            method : 'POST',
            url : `${conf.hostOptions.serverBanque}:${conf.portOptions.serverBanque}/facture`,
            data : {cart : req.body.cart, iduser : req.body.iduser, compte : false,},
            headers : {"Content-Type": "application/x-www-form-urlencoded"}
        }).then((data)=>{
            console.log('Ok')
        }).catch((err)=>{
            console.log('impossible de joindre le serveur Banque pour vérifier les données', err)
        })
    }
    else{
        axios({
            method : 'POST',
            url : `${conf.hostOptions.serverBanque}:${conf.portOptions.serverBanque}/facture`,
            data : {cart : req.body.cart, iduser : req.body.iduser, compte : true, banque : user.temp, prix : prix},
            headers : {"Content-Type": "application/x-www-form-urlencoded"}
        }).then(({data})=>{
            axios({
                method : 'POST',
                url : `${conf.hostOptions.serverClientele}:${conf.portOptions.serverClientele}/facture`,
                data : {cart : req.body.cart, iduser : req.body.iduser,facture: data.facture, prix : prix},
                headers : {"Content-Type": "application/x-www-form-urlencoded"}
            }).then(({data})=>{
                console.log('Tout est Ok avec la facture', data)
            }).catch((err)=>{
                console.log('impossible de joindre le serveur Clientèle pour procéder à une facturation', err)
            })
        }).catch((err)=>{
            console.log('impossible de joindre le serveur Banque pour vérifier les données', err)
        })
    }
    res.json({commande : true});
})