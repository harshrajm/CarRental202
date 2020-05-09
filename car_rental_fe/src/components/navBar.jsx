import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

class NavBar extends Component {
  render() {
    const { user } = this.props;

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
        <Link className="navbar-brand" to="/">
          <img
            src="https://nextcarrental.com/smsite/npauto_3/media/imgs/21948_loader.gif"
            width="30"
            height="30"
            class="d-inline-block align-top"
            alt=""
          />
          Car Rental
        </Link>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {(!user || (user && !user.isAdmin)) && (
              <NavLink className="nav-item nav-link" to="/book">
                Book a vehicle
              </NavLink>
            )}
            {/* <NavLink className="nav-item nav-link" to="/viewAllVehicles">
              View all vehicles
            </NavLink> */}
            {user && !user.isAdmin && (
              <NavLink className="nav-item nav-link" to="/myBookings">
                My Bookings
              </NavLink>
            )}

            {user && user.isAdmin && (
              <NavLink className="nav-item nav-link" to="/admin">
                Admin Dashboard
              </NavLink>
            )}
            {user && user.isAdmin && (
              <NavLink className="nav-item nav-link" to="/adminBookings/active">
                Active Bookings
              </NavLink>
            )}
            {user && user.isAdmin && (
              <NavLink
                className="nav-item nav-link"
                to="/adminBookings/completed"
              >
                Completed Bookings
              </NavLink>
            )}
            {user && user.isAdmin && (
              <NavLink className="nav-item nav-link" to="/viewAllVehicles">
                View All Vehicles
              </NavLink>
            )}

            {user && !user.isAdmin && (
              <NavLink className="nav-item nav-link" to="/profile">
                My Profile
              </NavLink>
            )}
          </div>
        </div>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarCollapse"
        >
          <div className="navbar-nav">
            {!user && (
              <React.Fragment>
                <NavLink className="nav-item nav-link" to="/login">
                  Login
                </NavLink>
                <NavLink className="nav-item nav-link" to="/register">
                  Register
                </NavLink>
              </React.Fragment>
            )}

            {user && (
              <NavLink className="nav-item nav-link " to="/logout">
                Logout
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
