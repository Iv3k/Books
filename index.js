import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;
const apiUrl = "https://covers.openlibrary.org/b/isbn/";
const sizeOfImg = "-S.jpg";

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

    result.rows.forEach(async row => {
    const authorName = row.name;
    const authorSurname = row.surname;
    const bookTitle = row.title;
    const bookDescription = row.about_book;
    const bookRating = row.rating;
    const bookKey = row.key;

    const response = await axios.get("https://covers.openlibrary.org/b/isbn/" + bookKey + "-S.jpg");
    
    res.render("index.ejs", {
        bookTitle: bookTitle,
        bookAuthor: authorName + " " + authorSurname,
        bookRating: bookRating,
        bookText: bookDescription,
        bookImage: apiUrl + bookKey + sizeOfImg
    });

    // Do something with the variables
    console.log(`ISBN : ${apiUrl + bookKey + sizeOfImg}`);
  });
  } 
  catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
