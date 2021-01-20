const { Sequelize, Op, Model, DataTypes, HasOne } = require("sequelize");
const conf = require('./config')
const {user, database, host, port, password } = {...conf.dbOptions}

const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'postgres'
});
(async function(){
    try {
        await sequelize.authenticate()
        sequelize.sync()
        console.log('Connexion établie avec succes');
    } catch (error) {
        console.error(`Impossible de se connecter à la base de donnée ${database}` , error)
    }
})()

const User = sequelize.define('User',{
    iduser : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    username: {
        type : DataTypes.STRING,
        allowNull : false,

    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    actived : {
        type : DataTypes.BOOLEAN,
        allowNull : false
    },
    admin : {
        type : DataTypes.BOOLEAN,
        allowNull : false
    },
    client : {
        type : DataTypes.INTEGER,
        allowNull : true
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false
    }
}, {tableName : 'utilisateur', createdAt:false, updatedAt : false})

const Categorie = sequelize.define('Categorie',{
    idcategorie : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull : false
    },
    nomcategorie : {
        type : DataTypes.STRING
    },
    description : {
        type : DataTypes.TEXT
    },
    photo : {
        type : DataTypes.STRING,
    }
}, {tableName : 'categorie', createdAt:false, updatedAt:false})

const Produit = sequelize.define('Produit',{
    idproduit : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull : false
    },
    designation : {
        type : DataTypes.STRING
    },
    description : {
        type : DataTypes.TEXT
    },
    prix : {
        type : DataTypes.DOUBLE
    },
    quantite : {
        type : DataTypes.INTEGER
    },
    selectionne : {
        type : DataTypes.BOOLEAN
    },
    photo : {
        type : DataTypes.STRING,
    },
    categorie :{
        type : DataTypes.INTEGER,
        references : {
            model : Categorie,
            key : 'id'
        }
    }
}, {tableName : 'produit', createdAt:false, updatedAt:false})

const Panier = sequelize.define('Panier',
    {
        idpanier : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
            allowNull : false
        },
        client : {
            type : DataTypes.INTEGER,
            references : {
                model : User,
                key : 'id'
            }
        }
}, {tableName : 'panier', createdAt:false, updatedAt:false})

const LigneCommande = sequelize.define('LigneCommande',
{
    idlignecommande : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull : false
    },
    prix : {
        type : DataTypes.DOUBLE
    },
    quantite : {
        type : DataTypes.INTEGER
    },
    produit : {
        type : DataTypes.INTEGER,
        references : {
            model : Produit,
            key : 'id'
        }
    },
    idpanier : {
        type : DataTypes.INTEGER,
        references : {
            model : Panier,
            key : 'id'
        }
    },
    livraison : {
        type : DataTypes.INTEGER
    }
}, {tableName : 'lignecommande', createdAt:false, updatedAt:false})

const Banque = sequelize.define('Banque',{
    idbanque : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull : false
    },
    solde : {
        type : DataTypes.DOUBLE
    },
    client : {
        type : DataTypes.INTEGER,
        references :{
            model : User,
            key : 'id'
        }
    }
}, {tableName : 'banque', createdAt:false, updatedAt:false})

Categorie.hasMany(Produit, {
    foreignKey : 'categorie'
})
Produit.belongsTo(Categorie, {
    foreignKey : 'categorie'
})
Panier.hasMany(LigneCommande,{
    foreignKey : 'idpanier'
})
LigneCommande.belongsTo(Panier, {
    foreignKey : 'idpanier'
})

LigneCommande.belongsTo(Produit, {
    foreignKey : 'produit'
})

User.hasOne(Banque, {
    foreignKey : 'client',
})

Banque.belongsTo(User, {
    foreignKey : 'client'
})



module.exports = {Banque ,User, Categorie, Produit, LigneCommande, Panier, sequelize}