const express = require("express");
const session = require("express-session");
const mysql = require("mysql2");
const app = express();
const PORT = process.env.PORT || 3000;

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Create MySQL connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "kartik",
  database: "tukdyadas",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Set up session middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 50000 }, // Session duration (50 seconds)
  })
);

// Middleware to count visits
app.use((req, res, next) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  next();
});

// Home page route
app.get("/", (req, res) => {
  const query = "SELECT * FROM daily_posts ORDER BY updated_at DESC LIMIT 1";
  db.query(query, (err, results) => {
    if (err) {
      console.log("Error fetching daily post:", err);
      return res.send("Error fetching daily post");
    }
    const post = results.length > 0 ? results[0] : null;
    // Pass the post data and visitor count to the EJS view
    res.render("index", { post });
  });
});



app.get("/sampark", (req, res) => {
  res.render("sampark");
});

app.get("/photos", (req, res) => {
  const photos = [
    "/images/ph1.jpg",
    "/images/ph2.jpg",
    "/images/ph3.jpg",
    "/images/ph4.jpg",
    "/images/ph5.jpg",
    "/images/ph6.jpg",
    "/images/ph7.jpg",
    "/images/ph8.jpg",
    "/images/ph9.jpg",
    "/images/ph10.jpg",
    "/images/ph11.jpg",
    "/images/ph12.jpg",
    "/images/ph13.jpg",
    "/images/ph14.jpg",
    "/images/ph15.jpg",
    "/images/ph16.jpg",
    "/images/ph17.jpg",
    "/images/ph18.jpg",
    "/images/ph19.jpg",
    "/images/ph20.jpg",
    "/images/ph21.jpg",
    "/images/ph22.jpg",
    "/images/ph23.jpg",
    "/images/ph24.jpg",

    // Add more photo paths here
  ];
  res.render("photos", { photos });
});

// app.get("/photos", (req, res) => {
//   const query = "SELECT * FROM photos"; // Fetch all photos from the database

//   db.query(query, (err, results) => {
//       if (err) {
//           console.log("Error fetching photos:", err);
//           return res.send("Error fetching photos");
//       }
//       res.render("photos", { photos: results }); // Pass photos to the view
//   });
// });

app.get("/timeline", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3; // Number of posts per page
  const offset = (page - 1) * limit;

  // Query to get total number of posts
  const countQuery = "SELECT COUNT(*) as total FROM daily_posts";

  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.log("Error counting posts:", err);
      return res.send("Error counting posts");
    }

    const totalPosts = countResult[0].total;
    const totalPages = Math.ceil(totalPosts / limit);

    // Query to fetch posts for the current page
    const query =
      "SELECT * FROM daily_posts ORDER BY updated_at DESC LIMIT ? OFFSET ?";

    db.query(query, [limit, offset], (err, results) => {
      if (err) {
        console.log("Error fetching posts:", err);
        return res.send("Error fetching posts");
      }

      res.render("timeline", {
        posts: results,
        currentPage: page,
        totalPages: totalPages,
      });
    });
  });
});

// Define the Gramgeeta page route (fetch all Adhyays from the database)
app.get("/gramgeeta", (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const countQuery = "SELECT COUNT(*) AS total FROM gramgeeta";
  const query = `SELECT id, gramgeeta_title FROM gramgeeta LIMIT ${limit} OFFSET ${offset}`;

  db.query(countQuery, (err, countResults) => {
    if (err) {
      console.log("Error fetching Adhyay count:", err);
      return res.send("Error fetching Adhyay count");
    }

    const totalAdhyay = countResults[0].total;
    const totalPages = Math.ceil(totalAdhyay / limit);

    db.query(query, (err, results) => {
      if (err) {
        console.log("Error fetching Adhyay list:", err);
        return res.send("Error fetching Adhyay list");
      }
      res.render("gramgeeta", { adhyayList: results, page, totalPages });
    });
  });
});





// Route for individual Adhyay pages
app.get("/gramgeeta/:id", (req, res) => {
  const adhyayId = req.params.id;
  const query = "SELECT * FROM gramgeeta WHERE id = ?"; // The missing 'query' was added here

  db.query(query, [adhyayId], (err, result) => {
    if (err) {
      console.log("Error retrieving Adhyay:", err);
      return res.send("Error retrieving data");
    }

    if (result.length === 0) {
      return res.send("Adhyay not found");
    }

    const adhyay = result[0]; // Assuming query returns a single row
    res.render("adhyay", { adhyay });
  });
});

