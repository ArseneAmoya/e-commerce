import React from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

const CategorieItem = props => {
    const {categorie} = props
    
    return (     
      <Link to = {{
        pathname: "/products",
        search: queryString.stringify(categorie),
      }}
      className="column is-half"
      >
        <div className="box">
          <div className="media">
            <div className="media-left">
              <figure className="image is-64x64">
                <img
                  src={require(`../../public/images/${categorie.photo}`)}
                  alt={categorie.description}
                />
              </figure>
            </div>
            <div className="media-content">
              <b style={{ textTransform: "capitalize" }}>
                {categorie.name}{" "}
              </b>
              <div>{categorie.description}</div>
            </div>
          </div>
        </div>
      </Link>
    );
  };
  
  export default CategorieItem;
  