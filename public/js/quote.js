function getQuote(){
	quote = document.getElementById("quote");
	author = document.getElementById("author");
	fetch('http://quotes.rest/qod.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    author.innerHTML = myJson.contents.quotes[0].author;
    quote.innerHTML = "«" + myJson.contents.quotes[0].quote + "»";
  });
}

getQuote();