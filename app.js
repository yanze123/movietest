var express = require('express')
var path = require('path')
var port = process.env.PORT || 4000
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var multipart = require('connect-multiparty')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var bcrypt = require("bcrypt")
var mongoStore = require("connect-mongo")(session) // express4
var app = express()
var dbUrl = "mongodb://localhost/movieWebsite"
var logger = require('morgan')
var fs = require('fs')

mongoose.connect(dbUrl)

// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)
app.set('views','./app/views/pages')
app.set('view engine','jade')

app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({extended: true}))
app.use(multipart())
app.use(cookieParser())
app.use(session({
  name: "yanze",
  secret: "movieWebsite",
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({
    url: dbUrl,
    auto_reconnect: true,//issue 推荐解决方法
    collection: "sessions"
  })
}))

if('development' === app.get('env')) {
	app.set('showStackError', true)
	app.use(logger(':method :url :status')) // express 4
	app.locals.pretty = true
	mongoose.set('debug', true)
}

require('./config/routes')(app)

app.locals.moment = require('moment')
app.listen(port)

console.log('movieWebsite started on port ' + port)

