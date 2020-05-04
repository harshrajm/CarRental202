import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { deleteOneUser } from "../services/backendCallService";
const User = props => (
  <tr>
    <td>{props.user.name}</td>
    <td>{props.user.username}</td>
    <td>{props.user.email}</td>
    <td>{props.user.membershipActive.toString()}</td>
    <td>
      <button onClick={() => { props.deleteUser(props.user.email) }}>terminate</button>
    </td>
  </tr>
)

export default class ManageUsers extends Component {
  constructor(props) {
    super(props);

    this.deleteUser = this.deleteUser.bind(this)

    this.state = {user: []};
  }

  componentDidMount() {
    axios.get('http://localhost:8080/admin/manageUsers')
      .then(response => {
        this.setState({ user: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  deleteUser = async email => {
    var q = {email:email};
    var data = await deleteOneUser(q);
    this.setState({
      user: this.state.user.filter(el => el.email !== email)
    })
  }
  
  userList() {
    return this.state.user.map(item => {
      return <User user={item} deleteUser={this.deleteUser} key={item.email}/>;
    })
  }

  render() {
    return (
      <div>
        <h3>Manage Users</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Membership Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { this.userList() }
          </tbody>
        </table>
      </div>
    )
  }
}