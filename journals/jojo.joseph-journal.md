# Weekly Scrum Report
What tasks did I work on / complete?
What am I planning to work on next?
What tasks are blocked waiting on another team member?

5/8/2020
--------
Added rest api endpoints for admin to view completed and upcoming bookings.
Deployed the front end code in heroku. Created docker images for backend code and deployed it in ec2 autoscaling group behind a load balancer.

4/28/2020
---------
Added final rate calculations based on dates / number of hours used. This rate is shown to the user as an estimate.
The final rate is applied when the car is returned using the return endpoint and the late fees is added, if any.

Issues with timezone is fixed by using moment js. It converts the ISO date tme stored in mongo to local timezone equivalent.
Embedded details about location and car used inside booking object to avoid multiple queries / rest calls from MyBookings page.

Need to add ratings for booking experience. Also need to implement suggest cars endpoint.

4/21/2020
---------
Fixed issues with backend code. Enabled CORS. Fixed issues with date data.
Added search cars endpoint. Prevented duplicate entries for locations.

Need to implement suggest cars endpoint. Need to add rate calculation endpoint.

4/14/2020
---------
Implemented endpoints for vehicles crud operations. User crud operation.
Changed sessions to jwt token. Created endpoints for booking and return.
Need to create endpoint for search and to suggest similar vehciles in other location.

No blockers

4/7/2020
--------
Implemented basic rest endpoints for login, register user, admin access, 
and user deletion. Used sessions for session management.

Need to change sessions to jwt tokens as per Harshraj's request.
In a load balanced environment, sessions will need sticky sessions enabled in Load balancer.
Need to add other endpoints for inventory access and management.
Will need to help whoever is working on UI to integrate currently working endpoints.

No blockers

3/31/2020
---------
Broke down user stories to tasks which need to be worked on.
Added backends tasks to Kanban board for tracking.
Created new branch backend-code for backend code work.

Planning to work on user login and registration endpoints for the next week.
If possible work on other endpoints as well.

No blockers

Facilitated discussion on which tasks to work on for the next sprint. 
Made sure everyone got a say in the task distribution.

3/24/2020
---------
Created starter code for server-side using express
Created user stories from the pdf available.

Planning to create basic endpoints for server-side
Planning to breakdown user stories into tasks which can be assigned via project board
Need to setup some continuos integration / basic sanity test for server-sidea

No blockers

Communicated the tasks to be done clearly to other team members. Had productive and open discussion in scrum meetings.

# XP Core Values
Communication

Made sure the communication during scrum meetings is clear and open. Facilitated an environment encouraging discussions and feedback.
