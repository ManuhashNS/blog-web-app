import express from 'express';
import pg from 'pg';

const app = express();
const port= process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'BlogPosts',
    password:'Manuhash1806',
    port: 5432,
});
db.connect();

var posts = [];

// the home page route
app.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM posts ORDER BY date DESC");
        posts = result.rows;
        res.render('index.ejs', {blogs: posts});
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving posts");
    }
});

// new post route
app.get("/new", (req, res)=>{
    res.render("write.ejs",{heading:"Create New Post", submit:"Post it!"});
});

// edit post route
app.get("/post/:id/edit", async (req, res)=>{
    const id = parseInt(req.params.id);
    try {
        const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
        const post = result.rows[0];
        if (post) {
            res.render("write.ejs", {heading: "Edit Post", post: post, submit: "Update and Save"});
        } else {
            res.status(404).send("Post not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving post");
    }
});

// view post route
app.get("/post/:id/view", async (req, res)=>{
    const id = parseInt(req.params.id);
    try {
        const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
        const post = result.rows[0];
        if (post) {
            res.render("view.ejs", {blog: post});
        } else {
            res.status(404).send("Post not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving post");
    }
});

// delete post route
app.post("/post/:id/delete", async (req, res)=>{
    const id = parseInt(req.params.id);
    try {
        await db.query("DELETE FROM posts WHERE id = $1", [id]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting post");
    }
});

// create new post route
app.post("/new", async (req, res)=>{
    const newPost = req.body;
    try {
        await db.query(
            "INSERT INTO posts (title, content, author, date) VALUES ($1, $2, $3, $4)",
            [newPost.title, newPost.content, newPost.author, new Date()]
        );
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating post");
    }});


// update post route
app.post("/post/:id/edit", async (req, res)=>{
    const id = parseInt(req.params.id);
    const updatedPost = req.body;
    try {
        await db.query(
            "UPDATE posts SET title = $1, content = $2, author = $3, date = $4 WHERE id = $5", 
            [updatedPost.title, updatedPost.content, updatedPost.author, new Date(), id]
        );
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating post");
    }});
        

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
