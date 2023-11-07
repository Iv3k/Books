import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Books",
  password: "2109",
  port: 5432,
});

db.connect();







app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
