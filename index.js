const express = require('express');
const PORT = process.env.PORT || 4040;
const cookieParser = require('cookie-parser');
const linkwsdataRouter = require('./routes/linkwsdata');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', linkwsdataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
//
app.listen(PORT, (err)=>{
    if(err) console.log(err);
    console.log(`Server listening on PORT ${PORT}`);
})