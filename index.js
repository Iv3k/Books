import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

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
    const result = await db.query("SELECT name, surname, title, about_book, rating, key FROM author JOIN book ON book.author_id = author.id");

    const img = await axios.get("https://bored-api.appbrewery.com/random");

    result.rows.forEach(row => {
    const authorName = row.name;
    const authorSurname = row.surname;
    const bookTitle = row.title;
    const bookDescription = row.about_book;
    const bookRating = row.rating;
    const bookKey = row.key;

    res.render("index.ejs", {
        bookTitle: bookTitle,
        bookAuthor: authorName + " " + authorSurname,
        bookRating: bookRating,
        bookText: bookDescription
    });

    // Do something with the variables
    console.log(`ISBN : ${bookKey}`);
  });
  } 
  catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
