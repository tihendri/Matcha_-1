# Matcha
Matcha is a website that allows users to find each other using geolocation and common interests. These users can then talk to each other and meet up if they want to. Users can look at each others profiles and see what the user like etc. It is a lot like Tinder.
# Requirements
* HTML
* CSS
* EJS
* JavaScript
* NodeJs
* Express
* Socket.io
* MAMP
* MySQL

# Application setup steps:
1. Install the Bitnami MAMP/LAMP/WAMP stack.

2. Clone the projects repository in a folder

3. In the projects folder run npm install in your terminal, this will install all the required dependencies as well as generate a package.lock file which is the tree representation of all your dependencies

4. Configure your MySQL database to use the following credentials initially
#### User:root Password:matcha123

##### Remember to change these credentials to make the database more secure

5. Start the projects NodeJs server by navigating to the projects folder in the terminal and typing npm start.

6. Now that the server is running we need to create the database create the database by running http://localhost:8014/createDatabase in your browsers search bar.

7. To create the database tables run http://localhost:8014/createTable in your browsers search bar.

8. Run http://localhost:8014 in your browsers search bar to start using the website.

9. Register a new user and verify your registration via email.

10. Login and enjoy the website.
# Architecture
1. functions, contains the validation file and the insert file that insert the user into the database.

2. images, contains all the images that are used on the website e.g the logo.

3. layout, contains the css file.

4. public, contains all the socket.io files.

5. routes, contains all the routes for the router e.g "/register".

6. views, contains all the frontend files that the user sees.

7. app.js, contains all server information.

8. config.js, contains the host, the port and database login information

# Testing
These are the test that we executed with their expected outcomes:
##### 1. Test
Start web server
##### Expected outcome
Web server starts and you can locate website at http://localhost:8014
##### 2. Test
Create an account
##### Expected outcome
You are able to register a new user
##### 3. Test
Login
##### Expected outcome
You are able to log in with your new account
##### 4. Test
Edit profile
##### Expected outcome
You should be able to edit your profile
##### 5. Test
View profile suggestions
##### Expected outcome
You should be able to view suggested profiles
##### 6. Test
Search / Filter
##### Expected outcome
You should be able to search and filter profiles
##### 7. Test
Geolocation
##### Expected outcome
Geolocation should be a feature
##### 8. Test
Popularity Rating
##### Expected outcome
People should have popularity ratings
##### 9. Test
Notifications
##### Expected outcome
You should be able to receive notifications
##### 10. Test
View a profile
##### Expected outcome
You should be able to view a profile
##### 11. Test
Like / Unlike user
##### Expected outcome
You should be able to like and unlike a user
##### 12. Test
Block
##### Expected outcome
You should be able to block a user
##### 13. Test
Messaging
##### Expected outcome
You should be able to chat with a user you liked ,but only if they liked you back.
