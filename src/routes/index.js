var SessionHandler = require('./session')
  , ContentHandler = require('./content')
  , ChatHandler = require('./chat')
  , ErrorHandler = require('./error').errorHandler
  , Caching = require('./caching')
  , FXR = require('../lib/fxr.js') ;

module.exports = exports = function(app, db) {

    var sessionHandler = new SessionHandler(db)
      , contentHandler = new ContentHandler(db)
      , chatHandler = new ChatHandler()
      , cachingHandler = new Caching();

    //mongo101 =================================
    // Middleware to see if a user is logged in
    app.use(sessionHandler.isLoggedInMiddleware);

    // The main page of the blog
    app.get('/blog', contentHandler.displayMainPage);

    // The main page of the blog, filtered by tag
    app.get('/blog/tag/:tag', contentHandler.displayMainPageByTag);

    // A single post, which can be commented on
    app.get('/blog/post/:permalink', contentHandler.displayPostByPermalink);
    app.post('/blog/newcomment', contentHandler.handleNewComment);
    app.get('/blog/post_not_found', contentHandler.displayPostNotFound);

    // Displays the form allowing a user to add a new post. Only works for logged in users
    app.get('/blog/newpost', contentHandler.displayNewPostPage);
    app.post('/blog/newpost', contentHandler.handleNewPost);

    // Login form
    app.get('/blog/login', sessionHandler.displayLoginPage);
    app.post('/blog/login', sessionHandler.handleLoginRequest);

    // Logout page
    app.get('/blog/logout', sessionHandler.displayLogoutPage);

    // Welcome page
    app.get('/blog/welcome', sessionHandler.displayWelcomePage);

    // Signup form
    app.get('/blog/signup', sessionHandler.displaySignupPage);
    app.post('/blog/signup', sessionHandler.handleSignup);

    //stork animation a.k.a. baby shower invitation
    app.get('/baby', function(req, res) {
        cachingHandler.getPageFromCache(req.url, function(err, content) {
            if (err) return req.next(err);

            if (content) {
                res.send(content);
            } else {
                res.render('baby', function(err, content) {
                    // render handler
                    if (err) return req.next(err);
                    cachingHandler.setPageToCache(req.url, content);
                    res.send(content);
                });
            }
        });
    })

    //foreign exchange rate using GET variables
    app.get('/fxr/:amount/:to', function(req, res) {
        var to = req.params.to.toUpperCase() || "AUD"
         ,  amount = (isNaN(req.params.amount) || req.params.amount < 0) ? 0 : req.params.amount
         ,  result = FXR.convertUSDToCurrency(amount, to);

        res.render('fxr', {
            currency : {
                from: "USD",
                to: to,
                amount: amount,
                result: result
            }
        });
    });

    //chat
    app.get('/chat', chatHandler.displayChatPage);

    //hardware accelerated css
    app.get('/puppies', function (req, res) {
        res.render('puppies');
    });

    //just testing stuff
    app.get('/', function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hola from roydelgado.com');
    });

    // Error handling middleware
    app.use(ErrorHandler);
}