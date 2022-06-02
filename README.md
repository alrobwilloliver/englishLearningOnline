# englishLearningOnline user journey
Online English Courses website - express node.js mongoBD backend.

You can view some of the classes I have created here at:

https://ailearningonline.herokuapp.com

1. In order to view some of the classes I recorded for students, please sign up with a username, email and password. You can login in the future with your username
and password so remember your username!
2. In order to view some classes I currently only have university classes available, so hover on my university course and click "Buy Now!". 
3. You don't have to use real money. I am only using stripe in test mode for demonstration purposes. 
4. Enter 4242 4242 4242 4242 as the fake card number and a future expiry date to buy the course.
5. Navigate to your user profile in the top right of your screen. Click "My Courses" and you should see my university course.
6. Enjoy!

# Developer notes
Use yarn to install all dependencies.

To view the website with limited functionality locally you should comment out the database connection in server.js:16 or connect to your own mongo db.

In order to make and view scss changes run:
"yarn watch:sass"

To run in development:
"yarn start"

To run in production:
"yarn start:prod"
