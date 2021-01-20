import React, {useEffect, useState} from "react";
import CommandeItem from "./CommandeItem";
import withContext from "../withContext";
import queryString from 'query-string';
import axios from 'axios'


const CommandeList = props => {
  const [products, setProduct] = useState([])
  console.log(props.context)

  useEffect(()=>{ async function a(){
    console.log(props)
    let user = JSON.parse(localStorage.getItem("user"))
    console.log('user id', user.id)
    await axios.get(`http://localhost:4000/commandes/${user.id}`).then(({data})=>{
      if(data){
          setProduct(data)
      }
      
      console.log(data)
    })

  }
  a()
},[])
  return (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">Produits commandés</h4>
        </div>
      </div>
      <br />
      <div className="container">
        <div className="column columns is-multiline">
          {products && products.length ? (
            products.map((product, index) => (
              <CommandeItem
                product={product}
                key={index}
                addToCart={props.context.addToCart}
              />
            ))
          ) : (
            <div className="column">
              <span className="title has-text-grey-light">
                Pas de commandes effectuées
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withContext(CommandeList);
