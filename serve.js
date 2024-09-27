const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
// note: The following option is NECESSARY in order to parse the form 
// data successfully.
app.use(express.urlencoded({ extended: true }));
app.use(express.static('js'));
app.use(express.static('css'));

// db setup
const sqlite3 = require("sqlite3").verbose();
const database = new sqlite3.Database('todos.sqlite3');

database.exec(`
    CREATE TABLE IF NOT EXISTS todos(
        id TEXT PRIMARY KEY,
        title TEXT,
        todo TEXT ,
        status TEXT
    ) 
    `)

const insert = database.prepare('INSERT INTO todos (id, title, todo, status) VALUES (?, ?, ?, ?)')
const query = database.prepare('SELECT * FROM todos ORDER BY id');
const del = database.prepare('DELETE FROM todos WHERE id=?')
const mark = database.prepare('UPDATE todos SET status="done" WHERE id=?')

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/about.html");
});

app.post("/todoSubmit", (req, res) => {
  const todo = req.body.todo;
  const title = req.body.todotitle
  res.send({
    msg: "received todo data successfully!",
    todo: todo,
    title: title
  });
  console.log(todo);
});

app.post("/addToDb", (req, res) => {
    const id = req.body.id;
    const todo = req.body.todo;
    const title = req.body.title;
    const status = req.body.status;
    console.log(id,title, todo, status);
    insert.run(id, title, todo, status);
    res.send({
        msg: "Added to the local DB successfully!"
    });
})

app.post("/deleteFromDb", (req, res) => {
    const id = req.body.id;
    del.run(id);
})

app.post("/markDone", (req, res) => {
    const id = req.body.id;
    mark.run(id);
})



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
