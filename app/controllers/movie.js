var Movie = require('../models/movie.js')
var _ = require('underscore')
var Comment = require('../models/comment.js')
var Category = require('../models/category.js')
var fs = require('fs')
var path = require('path')

//detail page
exports.detail = function(req, res){
  var id = req.params.id

  Movie.update({_id: id}, {$inc: {pv:1}}, function(err){ //设置pv的初始值为1,并且递增。
    if(err){
      console.log(err)
    }
  })

  Movie.findById(id, function(err,movie){
    Comment
    .find({movie: id})
    .populate('from','name')
    .populate('reply.from reply.to', 'name')
    .exec( function(err, comments){
      res.render('detail', {
        title: 'movieWebsite ' + movie.title,
        movie: movie,
        comments: comments
      })
    })   
  })
}


// admin new page
exports.new = function(req, res) {
  Category.find({}, function(err, categories) {
    res.render('admin', {
      title: 'imooc 后台录入页',
      categories: categories,
      movie: {}
    })
  })
}

//admin update movie
exports.update = function(req, res){
  var id = req.params.id
  
  if(id) {
    Movie.findById(id, function(err, movie){
      Category.find({}, function(err, categories){
        res.render('admin',{
          title: '电影更新',
          movie: movie,
          categories: categories        
        })
      })
    })
  }
}

// admin poster
exports.savePoster = function(req, res, next) {
  var posterData = req.files.updatePoster
  var filePath = posterData.path
  var originalFilename = posterData.originalFilename

  if(originalFilename){
    fs.readFile(filePath, function(err, data){
      var timestamp = Date.now() //申明时间戳
      var type = posterData.type.split('/')[1] //海报类型
      var poster = timestamp + '.' + type //海报名称
      var newPath = path.join(__dirname, '../../', '/public/upload/' + poster) //海报存储地址
      
      fs.writeFile(newPath , data ,function(err){
        req.poster = poster
        next()
      })
    })
  }
  else{
    next()
  }
}

// admin post movie
exports.save = function(req, res) {
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie
  
  if(req.poster){
    movieObj.poster = req.poster
  }
  if (id) {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err)
      }
 
      _movie = _.extend(movie, movieObj)
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err)
        }
 
        res.redirect('/movie/' + movie._id)
      })
    })
  }
  else {
    _movie = new Movie(movieObj)
    
    var categoryId = _movie.category
    
    _movie.save(function(err, movie) {
      if (err) {
        console.log(err)
      }
      Category.findById(categoryId, function(err, category){
        category.movies.push(movie._id)

        category.save(function(err, category){
          res.redirect('/movie/' + movie._id)
        })
      })
    })
  }
}

// list page
exports.list = function(req, res){
  Movie.fetch(function(err, movies){
    if (err){
      console.log(err)
    }

    res.render('list', {
      title: 'movieWebsite list',
      movies: movies
    })
  })
}

// list delete movie
exports.del = function(req,res){
  var id = req.query.id

  if(id){
    Movie.remove({_id: id},function(err,movie){
      if(err){
        console.log(err)
      }
      else {
        res.json({success: 1})
      }
    })
  }
}