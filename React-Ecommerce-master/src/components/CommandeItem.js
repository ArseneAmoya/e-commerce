import React from "react";

const CommandeItem = props => {
  const { product } = props;
  return (
    <div className=" column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <img
                src={require(`../../public/images/${product.Produit.photo}`)}
                alt={product.Produit.description}
              />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {product.Produit.designation}{" "}
              <span className="tag is-primary">{product.Produit.prix * product.quantite}</span>
            </b>
            <div>{product.description}</div>
            {product.quantite > 0 ? (
              <small>{product.quantite + " Commandé"}</small>
            ) : (
              <small className="has-text-danger">Hors de stock</small>
            )}
            <div className="is-clearfix">
              {product.livraison === 1 ? ('Verification des infos banq'): (product.livraison === 0 ? 'echec ou anulation' :  (product.livraison === 2 ? 'En cours de livraison': null))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandeItem;
