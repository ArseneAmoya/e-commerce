import React from "react";

const ProductItem = props => {
  const { product } = props;
  return (
    <div className=" column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <img
                src={require(`../../public/images/${product.photo}`)}
                alt={product.description}
              />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {product.designation}{" "}
              <span className="tag is-primary">{product.prix}Fcfa</span>
            </b>
            <div>{product.description}</div>
            {product.quantite > 0 ? (
              <small>{product.quantite + " Available"}</small>
            ) : (
              <small className="has-text-danger">Hors de stock</small>
            )}
            <div className="is-clearfix">
              <button
                className="button is-small is-outlined is-primary   is-pulled-right"
                onClick={() =>
                  props.addToCart({
                    id: product.designation,
                    product,
                    amount: 1
                  })
                }
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
