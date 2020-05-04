import React, { Component } from "react";
import { Link,Redirect } from "react-router-dom";
import { postNewLocation } from "../services/backendCallService";

class CreateLocation extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '',address:'',vehicleCapacity:0, redirect:false};

    this.handleCreate = this.handleCreate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
     handleInputChange(event) {
      const target = event.target;
      const value = target.value ;
      const name = target.name;
      this.setState({
        [name]: value    
      });
    }
    handleCreate = async e =>{
       e.preventDefault();
    if(this.state.address === ''){
      alert('Address is invalid.');
    }else if(this.state.name === ''){
      alert('Name is invalid.');
    }else{
      const data = this.state;
      console.log(data);
      try {
        //backend call
        await postNewLocation(data);
        alert('Location saved');
        this.setState({redirect:true});
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          alert("This location name already exists");
        }
      }
    }


  }
  render() {
    return (
      <React.Fragment>
      {this.state.redirect ? <Redirect to="/admin/location"  /> : ''}
        <h3>Create Location</h3>
        <form>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-control" placeholder="Name" onKeyUp={this.handleInputChange} name="name"/>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" className="form-control" placeholder="Address" onKeyUp={this.handleInputChange} name="address"/>
          </div>
          <div className="form-group">
            <label>Vehicle Capacity</label>
            <input type="Number" className="form-control" placeholder="Vehicle Capacity" onKeyUp={this.handleInputChange} name="vehicleCapacity"/>
          </div>
          <button type="submit" className="btn btn-primary" onClick={this.handleCreate}>Create</button>
        </form>
        
        
      </React.Fragment>
    );
  }
}

export default CreateLocation;
