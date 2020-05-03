import React, { Component } from "react";
import { getVehicles } from "../services/backendCallService";
import VehiclesTable from "./common/vehiclesTable";
import { Route, Redirect, Switch } from "react-router-dom";
import VehicleForm from "./vehicleForm";
import { Link } from "react-router-dom";

class ManageVehicle extends Component {
  state = { vehicles: [] };
  async componentDidMount() {
    const { data: vehicles } = await getVehicles();
    this.setState({ vehicles });
  }
  render() {
    const { vehicles } = this.state;
    return (
      <React.Fragment>
        <Switch>
          <Route path="/admin/vehicle/add" component={VehicleForm} />
          <Route
            path="/admin/vehicle/"
            render={vehicles => (
              <VehiclesTable vehicles={this.state.vehicles} />
            )}
          />
        </Switch>
      </React.Fragment>
    );
  }
}

export default ManageVehicle;
