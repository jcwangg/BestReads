/**
CSC 337 Homework 8: Bestreads
Web service for bestreads. Supplies book info, description, reviews, and all books
with the mode parameter and takes a title parameter.
The books folder must be in the same directory for this to work
 */

const express = require("express");
const app = express();
var fs = require('fs');

app.use(express.static('public'));

/**
This function reads a file named file_name and returns the file
@param file_name is the string file name
@returns file the named file
*/
function read_file(file_name) {
	var file = 0;
	try {
	    file = fs.readFileSync(file_name, 'utf8');
	    console.log(file);
	} catch(e) {
	    console.log('Error:', e.stack);
	}
	return file;
}

/**
This method returns a JSON representing all book info, including the folder
and title of each book.
@returns booksJSON a JSON representing all book info
*/
function getAllBooks() {
  var booksJSON = {};
  var allArr = [];
  var files = fs.readdirSync("books");
	for (var i = 0; i < files.length; i++) {
    var bookInfo = {};
    var info = read_file("books/"+files[i]+"/info.txt");
    bookInfo["folder"] = files[i];
    bookInfo["title"] = info.toString().split('\n')[0];
    allArr.push(bookInfo);
	}
	booksJSON["books"] = allArr;
	return booksJSON;
}

/**
This method returns a JSON representing book info for a single book, including
the title, author, and rating.
@returns infoJSON a JSON representing specific book info
*/
function getBookInfo(title) {
  var infoJSON = {};
  var info = read_file("books/"+title+"/info.txt");
  var infoArr = info.toString().split('\n');
  infoJSON["title"]=infoArr[0];
  infoJSON["author"]=infoArr[1];
  infoJSON["stars"]=infoArr[2];
  return infoJSON;
}

/**
This method returns a JSON representing review info for a book, including the name
of the reviewer, the rating, and the review.
@returns reviewSON a JSON representing all review info
*/
function getReviews(title){
  var reviewJSON = {};
  var reviewArr = [];
  var allFiles = fs.readdirSync("books/"+title);
  for (let i = 0; i<allFiles.length;i++){
    let currFile = allFiles[i];
    if (currFile.startsWith("review") && currFile.endsWith(".txt")){
      let fileInfo = read_file("books/"+title+"/"+currFile).toString().split('\n');
      var review = {};
      review["name"]=fileInfo[0];
      review["stars"]=fileInfo[1];
      review["review"]=fileInfo[2];
      reviewArr.push(review);
    }
  }
  reviewJSON["reviews"]=reviewArr;
  return reviewJSON;
}

//processes a request with mode and title parameters
console.log('web service started');
app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");

	var mode = req.query.mode;
	var title = req.query.title;

	// returns an error if one of the parameters is missing
	if(mode == undefined || title == undefined) {
		res.status(400);
		res.send("Missing required parameters");
	}
  else if (mode == "books"){
    var booksJSON = getAllBooks();
    res.json(booksJSON);
  }
  else if (mode == "info") {
    var infoJSON = getBookInfo(title);
    res.json(infoJSON);
  }
  else if (mode == "description") {
    var descrip = read_file("books/"+title+"/description.txt");
    res.send(descrip);
  }
  else if (mode == "reviews") {
    var reviewJSON = getReviews(title);
    res.json(reviewJSON);
  }
})

app.listen(3000);
