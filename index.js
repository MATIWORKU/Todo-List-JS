import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "@mit:1347",
  port: 5432
})

db.connect();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// for handling current user posts
let currentUserId = 1;

// to store users data from database
let users = [];

// to store users todo items from database
let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

// For displaying the different dueDates available
let titles = []

// for getting queries based on due dates
let due_date = "";


async function getUsers(){
  const result = await db.query("SELECT * FROM users"); // query the users database
  users = result.rows;
}

async function getDueDate(){ // query for the all available due dates and only use the unique ones.
  const result = await db.query("SELECT due_date FROM items"); 
  const data = result.rows
  const key = 'due_date';
  titles = [ ... new Map(
    data.map(
      item => [item[key], item]
    )
  ).values() // for creating a new array consisting of only unique non duplicated datas
];
}


app.get("/", async (req, res) => {
  
  const defaultDueDate = "today"; // Default due_date if none is selected
  due_date = due_date || defaultDueDate;

  const result = await db.query(
    "SELECT * FROM items WHERE user_id = $1 AND due_date = $2;", 
    [currentUserId, due_date]
  );

  items = result.rows;
  await getUsers(); // call function to get the users and the dueDates.
  await getDueDate();
  res.render("index.ejs", {
    listTitle: titles,
    listItems: items,
    users: users,
    due_date: due_date,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // const dueDate = req.body.due_date || due_date; // Capture due_date from the form set as a hidden input
  // console.log(req.body);
  // console.log("Adding item with due_date:", dueDate); // use if due_date is not being consistent throughout the paths
  if(item){
    await db.query(
      "INSERT INTO items (title, user_id, due_date) VALUES ($1, $2, $3);", 
      [item, currentUserId, due_date]
    );
  }else{
    console.log("You can't enter an empty task"); 
  }
  res.redirect("/");
});

app.post("/user", async (req, res) => {
  if(req.body.add){
    res.render("new.ejs"); 
  }else{
    currentUserId = parseInt(req.body.user);
    res.redirect("/");
  }
})

// set the due date base on the input from the frontend
app.post("/title", async (req, res) => {
  const dueDateArray = req.body.due_date;
  if (Array.isArray(dueDateArray) && dueDateArray.length > 0) { // if req.body is returning an array rather than a string
    due_date = dueDateArray[0].trim(); // Access the first element and trim any whitespace
  }else{
    due_date = req.body.due_date;
  }
  console.log("Selected due_date:", due_date); // Log to confirm
  res.redirect("/");
})

// create new user
app.post("/new", async (req, res) => { 
  const result = await db.query(
    "insert into users (name, color) values ($1, $2) returning *;",
    [req.body.name, req.body.color]
  );
  currentUserId = result.rows[0].id;
  res.redirect("/");
})

app.post("/edit", async (req, res) => {
  const id = parseInt(req.body.updatedItemId);
  const title = req.body.updatedItemTitle || items.find((item) => item.id == id);
  await db.query("UPDATE items SET title = $1 WHERE id = $2", [title, id]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = parseInt(req.body.deleteItemId);
  await db.query("DELETE FROM items WHERE id = $1", [id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
