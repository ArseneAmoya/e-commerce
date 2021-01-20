var path = require("path")
var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var axios = require("axios")
var sha256 = require("sha256")
var axios = require('axios')
const {User, Produit, Categorie, LigneCommande, Panier} = require('./model')
const { config } = require("process")
var conf = require('./config')
const debug = require('express-debug')

app.listen(4000,()=>{
    console.log("express web server is listening on port 4000")
})
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use(express.static(__dirname))

app.get('/', (req, res)=>{
    res.json({message : 'Hello i m the web server i run on port 4000'})
})

app.get('/categories',async (req, res)=>{
    res.set("Access-Control-Allow-Origin", "*")
    res.set("Access-Control-Allow-Credentials", "true")
    res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,cle_api")

    var resp = await Categorie.findAll()
    res.json(resp)
})
.get('/categories/:idcategorie',async (req, res)=>{
    res.set("Access-Control-Allow-Origin", "*")
    res.set("Access-Control-Allow-Credentials", "true")
    res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,cle_api")
    if(!req.params.idcategorie || req.params.idcategorie === 'undefined'){
        res.status(401).send({message : 'Pas de categories definies'})
        return
    }
    var resp = await Categorie.findAll({
        where : {
            idcategorie : req.params.idcategorie
        }, 
        include : Produit
    })
    res.json(resp)
})

    .get('/produit/:idproduit', (req, res)=>{
    res.json({message : 'Vous etes dans les détails du produit n ...'})
})
    .get('/produit',async (req, res)=>{
        res.set("Access-Control-Allow-Origin", "*")
        res.set("Access-Control-Allow-Credentials", "true")
        res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
        res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,cle_api")

        var resp = await Produit.findAll()
        res.json(resp)
})

    .post('/login',async (req,res)=>{

        res.set("Access-Control-Allow-Origin", "*")
        res.set("Access-Control-Allow-Credentials", "true")
        res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
        res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,cle_api")


        try {
            
            req.body = JSON.parse(Object.keys(req.body)) 
        } catch (error) {
            console.log(error)
        }
        var email = req.body.email
        var pass = sha256(req.body.password)
        var resp = await User.findAll({
            where : {
                email : email,
                password : pass
            }
        })
        if(resp){
            res.status(200).json(resp)
        }
        else{
            res.status(401).json({message : 'Votre compte n\'existe pas'})
        }
})

.get('/commandes/:iduser', async (req, res)=>{
    res.set("Access-Control-Allow-Origin", "*")
    res.set("Access-Control-Allow-Credentials", "true")
    res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,cle_api")    
    
    if(req.params.iduser === 'undefined' || !req.params.iduser){
        res.status(401).json({message : 'mauvais id'})
        return
    }
    var temp = await Panier.findAll({
        attributes : ['idpanier'],
        where : {
            client : req.params.iduser
        },
    })
    var tab = []
    temp.forEach(element => {
        tab.push(element.idpanier)
    });
    var temps =await LigneCommande.findAll({
        where : {idpanier : tab},
        include : Produit
    })
    res.json(temps)

})


.post('/commande', async (req, res)=>{
    res.set("Access-Control-Allow-Origin", "*")
    res.set("Access-Control-Allow-Credentials", "true")
    res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,cle_api")
    
    res.set("Access-Control-Allow-Origin", "*")
    res.set("Access-Control-Allow-Credentials", "true")
    res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,cle_api")
    res.set('Content-Type','applicaton/json')
    try {        
        req.body = JSON.parse(Object.keys(req.body)) 
    } catch (error) {
        console.log(error)
    }
    console.log('body', req.body)
    var a = false
    var b = false
    axios({
        method : 'POST',
        url : `${conf.hostOptions.serverStock}:${conf.portOptions.serverStock}/commande`,
        data : {iduser: req.body.iduser, cart : req.body.cart},
        headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
        timeout : 5000,
    }).then(({data})=>{
        a = data.commande
        console.log(a)
    }).catch(err=>{
        console.log('impossible de joindre le serveur de stock', err)
    })

    axios({
        method : 'POST',
        url : `${conf.hostOptions.serverFacturation}:${conf.portOptions.serverFacturation}/commande`,
        data : {iduser: req.body.iduser, cart : req.body.cart},
        headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
        timeout : 5000,
    }).then(({data})=>{
        b = data.commande
        console.log(b)
    }).catch(err=>{
        console.log("impossible de joindre le serveur de facturation")
    })
    setTimeout(()=>{
        res.json({message : a && b})
    }, [4000])
    
})

debug(app, {})