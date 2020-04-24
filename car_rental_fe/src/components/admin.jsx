import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import AdminHome from "./adminHome";
import AddLocation from "./addLocation";
import { Route, Redirect, Switch } from "react-router-dom";
import AddVehicle from "./addVehicle";
import RemoveUsers from "./removeUsers";
class AdminDashboard extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <div className="row mt-5">
          <div className="col-2">
            <ul
              className="nav flex-column nav-pills"
              aria-orientation="vertical"
            >
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/home">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/addLocation">
                  Add Location
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/addVehicle">
                  Add Vehicle
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link " to="/admin/removeUsers">
                  Remove Users
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-10">
            <Switch>
              <Route
                path="/admin/home"
                render={props => (
                  <AdminHome {...props} user={this.props.user} />
                )}
              />
              <Route
                path="/admin/addLocation"
                render={props => (
                  <AddLocation {...props} user={this.props.user} />
                )}
              />
              <Route
                path="/admin/addVehicle"
                render={props => (
                  <AddVehicle {...props} user={this.props.user} />
                )}
              />
              <Route
                path="/admin/removeUsers"
                render={props => (
                  <RemoveUsers {...props} user={this.props.user} />
                )}
              />
              <Redirect from="/admin" exact to="/admin/home" />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminDashboard;
