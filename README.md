Family To-Do List Tracker
This is a Node.js and Express-based to-do list application that allows multiple users to maintain and categorize their tasks by due dates, organized into today, this week, and this month. The app also supports task editing, deleting, and dynamically manages users in a family or group context.

Table of Contents
Features
Screenshots
Installation
Usage
Endpoints
Folder Structure
Technologies Used
License

Features
Multiple users can be managed within the app.
Each user can categorize tasks by due date (today, this week, this month).
Allows CRUD operations for tasks (Create, Read, Update, Delete).
Task categories update dynamically.
Simple UI to select users and manage tasks.

Screenshots
![image](https://github.com/user-attachments/assets/1e110367-6343-4c9b-8d95-1fbb862f77da)


Installation
Prerequisites
Node.js and npm: Make sure you have Node.js and npm installed. Download Node.js here.
PostgreSQL: Install and configure PostgreSQL. This app connects to a PostgreSQL database to store data.

Steps

Clone the Repository:

bash
Copy code
git clone https://github.com/MATIWORKU/Todo-List-JS.git
cd TODO List

Install Dependencies:

bash
Copy code
npm install
Configure Database: Create a PostgreSQL database, and add tables for users and items. Update the database configuration in index.js to match your local PostgreSQL setup:

js
Copy code
const db = new pg.Client({
  user: "your_pg_user",
  host: "localhost",
  database: "permalist",
  password: "your_pg_password",
  port: 5432
});

Run Database Migrations: Set up the tables for the users and items:

sql
Copy code
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  color VARCHAR(50)
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  user_id INTEGER REFERENCES users(id),
  due_date VARCHAR(20)
);

Start the Server:

bash
Copy code
npm start
Access the Application: Open your web browser and navigate to http://localhost:3000.

Usage
User Selection: Select a user from the list to view or add tasks.
Add Tasks: Add a new task with a title and assign a due date category (e.g., today, this week, or this month).
Edit Tasks: Click on the pencil icon to edit an existing task.
Delete Tasks: Mark the checkbox next to a task to delete it.


Endpoints
GET /: Main endpoint to display tasks for the selected user and due date.
POST /add: Adds a new task with a title and due date.
POST /delete: Deletes a task.
POST /edit: Updates the title of an existing task.
POST /title: Sets the current due date filter.
POST /user: Sets the current user or allows adding a new user.
POST /new: Creates a new user with a name and color.


Folder Structure
php
Copy code
family-todo-list-tracker
│
├── views
│   ├── index.ejs              # Main template
│   ├── new.ejs                # New user form template
│   └── partials
│       ├── header.ejs         # Header partial
│       └── footer.ejs         # Footer partial
│
├── public
│   ├── styles
│   │   └── main.css           # Main stylesheet
│   └── assets
│       └── icons              # Icon assets for edit/delete actions
│
├── index.js                   # Main server file
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation


Technologies Used
Node.js: JavaScript runtime.
Express.js: Web application framework.
EJS: Templating engine.
PostgreSQL: Relational database.
CSS: Styling for the front-end.


License
This project is licensed under the MIT License.