app.get("/bhajan", (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 25;
  const offset = (page - 1) * limit;

  const countQuery =
    'SELECT COUNT(*) AS total FROM bhajans WHERE TRIM(title) IS NOT NULL AND TRIM(title) != "" AND TRIM(bhajan) IS NOT NULL AND TRIM(bhajan) != ""';
  const query = `SELECT * FROM bhajans WHERE TRIM(title) IS NOT NULL AND TRIM(title) != "" AND TRIM(bhajan) IS NOT NULL AND TRIM(bhajan) != "" ORDER BY title ASC LIMIT ${limit} OFFSET ${offset}`;

  db.query(countQuery, (err, countResults) => {
    if (err) {
      console.log("Error fetching Bhajan count:", err);
      return res.send("Error fetching Bhajan count");
    }

    const totalBhajans = countResults[0].total;
    const totalPages = Math.ceil(totalBhajans / limit);

    db.query(query, (err, results) => {
      if (err) {
        console.log("Error fetching Bhajan list:", err);
        return res.send("Error fetching Bhajan list");
      }
      res.render("bhajan", { bhajans: results, page, totalPages });
    });
  });
});

// Bhajan detail page route (show full Bhajan)
app.get("/bhajan/:id", (req, res) => {
  const bhajanId = req.params.id;
  const query = "SELECT * FROM bhajans WHERE id = ?";

  db.query(query, [bhajanId], (err, result) => {
    if (err) {
      console.log("Error fetching Bhajan:", err);
      return res.send("Error fetching Bhajan");
    }

    if (result.length === 0) {
      return res.send("Bhajan not found");
    }

    // Render the Bhajan detail page with the full Bhajan content
    const bhajan = result[0];
    res.render("bhajan_detail", { bhajan });
  });
});



// Route to display list of books (from tab table) on Sahitya page
app.get("/sahitya", (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const countQuery = "SELECT COUNT(*) AS total FROM tab";
  const query = `SELECT id, title FROM tab LIMIT ${limit} OFFSET ${offset}`;

  db.query(countQuery, (err, countResults) => {
    if (err) {
      console.log("Error fetching book count:", err);
      return res.send("Error fetching book count");
    }

    const totalBooks = countResults[0].total;
    const totalPages = Math.ceil(totalBooks / limit);

    db.query(query, (err, results) => {
      if (err) {
        console.log("Error fetching book list:", err);
        return res.send("Error fetching book list");
      }
      res.render("sahitya", { books: results, page, totalPages });
    });
  });
});

// Route to display content of the selected book (from tab_books table)
// app.get('/sahitya/:id', (req, res) => {
//     const bookId = req.params.id; // Get the book ID from the URL
//     const query = 'SELECT * FROM tab_books WHERE tab_id = ?'; // Fetch the content from tab_books based on the book ID

//     db.query(query, [bookId], (err, results) => {
//         if (err) {
//             console.log('Error fetching book content:', err);
//             return res.send('Error fetching book content');
//         }

//         if (results.length === 0) {
//             return res.send('No content found for this book');
//         }

//         // Render the book details page with the content of the selected book
//         res.render('book_details', { bookContent: results });
//     });
// });

/// Define the Sahitya page route
// Define the Sahitya page route
app.get("/new-sahitya", (req, res) => {
  // Sample data for books
  const books = [
    { id: 1, title: "साहित्य पुस्तक 1" },
    { id: 2, title: "साहित्य पुस्तक 2" },
    { id: 3, title: "साहित्य पुस्तक 3" },
  ];
  res.render("newSahitya", { books }); // Rendering the newSahitya.ejs template
});

app.get("/books", (req, res) => {
  // Sample list of books (you can replace this with database data)
  const books = [
    { name: "Book One" },
    { name: "Book Two" },
    { name: "Book Three" },
    { name: "Book Four" },
  ];

  res.render("books", { books }); // Render 'books.ejs' with the books data
});

app.get("/sahitya", (req, res) => {
  const query = "SELECT * FROM tab"; // Assuming tab table contains book names

  db.query(query, (err, results) => {
    if (err) {
      console.log("Error fetching Sahitya list:", err);
      return res.send("Error fetching Sahitya list");
    }

    res.render("sahitya", { books: results });
  });
});


// Route to display Bhajans by specific book
// Route to display list of Bhajans in a specific book
app.get("/bhajan-books/:bookId", (req, res) => {
  const bookId = req.params.bookId;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 25;
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) AS total FROM bhajans WHERE book_id = ?`;
  const query = `
    SELECT id, title
    FROM bhajans
    WHERE book_id = ?
    ORDER BY title ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

  db.query(countQuery, [bookId], (err, countResults) => {
    if (err) {
      console.log("Error fetching Bhajans count:", err);
      return res.send("Error fetching Bhajans count");
    }

    const totalBhajans = countResults[0].total;
    const totalPages = Math.ceil(totalBhajans / limit);

    db.query(query, [bookId], (err, results) => {
      if (err) {
        console.log("Error fetching Bhajans for book:", err);
        return res.send("Error fetching Bhajans");
      }

      res.render("bhajan_list", {
        bhajans: results,
        bookId,
        page,
        totalPages,
      });
    });
  });
});


