/**
  CS337 Homework 8: Bestreads
  Joyce Wang

  This program displays book data for bestreads. It displays all books and
  specific book info for a single book when a title is clicked.
*/
"use strict";

(function(){
  /**
  This method calls the startFunction to display the home page and calls the start
  function on click of the "home" button.
  */
  function pageLoad(){
    startFunction();
    document.getElementById("back").onclick = startFunction;
  }

  /**
  This method displays info for a single book, clearing the home page.
  */
  function displayBook(){
    document.getElementById("reviews").innerHTML = "";
    document.getElementById("singlebook").style.display = "block";
    document.getElementById("allbooks").innerHTML = "";
    getInfo(this.id);
    getDescription(this.id);
    getReviews(this.id);
  }

  /**
  This method gets and adds the title, author, and rating info to the single book page.
  */
  function getInfo(id){
    let url = "http://localhost:3000?mode=info&title="+id;
    fetch(url)
      .then(checkStatus)
      .then(function(responseText) {
        let data = JSON.parse(responseText);
        document.getElementById("title").innerHTML = data.title;
        document.getElementById("author").innerHTML = data.author;
        document.getElementById("stars").innerHTML = data.stars;
        document.getElementById("cover").src = "books/"+id+"/cover.jpg";
      });
  }

  /**
  This method gets and adds the review info to the single book page.
  */
  function getReviews(id){
    let url = "http://localhost:3000?mode=reviews&title="+id;
    fetch(url)
      .then(checkStatus)
      .then(function(responseText) {
        let data = JSON.parse(responseText);
        for (let i = 0; i<data.reviews.length; i++){
          let item = data.reviews[i];
          let stars = document.createElement("span");
          stars.innerHTML = item.stars;
          let heading = document.createElement("h3");
          heading.innerHTML = item.name;
          heading.appendChild(stars);
          let review = document.createElement("p");
          review.innerHTML = item.review;
          document.getElementById("reviews").appendChild(heading);
          document.getElementById("reviews").appendChild(review);
        }
      });
  }

  /**
  This method gets and adds the description to the single book page.
  */
  function getDescription(id){
    let url = "http://localhost:3000?mode=description&title="+id;
    fetch(url)
      .then(checkStatus)
      .then(function(responseText) {
        document.getElementById("description").innerHTML = responseText;
      });
  }

  /**
  This methods sets up the home page by clearing the single book page and getting
  all book info from the web service. It calls displayBooks to set up the page.
  */
  function startFunction(){
    document.getElementById("singlebook").style.display = "none";
    document.getElementById("allbooks").innerHTML = "";
    let url = "http://localhost:3000?mode=books&title=asd";
    fetch(url)
      .then(checkStatus)
      .then(function(responseText) {
        let data = JSON.parse(responseText);
        displayBooks(data);
      });
  }

  /**
  This method adds each book and cover image to the home page. It calls displayBook
  when any book on the home page is clicked.
  */
  function displayBooks(data){
    //for each book
    for (let i = 0; i<data.books.length; i++){
      let book = document.createElement("div");
      let img = document.createElement("img");
      img.src = "books/"+ data.books[i].folder + "/cover.jpg";
      let title = document.createElement("p");
      title.innerHTML = data.books[i].title;
      book.appendChild(img);
      book.appendChild(title);
      book.id = data.books[i].folder;
      console.log(book.id);
      book.classList.add("bookIcon");
      document.getElementById("allbooks").appendChild(book);
    }
    let allIcons = document.querySelectorAll(".bookIcon");
    console.log(allIcons.length);
    for (let i = 0; i<allIcons.length; i++){
      allIcons[i].onclick = displayBook;
    }
  }

  /**
  This function returns the response text if the status is in the 200s
   otherwise rejects the promise with a message including the status
   @return the response text
   */
  function checkStatus(response) {
      if (response.status == 410){
          return Promise.reject(new Error("No data found for that state"));
      }
      else if (response.status >= 200 && response.status < 300) {
          return response.text();
      }
      else if (response.status == 404) {
      	// sends back a different error when we have a 404
      	return Promise.reject(new Error("Sorry, we couldn't find that page"));
      }
      else {
          return Promise.reject(new Error(response.status+": "+response.statusText));
      }
  }
  window.addEventListener("load", pageLoad);
})();
