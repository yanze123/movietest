var Index = require('../app/controllers/index.js')
var User = require('../app/controllers/user.js')
var Movie = require('../app/controllers/movie.js')
var Comment = require('../app/controllers/comment.js')
var Category = require('../app/controllers/category.js')

module.exports = function(app) {
  //pre handle user
  app.use(function(req, res, next){
    var _user = req.session.user

    app.locals.user = _user

    next()
  })

// Index 
  app.get('/', Index.index) 

// User
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/signup', User.showSignup)
  app.get('/signin', User.showSignin)
  app.get('/logout', User.logout)
  app.get('/admin/user/list', User.signinRequired, User.list)

// Movie
  app.get('/movie/:id', Movie.detail)
  app.get('/admin/movie/new', User.signinRequired, Movie.new)
  app.get('/admin/movie/update/:id', User.signinRequired, Movie.update)
  app.post('/admin/movie', User.signinRequired, Movie.savePoster, Movie.save)
  app.get('/admin/movie/list', User.signinRequired, Movie.list)
  app.delete('/admin/movie/list', User.signinRequired, Movie.del)

// Comment
  app.post('/user/comment', User.signinRequired, Comment.save)

// Category
  app.get('/admin/category/new', User.signinRequired, Category.new)
  app.post('/admin/category', User.signinRequired, Category.save)
  app.get('/admin/category/list', User.signinRequired, Category.list)  

// results
  app.get('/results', Index.search)

}