import http from "./httpService";
import { apiUrl } from "../config.json";

export function getLocation() {
  return http.get(apiUrl + "/locations");
}

export function postNewLocation(body) {
  return http.post(apiUrl + "/location", body);
}
export function getLocationOne(queryString) {
  return http.get(apiUrl + "/locationone?" + queryString);
}
export function updateLocation(body) {
  return http.post(apiUrl + "/updateLocation", body);
}
export function deleteOneUser(body) {
  return http.post(apiUrl + "/user_delete", body);
}

export function getVehicles(queryString) {
  return http.get(apiUrl + "/vehicles?" + queryString);
}

export function postNewBooking(queryString) {
  return http.post(apiUrl + "/booking?" + queryString);
}

export function getBookings() {
  return http.get(apiUrl + "/bookings");
}

export function postReturnVehicle(queryString, body) {
  return http.post(apiUrl + "/return?" + queryString, body);
}

export function cancelBooking(bookingId) {
  return http.delete(apiUrl + "/booking?bookingId=" + bookingId);
}

export function getUser() {
  return http.get(apiUrl + "/user");
}

export function extendMembership() {
  return http.post(apiUrl + "/user/membership");
}

export function getUserList() {
  return http.get(apiUrl + "/admin/manageUsers");
}

export function getAlternateVehicles(queryString) {
  return http.get(apiUrl + "/suggest/vehicles?" + queryString);
}

export function addVehicle(data) {
  return http.post(apiUrl + "/vehicle", data);
}
export function editVehicle(data, registrationTag) {
  return http.put(apiUrl + "/vehicle?registrationTag=" + registrationTag, data);
}

export function deleteUser(data) {
  console.log("in deleteUser " + apiUrl + "/user");
  return http.delete(apiUrl + "/user", data);
}

export function deleteLocation(id) {
  return http.delete(apiUrl + "/location/?name=" + id);
}

export function getMembershipFee() {
  return http.get(apiUrl + "/membershipFee");
}

export function updateMembershipfee(body) {
  return http.post(apiUrl + "/feechange", body);
}

export function getAllActiveBookings() {
  return http.get(apiUrl + "/admin/activebookings");
}

export function getAllCompletedBookings() {
  return http.get(apiUrl + "/admin/completedbookings");
}
