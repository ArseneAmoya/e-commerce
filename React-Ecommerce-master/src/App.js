import React, { Component } from "react";
import { Switch, Route, Redirect, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';
import AddProduct from './components/AddProduct';
import Cart from './components/Cart';
import Login from './components/Login';
import ProductList from './components/ProductList';
import CategorieList from './components/CategorieList';
import CommandeList from './components/CommandeList';

import Context from "./Context";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cart: {},
      products: [],
      categorie : {}
    };
    this.routerRef = React.createRef();
  }

  async componentDidMount() {
    let user = localStorage.getItem("user");
    let cart = localStorage.getItem("cart");

    const products = await axios.get('http://localhost:4000/produit');
    user = user ? JSON.parse(user) : null;
    cart = cart? JSON.parse(cart) : {};

    this.setState({ user,  products: products.data, cart });
  }

  login = async (email, password) => {
    const res = await axios({
      method : 'POST',
      url: 'http://localhost:4000/login',
      data : { email, password },
      headers: { "Content-Type": "application/x-www-form-urlencoded", },
    }).catch((res) => {
      return { status: 401, message: 'Unauthorized' }
    })

    if(res.status === 200) {
      try {
        res.data = res.data[0]
      } catch (error) {
        console.log('error', error)
      }
      const user = {
        id : res.data.iduser,
        email : res.data.email,
        accessLevel: !res.data.admin && res.data.client
      }
      console.log('res :', res)
      this.setState({ user });
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } else {
      return false;
    }
  }

  logout = e => {
    e.preventDefault();
    this.setState({ user: null });
    localStorage.removeItem("user");
  };

  addProduct = (product, callback) => {
    let products = this.state.products.slice();
    products.push(product);
    this.setState({ products }, () => callback && callback());
  };
  setCategorie = async catId =>{
    await axios.get(`http://localhost:4000/categories/${catId}`).then(({data})=>{
      this.setState({categorie : data})
      console.log('setcat')
    })
  } 

  addToCart = cartItem => {
    let cart = this.state.cart;
    if (cart[cartItem.id]) {
      cart[cartItem.id].amount += cartItem.amount;
    } else {
      cart[cartItem.id] = cartItem;
    }
    if (cart[cartItem.id].amount > cart[cartItem.id].product.stock) {
      cart[cartItem.id].amount = cart[cartItem.id].product.stock;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log('cart is', cart)
    this.setState({ cart });
  };

  removeFromCart = cartItemId => {
    let cart = this.state.cart;
    delete cart[cartItemId];
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  clearCart = () => {
    let cart = {};
    localStorage.removeItem("cart");
    this.setState({ cart });
  };
  handleShowCat = ()=>{
    alert("redirecting")
    return <Redirect to = '/products'/>
  }

  checkout = () => {
    if (!this.state.user) {
      this.routerRef.current.history.push("/login");
      return;
    }

    const cart = this.state.cart;
    const id = this.state.user.id;
    console.log('userid is',id)
    console.log('state is', this.state)
      axios({
        method : 'POST',
        url : `http://localhost:4000/commande`,
        data : {iduser : id, cart : cart },
        timeout : 12000,
        headers : { "Content-Type": "application/x-www-form-urlencoded", },
      }).then(({data})=>{
        console.log(data)
        if(data.message){
          this.clearCart();
          this.routerRef.current.history.push("/commandes")
        }
      })
  };

  render() { 
    return (
      <Context.Provider
        value={{
          ...this.state,
          removeFromCart: this.removeFromCart,
          addToCart: this.addToCart,
          login: this.login,
          addProduct: this.addProduct,
          clearCart: this.clearCart,
          checkout: this.checkout,
          setCategorie: this.setCategorie
        }}
      >
        <Router ref={this.routerRef}>
        <div className="App">
          <nav
            className="navbar container"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <b className="navbar-item is-size-4 ">ecommerce</b>
              <label
                role="button"
                class="navbar-burger burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                onClick={e => {
                  e.preventDefault();
                  this.setState({ showMenu: !this.state.showMenu });
                }}
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </label>
            </div>
              <div className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}>
                <Link to="/categorie" className="navbar-item">
                  Categories
                </Link>
                {this.state.user && this.state.user.accessLevel < 1 && (
                  <Link to="/add-product" className="navbar-item">
                    Ajouter produit
                  </Link>
                )}
                <Link to="/cart" className="navbar-item">
                  Panier
                  <span
                    className="tag is-primary"
                    style={{ marginLeft: "5px" }}
                  >
                    { Object.keys(this.state.cart).length }
                  </span>
                </Link>
                <Link to="/commandes" className="navbar-item">
                  Commandes
                </Link>
                {!this.state.user ? (
                  <Link to="/login" className="navbar-item">
                    Login
                  </Link>
                ) : (
                  <Link to="/" onClick={this.logout} className="navbar-item">
                    Logout
                  </Link>
                )}
              </div>
            </nav>
            <Switch>
              <Route exact path="/" component={CategorieList} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/add-product" component={AddProduct} />
              <Route exact path="/products" component={ProductList} />
              <Route exact path= "/categorie" component={CategorieList} />
              <Route exact path= "/commandes" component={CommandeList} />
            </Switch>
          </div>
        </Router>
      </Context.Provider>
    );
  }
}
