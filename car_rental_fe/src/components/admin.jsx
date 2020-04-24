import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import AdminHome from "./adminHome";
import ManageLocation from "./manageLocation";
import { Route, Redirect, Switch } from "react-router-dom";
import ManageVehicle from "./manageVehicle";
import ManageUsers from "./manageUsers";
class AdminDashboard extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <div className="row mt-5">
          <div className="col-3">
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
                <NavLink className="nav-link" to="/admin/location">
                  Manage Locations
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/vehicle">
                  Manage Vehicles
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link " to="/admin/manageUsers">
                  Manage Users
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-9">
            <Switch>
              <Route
                path="/admin/home"
                render={props => (
                  <AdminHome {...props} user={this.props.user} />
                )}
              />
              <Route
                path="/admin/location"
                render={props => (
                  <ManageLocation {...props} user={this.props.user} />
                )}
              />
              <Route
                path="/admin/vehicle"
                render={props => (
                  <ManageVehicle {...props} user={this.props.user} />
                )}
              />
              <Route
                path="/admin/manageUsers"
                render={props => (
                  <ManageUsers {...props} user={this.props.user} />
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
