import React from "react";

const CartItem = props => {
  const { cartItem, cartKey } = props;

  const { product, amount } = cartItem;
  console.log(product)
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
              <span className="tag is-primary">{product.prix} Fcfa</span>
            </b>
            <div>{product.description}</div>
            <small>{`${amount} dans le panier`}</small>
          </div>
          <div
            className="media-right"
            onClick={() => props.removeFromCart(cartKey)}
          >
            <span className="delete is-large"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
