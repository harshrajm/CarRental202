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

Setup instructions
------------------
1. Install npm and node
2. At this directory, run "npm install" command -- It will fetch the required packages and dependencies(express)
3. To run the app, do "node app.js"

NOTE
----
Do not push or try to push node_modules folder. I have added a .gitignore so that it is avoided.
Any packages you install will be reflected in package.json and others will get the changes from there.
