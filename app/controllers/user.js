var User = require('../models/user.js')

// signup
exports.signup =function(req, res){
  var _user = req.body.user

  User.findOne({name: _user.name},function(err, user){
    if (err){
      console.log(err)
    }
    if (user){
      return res.redirect('/signin')
    }
    else {
      user = new User(_user)
      user.save(function(err, user){
        if(err) {
          console.log(err)
        }
        res.redirect('/signin')
      })
    }
  })
  
}
// show signup
  exports.showSignup = function(req, res){
    res.render('signup', {
      title: '注册页面'
    })
  }


// show signin
  exports.showSignin = function(req, res){
    res.render('signin', {
      title: '登录页面'
    })
  }



// signin
exports.signin = function(req, res){
  var _user = req.body.user
  var name = _user.name
  var password = _user.password

  User.findOne({name: name}, function(err, user){
    if(err){
      console.log(err)
    }
    if(!user){
      res.redirect('/signup')
    }
    user.comparePassword(password, function(err, isMatch){
      if(err){
        console.log(err)
      }
      if(isMatch){
        console.log('password is match')
        req.session.user = user
        return res.redirect('/')
      }
      else{
        console.log('password is not match')
        return res.redirect('/signin')
      }
    })
  })
}

// logout
exports.logout = function(req, res){
  delete req.session.user
  //delete app.locals.user
  res.redirect('/')
}

// userlist page
exports.list = function(req, res){
  User.fetch(function(err, users){
    if(err) {
      console.log(err)
    }
    res.render('userlist', {
      title: 'user list page',
      users: users
    })

  })
}

// user signinRequired 
exports.signinRequired = function(req, res, next){
  var user = req.session.user
  
  if(!user){
    return res.redirect('/signin')
  }
  next()
}

// user adminRequired 
exports.adminRequired = function(req, res, next){
  var user = req.session.user
  
  if(user.role <= 10){
    return res.redirect('/signin')
  }
  next()
}