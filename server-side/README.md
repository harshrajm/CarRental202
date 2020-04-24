Server side code is written as an express app.

ENDPOINTS
---------
1. /login - POST - To login users. Expected parameters in request body : username, password.
	           On succesful login, redirects to /
		   On failure, simply reloads /login GET
2. /register - POST - To register new users. Expected parameters in JSON request body : 
		      username, name, email, address, creditCard, licenseState, licenseNumber
                      email is used to find if user already exists.
                      Need to also add check for username.
                      If register succesfully, 200 response with message "User registered"
                      On failure, 400 response with message
3. /admin_dashboard - GET - Only users with admin role can access this.
4. /user - GET - returns the currently logged in users object
5. /logout - GET - clears the current session and redirects to login.

User membership
---------------
```
  endpoint : /user/membership
  request type : POST
  query parameters : none
  body :   none
  return : 200 membership extended
           500 user update failed
           404 user not found
```

```
  endpoint : /user
  request type : DELETE
  query parameters : none
  body : email
  return : 200 user deleted
           status 500 user delete failed
           status 404 user not found
```

Vehicle endpoints
-------------------
```
  endpoint : /vehicle
  request type : GET
  query parameters : registrationTag
  return : Returns a single vehicle object
           status 400 if query param missing
           status 404 if vehcile not found
```

```
   endpoint : /vehicle
   request type : POST  
   query parameters : none
   reqeuest body json : registrationTag, location, type, name, manufacturer, mileage, modelYear
              lastService, vehicleImageURL, condition, baseRate, hourlyRate ([array])
   return : Returns the vehicle object saved
            status 400 if
            1. location doesn't exist
            2. location is in full capacity
            3. location does not exist
            Check the body of the return to identify the reason
```

```
   endpoint : /vehicle
   request type : DELETE
   query parameters : registrationTag
   request body json : none
   return :  200 vehicle deleted 
             400 if registrationTag is missing
             404 if vehcile not found
```
	    
```
   endpoint : /vehicle
   request type : PUT
   query parameters : registrationTag 
   request body json : location, type, name, manufacturer, mileage, modelYear
              lastService, vehicleImageURL, condition, baseRate, hourlyRate ([array])
   return :  200 and returns the updated object
             400 if
             1. registrationTag is missing
             2. The new location is full
             3. New location does not exist
             500 server error if old locaiton is not found(Won't possibly happen)
```    

```
   endpoint : /locations
   request type : GET
   query parameters : none
   request body json : none
   return :  Returns all the locations objects in db
             404 if no locaiton exists
```

```
   endpoint : /location
   request type : GET
   query parameters : name 
   request body json : none
   return :  Returns vehicles in a location
             400 if missing name field
             404 if no cars exist
```
Location endpoints
------------------	 
```
   endpoint : /location
   request type : POST
   query parameters : none
   request body json : name, address, vehicleCapacity
   return :  200 and Location saved
             400 If location name already exists
```

```
   endpoint : /location
   request type : DELETE
   query parameters : name
   request body json : none
   return : 200 location deleted
            404 location not found
            400 name missing
            500 delete failed
``` 
Bookings endpoints
------------------
```
   endpoint : /bookings
   request type : GET
   query parameters : none
   request body json : none
   return :  200 returns the current users bookings which would be json array
```
  
```
   endpoint : /booking
   request type : GET
   query parameters : bookingId 
   request body json : none
   return : 200 booking object
            404 no such booking
```
	   
```
   endpoint : /booking
   request type : POST
   query parameters : registrationTag, checkOut, expectedCheckin
   request body json : none
   return : 200 bookingId
            400 vehicle not available at this time
            404 vehicle does not exist
            500 server error
```

```
   endpoint : /booking
   request type : PUT
   query parameters : bookingId 
   request body json : isActive, checkOut, expectedCheckin, actualCheckin, feedback, complaints, paid
   return : 200 updated booking object
            400 missing bookingId parameter
            404 booking not found
```
  
```
   endpoint : /booking
   request type : DELETE
   query parameters : bookingId
   request body json : none
   return : We check if the time is 1 hour within the booking start time.
            If yes we return 405 status with "Booking must be cancelled atleast one hour before"
            Otherwise
            200 booking cancelled
            405 booking already started if booking already started
            405 booking is not active
            404 booking not found
```

```
   endpoint : /return
   request type : POST
   query parameters : bookingId
   request body json : none
   return : 200 booking object
            400 bookingId parameter missing
            500 vehicle does not exist
            405 booking has not started
            405 booking is not active
            404 booking not found
```

Search endpoints
----------------
```
   endpoint : /vehicles
   request type : GET
   query parameters : All are optional 
                      location, type, manufacturer, condition, checkOut, expectedCheckin 
   request body json : none 
   return :  Array of vehicle objects available	
```
  

Setup instructions
------------------
1. Install npm and node
2. At this directory, run "npm install" command -- It will fetch the required packages and dependencies(express)
3. To run the app, do "node app.js"

NOTE
----
Do not push or try to push node_modules folder. I have added a .gitignore so that it is avoided.
Any packages you install will be reflected in package.json and others will get the changes from there.
