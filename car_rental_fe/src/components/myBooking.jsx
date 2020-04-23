import React, { Component } from "react";
import { getBookings } from "../services/backendCallService";
import BookingCard from "./common/bookingCard";
import Modal from "react-modal";
import moment from "moment";
import Rating from "react-rating";

class MyBooking extends Component {
  state = {
    showModal: false,
    data: { rating: 0, bookingId: "", condition: "", feedback: "" }
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  async componentDidMount() {
    const { data: bookings } = await getBookings();
    this.setState({ bookings });
    //console.log(bookings);
  }

  handleEndTripClick = id => {
    //alert("id " + id);
    const selectedBooking = this.state.bookings.filter(b => {
      return b._id == id;
    });
    const data = { ...this.state.data };
    data["bookingId"] = id;

    this.setState({ data, selected: selectedBooking[0], showModal: true });
  };
  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  handleChangeRating = value => {
    const data = { ...this.state.data };
    data["rating"] = value;
    this.setState({ data });
  };
  handleSubmit = async e => {
    e.preventDefault();
    alert("form submitted");
    //console.log("form submitted!!", this.state.data);
    //call backend
    try {
      const { data } = this.state;
      //backend call
      //update state with new list
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log("400 error");
      }
    }
  };
  render() {
    Modal.setAppElement("#root");
    return (
      <React.Fragment>
        <h1>My Bookings!</h1>
        {this.state.bookings &&
          this.state.bookings.map(b => (
            <BookingCard
              key={b._id}
              bookingsDtls={b}
              onEndTripClicked={this.handleEndTripClick}
            />
          ))}

        <Modal
          //ariaHideApp={false}
          isOpen={this.state.showModal}
          contentLabel="Minimal Modal Example"
        >
          <button
            onClick={this.handleCloseModal}
            className="btn btn-light float-right"
          >
            x
          </button>
          <br />
          <br />
          {this.state.selected && (
            <div className="row justify-content-center">
              <div className="col-3">
                <div className="card">
                  <div className=" thumbnail text-center">
                    <img
                      src={this.state.selected.vehicleObject.vehicleImageURL}
                      className="card-img"
                      max-width="100%"
                      height="180px"
                      alt="car"
                    />
                    <div className="imgBadge">
                      <span className="badge badge-secondary">
                        {this.state.selected.vehicleObject.type}
                      </span>
                    </div>
                    <div className="caption">
                      <h2>
                        <strong>
                          {this.state.selected.vehicleObject.registrationTag}
                        </strong>
                      </h2>
                    </div>
                  </div>

                  <div className="card-body">
                    <h5 className="card-title">
                      {this.state.selected.vehicleObject.manufacturer +
                        " " +
                        this.state.selected.vehicleObject.name}
                    </h5>
                    <span className="badge badge-light">
                      Checkout :{" "}
                      {moment(this.state.selected.checkOut).format(
                        "ddd MMM DD HH:mm"
                      )}
                    </span>

                    <br />
                    <span className="badge badge-light">
                      Expected return :{" "}
                      {moment(this.state.selected.expectedCheckin).format(
                        "ddd MMM DD HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-7">
                <form onSubmit={this.handleSubmit}>
                  <h3>Overall Rating</h3>
                  <Rating
                    onChange={this.handleChangeRating}
                    placeholderRating={this.state.data.rating}
                  />

                  <hr />
                  <label>Feedback about Vehicle and rental service</label>
                  <textarea
                    name="feedback"
                    onChange={this.handleChange}
                    className="form-control"
                    rows="3"
                    required
                    placeholder="Enter feedback"
                  ></textarea>
                  <br />
                  <label>
                    Anything we need to know about vehicle return condition?
                  </label>
                  <textarea
                    name="condition"
                    onChange={this.handleChange}
                    className="form-control"
                    rows="3"
                    required
                    placeholder="eg. cracked windshield"
                  ></textarea>
                  <br />
                  <button type="submit" className="btn btn-danger">
                    End Trip
                  </button>
                </form>
              </div>
            </div>
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

export default MyBooking;
