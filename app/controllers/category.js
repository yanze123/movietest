var _ = require('underscore')
var Category = require('../models/category.js')

//admin new page
exports.new = function(req, res) {
	res.render('category_admin',{
		title: '电影后台分类录入页',
		category: {}
	})
}

//admin post movie
exports.save = function(req, res) {
	var _category = req.body.category
	var category = new Category(_category)

	category.save(function(err, category){
		if(err) {
			console.log(err)
		}
		res.redirect('/admin/category/list')
	})
}

//categroylist page
exports.list = function(req, res) {
	Category.fetch(function(err, categories){
		if(err){
			console.log(err)
		}
		res.render('categorylist', {
			title: '电影分类列表页',
			categories: categories
		})
	})
}