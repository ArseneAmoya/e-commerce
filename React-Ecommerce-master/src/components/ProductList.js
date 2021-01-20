import React, {useEffect, useState} from "react";
import ProductItem from "./ProductItem";
import withContext from "../withContext";
import queryString from 'query-string';
import axios from 'axios'


const ProductList = props => {
  const [products, setProduct] = useState([])
  const [cat, setCat] = useState({})

  useEffect(()=>{ async function a(){
    const {location} = props
    const queries = queryString.parse(location.search)
    const {idcategorie} = queries
    await axios.get(`http://localhost:4000/categories/${idcategorie}`).then(({data})=>{
      if(data){
        try {
          setProduct(data[0].Produits)
          setCat(data[0])
        } catch (error) {
          setProduct(data.Produits)
          setCat(data)
        }
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
          <h4 className="title">Categorie {cat.nomcategorie}</h4>
        </div>
      </div>
      <br />
      <div className="container">
        <div className="column columns is-multiline">
          {products && products.length ? (
            products.map((product, index) => (
              <ProductItem
                product={product}
                key={index}
                addToCart={props.context.addToCart}
              />
            ))
          ) : (
            <div className="column">
              <span className="title has-text-grey-light">
                No products found!
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withContext(ProductList);
