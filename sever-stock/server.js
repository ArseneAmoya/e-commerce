var path = require("path")
var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var axios = require("axios")
var sha256 = require("sha256")
var axios = require('axios')
const conf = require('../sever-web/config')
const {User, Produit, Categorie, sequelize, LigneCommande, Panier} =  require('../sever-web/model')
const { Sequelize, Op, Model, DataTypes, HasOne } = require("sequelize");

app.listen(conf.portOptions.serverStock,()=>{
    console.log("express stock server is listening on port", conf.portOptions.serverStock)
})

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use(express.static(__dirname))

app.get('/', (req, res)=>{
    res.json({message : `Hello i m the stock server i run on port : ${conf.portOptions.serverStock}`})
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
    console.log(req.body)
    var cartKeys = Object.keys(cart)
    const t = await sequelize.transaction()
    const panier = await Panier.create({client : req.body.iduser}, {transaction :t})
    console.log('panier',panier)
    var cart = req.body.cart
    console.log(cart)
    var cartKeys = Object.keys(cart)
    var prix  = 0
    for(cartKey in cartKeys){
        prix = prix + cart[cartKeys[cartKey]].amount * cart[cartKeys[cartKey]].product.prix
        console.log('prix', prix)        
    }
    for(cartKey in cartKeys){
        console.log(cart[cartKeys[cartKey]])
        var temp = await Produit.findAndCountAll({
            where : {
                [Op.and] : [{idproduit : cart[cartKeys[cartKey]].product.idproduit}, {quantite : {[Op.gte] : cart[cartKeys[cartKey]].amount} }]
                
            }
        })
        const lignecommande = await LigneCommande.create({
            quantite : cart[cartKeys[cartKey]].amount, 
            prix : cart[cartKeys[cartKey]].product.prix,
            produit : cart[cartKeys[cartKey]].product.idproduit,
            livraison : 1,
            idpanier : panier.idpanier
        },{transaction : t})
        console.log('commande',lignecommande)
        console.log(temp)
        if(!temp || temp.count === 0){
            res.json({commande : false})
            t.rollback()
            axios({
                method : 'POST',
                url : `${conf.hostOptions.serverClientele}:${conf.portOptions.serverClientele}/validcommande`,
                body : {cart : req.body.cart, iduser : req.body.iduser, validstock : false, prix :prix, idpanier : panier.idpanier},
                headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
            })
            return
        }
    }
    t.commit()
    axios({
        method : 'POST',
        url : `${conf.hostOptions.serverClientele}:${conf.portOptions.serverClientele}/validcommande`,
        data : {cart : req.body.cart, iduser : req.body.iduser, validstock : true,  prix : prix, idpanier : panier.idpanier},
        headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
    }).then(()=>{
        res.json({commande : true})      
    }).catch((err)=>{
        console.log('impossible de joindre le serveur clientèle',err)
        res.json({commande : false})
    })
})

.post('/decrStock', async (req, res)=>{
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
    var cart = req.body.cart
    console.log(cart)
    var cartKeys = Object.keys(cart)
    var prix  = 0
    for(cartKey in cartKeys){
        var produit = Produit.findOne({
            where: { idproduit : cart[cartKeys[cartKey]].product.idproduit}
        })
        produit.quantite = produit.quantite - cart[cartKeys[cartKey]].amount
        await produit.save()
        console.log('prix', prix)        
    }
    res.json({message : Ok});
})