// const { transliterate } = require('transliteration');

// // Route to handle search requests
// app.get('/search', (req, res) => {
//     let searchQuery = req.query.query || ''; // Get search query from user input

//     // Transliterate the input (assuming the input might be in phonetic English)
//     let transliteratedQuery = transliterate(searchQuery);

//     // Construct SQL queries to search for bhajans, sahitya, and gramgeeta
//     const query = `
//         SELECT 'bhajan' AS type, title, id
//         FROM bhajans
//         WHERE LOWER(TRIM(title)) LIKE LOWER(TRIM('%${transliteratedQuery}%'))
//         UNION
//         SELECT 'sahitya' AS type, title, id
//         FROM tab
//         WHERE LOWER(TRIM(title)) LIKE LOWER(TRIM('%${transliteratedQuery}%'))
//         UNION
//         SELECT 'gramgeeta' AS type, title, id
//         FROM gramgeeta
//         WHERE LOWER(TRIM(title)) LIKE LOWER(TRIM('%${transliteratedQuery}%'))
//     `;

//     db.query(query, (err, results) => {
//         if (err) {
//             console.log('Error fetching search results:', err);
//             return res.send('Error fetching search results');
//         }

//         // Render the results in the search_results.ejs view
//         res.render('search_results', { results });
//     });
// });

app.get("/search", (req, res) => {
  const searchTerm = req.query.query || "";
  if (!searchTerm) {
    return res.send("No search term provided");
  }

  const searchQuery = `
      SELECT 'bhajan' AS type, title, id 
      FROM bhajans 
      WHERE LOWER(TRIM(title)) LIKE LOWER(TRIM('%${searchTerm}%'))
  `;

  db.query(searchQuery, (err, results) => {
    if (err) {
      console.log("Error executing search query:", err);
      return res.send("Error executing search");
    }

    console.log("Search Results:", results);

    res.render("search_results", { results });
  });
});
// Route to display Bhajan books and their respective Bhajans
// Route to display list of Bhajan Books
app.get("/bhajan-books", (req, res) => {
  const query = `
      SELECT DISTINCT book_id, 
          CASE 
              WHEN book_id = 5 THEN 'मराठी भजन ' 
              WHEN book_id = 8 THEN 'अभंग ' 
              WHEN book_id = 80 THEN 'हिंदी भजन ' 
              WHEN book_id = 9 THEN 'हिंदी भजन २' 
          END AS book_name
      FROM bhajans
      WHERE book_id IN (5, 8, 80, 9)  -- Only include these specific book IDs
      ORDER BY book_id ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.log("Error fetching Bhajan books:", err);
      return res.send("Error fetching Bhajan books");
    }

    // Render the bhajan_books.ejs page with the list of bhajan books
    res.render("bhajan_books", { books: results });
  });
});

// Route to show book content (list of topics) and book details
// Route to show book content (list of topics) and book details
app.get("/sahitya/:id", (req, res) => {
  const bookId = req.params.id;

  // First, fetch the book title from the 'tab' table
  const bookQuery = "SELECT * FROM tab WHERE id = ?";

  db.query(bookQuery, [bookId], (err, bookResults) => {
    if (err) {
      console.log("Error fetching book:", err);
      return res.send("Error fetching book");
    }

    if (bookResults.length === 0) {
      return res.send("Book not found");
    }

    const book = bookResults[0];

    // Now fetch the topics for this book from the 'tab_books' table
    const topicQuery = "SELECT * FROM tab_books WHERE tab_id = ?";

    db.query(topicQuery, [bookId], (err, topicResults) => {
      if (err) {
        console.log("Error fetching topics:", err);
        return res.send("Error fetching topics");
      }

      // Render the book_content page, passing both the book title and the topics list
      res.render("book_content", { book, topics: topicResults });
    });
  });
});

// Route to show the full topic content
app.get("/sahitya/topic/:id", (req, res) => {
  const topicId = req.params.id;

  // Simple query to fetch the topic content without trimming
  const topicQuery = "SELECT * FROM items WHERE book_id = ?";

  db.query(topicQuery, [topicId], (err, results) => {
    if (err) {
      console.log("Error fetching topic content:", err);
      return res.send("Error fetching topic content");
    }

    if (results.length === 0) {
      // Change 'result' to 'results'
      return res.send("Topic not found");
    }

    console.log("Fetched Data:", results);

    // Render the topic_content page with the full topic content
    res.render("topic_content", { topics: results });
  });
});
// Add a new route for searching Bhajans

// Define the "See More" page route (About page)
app.get("/about", (req, res) => {
  res.render("about"); // Render the 'about.ejs' view
});

// Set the port for the server
const port = 3000;
app.listen(port, () => {
  console.log("Server running on http://localhost:" + port);
});
