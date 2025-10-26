import express from 'express';

const app = express();
const port= process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

var posts = [];

// the home page route
app.get('/', (req, res) => {
    res.render('index.ejs',{blogs:posts});
});

// new post route
app.get("/new", (req, res)=>{
    res.render("write.ejs",{heading:"Create New Post", submit:"Post it!"});
});

// edit post route
app.get("/post/:id/edit", (req, res)=>{
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
    if (post) {
        res.render("write.ejs", {heading: "Edit Post",post: post, submit: "Update and Save"});
    } else {
        res.status(404).send("Post not found");
    }
});

// view post route
app.get("/post/:id/view", (req, res)=>{
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
    if (post) {
        res.render("view.ejs", {blog: post});
    } else {
        res.status(404).send("Post not found");
    }
});

// delete post route
app.post("/post/:id/delete", (req, res)=>{
    const id = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== id);
    res.redirect("/");  
});

// create new post route
app.post("/new", (req, res)=>{
    // console.log(req.body);
    const newPost = req.body;
    newPost.id = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1;
    const now = new Date();
    newPost.date = now.toDateString();
    posts.push(newPost);
    res.redirect("/");
});

// update post route
app.post("/post/:id/edit", (req, res)=>{
    const id = parseInt(req.params.id);
    const updatedPost = req.body;
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex !== -1) {
        updatedPost.id = id;
        updatedPost.date = new Date().toDateString();
        posts[postIndex] = updatedPost;
        res.redirect("/");
    } else {
        res.status(404).send("Post not found");
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
