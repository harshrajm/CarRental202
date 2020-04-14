import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import BookingComponent from "./components/bookingComponent";
import NavBar from "./components/navBar";
import NotFound from "./components/notFound";
import RegisterForm from "./components/registerForm";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import auth from "./services/authService";
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    return (
      <React.Fragment>
        <NavBar />
        {/* <button className="btn btn-primary">showing button</button> */}
        <div className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/book" component={BookingComponent} />
            {/* <Route path="/myBookings" component={MyBookingsComponent} /> */}
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/book" />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
