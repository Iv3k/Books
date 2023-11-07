import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

const apiUrl = "https://covers.openlibrary.org/b/isbn/";
const sizeOfImg = "-M.jpg";

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

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

    const books = result.rows.map(async row => {
      const authorName = row.name;
      const authorSurname = row.surname;
      const bookTitle = row.title;
      const bookDescription = row.about_book;
      const bookRating = row.rating;
      const bookKey = row.key;

      return {
        bookTitle: bookTitle,
        bookAuthor: authorName + " " + authorSurname,
        bookRating: bookRating,
        bookText: bookDescription,
        bookImage: apiUrl + bookKey + sizeOfImg
      };
    });

    // Wait for all the promises to resolve
    const booksData = await Promise.all(books);

    res.render("index.ejs", { booksData });
  } 
  catch (err) {
    console.log(err);
  }
});

// Insert values into the database from the form
app.post("/addBook", async (req, res) =>{
    const { title, author, rating, description, isbn } = req.body;

    const [name, surname] = author.split(' ');

    // Check if the author already exists
    const existingAuthor = await db.query(
        'SELECT id FROM author WHERE name = $1 AND surname = $2',
        [name, surname]
    );

    let authorId;

    if (existingAuthor.rows.length > 0) {
        // Use the existing author
        authorId = existingAuthor.rows[0].id;
    } else {
        // Insert into the author table if the author doesn't exist
        const newAuthor = await db.query(
            'INSERT INTO author (name, surname) VALUES ($1, $2) RETURNING id',
            [name, surname]
        );

        authorId = newAuthor.rows[0].id;
    }
    // Inserting to book table
    await db.query("INSERT INTO book (title, rating, author_id, about_book, key) VALUES ($1, $2, $3, $4, $5)",
                    [title, rating, authorId, description, isbn]);

    res.redirect("/");
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
