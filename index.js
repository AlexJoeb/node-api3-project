const server = require('express')();
const userRoutes = require('./users/userRouter');
const postRoutes = require('./posts/postRouter');

server.use(require('express').json());
server.use(logger);

server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('/api/users', userRoutes);
server.use('/api/posts', postRoutes);

// custom middleware

function logger(req, res, next) {
    console.log(`${new Date().toISOString().replace('T', ' ').replace('Z', '').split('.')[0]} -> ${req.method} '${req.url}'`);
    next();
}

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server started.`));