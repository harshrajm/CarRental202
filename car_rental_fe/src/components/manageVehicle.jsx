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

  handleReload = async () => {
    const { data: vehicles } = await getVehicles();
    this.setState({ vehicles });
  };

  dispatchEditVehicle = v => {
    //alert("dispatchEditVehicle");
    //console.log(v);
    const vehicleToEdit = { ...v };
    this.setState({ vehicleToEdit });
    this.props.history.replace("/admin/vehicle/edit");
  };

  render() {
    const { vehicles } = this.state;
    return (
      <React.Fragment>
        <Switch>
          {/* <Route
            path="/admin/vehicle/add"
            component={VehicleForm}
            
          /> */}
          <Route
            path="/admin/vehicle/add"
            render={props => (
              <VehicleForm {...props} onReload={this.handleReload} />
            )}
          />
          <Route
            path="/admin/vehicle/edit"
            render={props => (
              <VehicleForm
                {...props}
                onReload={this.handleReload}
                vehicleToEdit={this.state.vehicleToEdit}
              />
            )}
          />
          <Route
            path="/admin/vehicle/"
            render={props => (
              <VehiclesTable
                {...props}
                vehicles={this.state.vehicles}
                onGoToEditVehicle={this.dispatchEditVehicle}
              />
            )}
          />
        </Switch>
      </React.Fragment>
    );
  }
}

export default ManageVehicle;
