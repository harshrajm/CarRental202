import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import CarBooking from "./components/carBooking";
import NavBar from "./components/navBar";
import NotFound from "./components/notFound";
import RegisterForm from "./components/registerForm";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import MyBooking from "./components/myBooking";
import auth from "./services/authService";
import "./App.css";
import MyProfile from "./components/myProfile";
import AdminDashboard from "./components/admin";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ViewAllVehicles from "./components/viewAllVehicles";
import EditLocation from "./components/editLocation";
import CreateLocation from "./components/createLocation";

class App extends Component {
  state = {};

  static getDerivedStateFromProps(props, state) {
    const user = auth.getCurrentUser();
    return { user };
  }

  // componentDidMount() {
  //   const user = auth.getCurrentUser();
  //   this.setState({ user });
  // }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />

        <NavBar user={user} />
        {/* <button className="btn btn-primary">showing button</button> */}
        <div className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            {(!user || (user && !user.isAdmin)) && (
              <Route
                path="/book"
                render={props => <CarBooking {...props} user={user} />}
              />
            )}
            <Route
              path="/viewAllVehicles"
              render={props => <ViewAllVehicles {...props} user={user} />}
            />

            <Route
              path="/myBookings"
              render={props => <MyBooking {...props} user={user} />}
            />

            <Route
              path="/profile"
              render={props => <MyProfile {...props} user={user} />}
            />

            {user && user.isAdmin && (
              <Route
                path="/admin"
                render={props => <AdminDashboard {...props} user={user} />}
              />
            )}
            <Route
              path="/createlocation"
              render={props => <CreateLocation {...props} user={user} />}
            />

            <Route path="/edit/:name" component={EditLocation} />
            <Route path="/not-found" component={NotFound} />
            {user && user.isAdmin ? (
              <Redirect from="/" exact to="/admin" />
            ) : (
              <Redirect from="/" exact to="/book" />
            )}
            {/* <Redirect from="/" exact to="/book" /> */}
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
