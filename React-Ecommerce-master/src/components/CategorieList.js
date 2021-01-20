import React, {useEffect, useState} from "react";
import CategorieItem from "./CategorieItem";
import withContext from "../withContext";
import axios from "axios";
import { Redirect } from "react-router-dom";

const ProductList = props => {
    const [categories, setCategories]  = useState([]);
    useEffect(()=>{
        async function fetchCat(){
            axios.get('http://localhost:4000/categories').then(({data})=>{
                setCategories(data)
            })
        }
        fetchCat()   
    },[])

  return (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">Différentes catégories</h4>
        </div>
      </div>
      <br />
      <div className="container">
        <div className="column columns is-multiline">
          {categories && categories.length ? (
            categories.map((categorie, index) => (
              <CategorieItem
                categorie={categorie}
                key={index}
                onClick = {()=>{alert('Heyyyy'); console.log(props);}}
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
