const express      = require('express');
const jwt          = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app          = express();

app.use(cookieParser());

app.get('/api/get', (req, res) => {
    res.json({
        message: 'welcome in carrimat API'
    });
});


app.get('/api/get/protected', tokenVerify, (req, res) => {
    res.json({
        message: 'welcome on this protected page'
    });
});

app.post('/api/post/:id', (req, res) => {
    res.json({
        message: `you've just make a post request with the id ${req.params.id} as a param`
    });
});

app.post('/api/post/protected/:id', tokenVerify, (req, res) => {
    res.json({
        message: `you've just make a post request with the id ${req.params.id} `
    });
});

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/login', (req, res) => {
    const KEY = 'carrimatWebToken';
    // signing the JSON web token
    jwt.sign({ data: 'carrimatData' }, KEY, { expiresIn: '5s' }, (err, token) => {
        if(err){
            res.json(`this error ${err} just occured ! `);
        } else{
            res.cookie('token', token,{ maxAge: 1000000, httpOnly: true })
            res.json({
                message: `your token is stored`
            });
        }
    });
});

function tokenVerify(req, res, next){
    const KEY = 'carrimatWebToken';
    
    console.log(res)

    if(Object.keys(req.cookies).length === 0) {
        return res.sendStatus(403);
    }

    jwt.verify(req.cookies.token, KEY, function(err, decoded) {
        if(err){
            return res.sendStatus(403);
        }
        console.log(decoded.data) // Carrimat
      });
    next();
}
// set a Static Folder
app.use(express.static(`${__dirname}\\public`));

// in case we want to deploy it
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server start at port ${PORT}`);
})