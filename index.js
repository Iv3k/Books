import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(express.static('public'));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Books",
  password: "2109",
  port: 5432,
});

db.connect();

// Show results from database to the frontend page
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT name, surname, title, about_book FROM author JOIN book ON book.author_id = author.id");

    result.rows.forEach(row => {
    const authorName = row.name;
    const authorSurname = row.surname;
    const bookTitle = row.title;
    const bookDescription = row.about_book;

    res.render("index.ejs", {
        bookTitle: bookTitle,
        bookAuthor: authorName + " " + authorSurname,
        bookText: bookDescription
    });

    // Do something with the variables
    console.log(`Column 1: ${authorName}, \nColumn 2: ${authorSurname}, \nColumn 3: ${bookTitle}`);
  });
  } 
  catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
