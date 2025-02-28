import express from 'express';

const port = 3000;
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.json());

// Get Homescreen
app.get('/', (req, res) => {
    res.render('login/index');
})

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});