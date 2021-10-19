"use strict";

// Goal: When a user enters a URL in the input and presses "Shorten it", the code will send a get request to shrtcode in order to receive back the shortened url. Once the url has been received, a new result will appear below the input box with the original url, the shortened url, and a button that allows the user to copy the shortened url. Old results will stack below new ones until the screen is refreshed.
// Define elements
var shortenButton = document.getElementById("shorten-button");
var urlInputField = document.getElementById("url-input-field");
var resultsList = document.getElementById("results");
var urlToCopy = document.getElementsByClassName("newUrl");
var copyButton = document.getElementsByClassName("copy-button");
var errorMessageMobile = document.getElementById("error-mobile");
var errorMessageDesktop = document.getElementById("error-desktop");
var backgroundFilter = document.getElementById("filter");
var loading = document.getElementById("loading");
var newUrlToShorten = "";
var newlyShortenedUrl = "";
resultsList.addEventListener("click", function (e) {
  if (e.target.className == 'copy-button') {
    var _urlToCopy = e.target.previousElementSibling;
    copy(_urlToCopy, e.target);
  }
}); // Send a GET request to the API, waiting for the response

function fetchShortenedUrl(url) {
  var response, data, newestResultElement;
  return regeneratorRuntime.async(function fetchShortenedUrl$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          backgroundFilter.style.display = "block";
          loading.style.display = "block";
          document.querySelector("body").style.overflow = "hidden";
          _context.next = 6;
          return regeneratorRuntime.awrap(fetch("https://api.shrtco.de/v2/shorten?url=".concat(url)));

        case 6:
          response = _context.sent;
          backgroundFilter.style.display = "none";
          loading.style.display = "none";
          document.querySelector("body").style.overflow = "scroll";
          _context.next = 12;
          return regeneratorRuntime.awrap(response.json());

        case 12:
          data = _context.sent;
          // Receive the response and save it
          newlyShortenedUrl = data.result.short_link; // Display response on UI

          newestResultElement = document.createElement("div");
          newestResultElement.className = "result";
          newestResultElement.innerHTML = "<p class=\"url\">".concat(newUrlToShorten, "</p>\n            <div class=\"expand\"></div>\n            <hr>\n            <p class=\"newUrl\">").concat(newlyShortenedUrl, "</p>\n            <button data-url=\"").concat(newlyShortenedUrl, "\" class=\"copy-button\">Copy</button>");
          resultsList.insertBefore(newestResultElement, resultsList.firstChild);
          _context.next = 23;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](0);
          // Handle errors
          console.log(_context.t0);

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 20]]);
} // Listen to button press 


shortenButton.addEventListener("click", function (event) {
  if (urlInputField.value != "") {
    // Remove errors if applicable
    urlInputField.classList.remove("empty");
    errorMessageMobile.classList.remove("visible");
    errorMessageDesktop.classList.remove("visible"); // Get value from input field

    newUrlToShorten = urlInputField.value; // Clear field

    urlInputField.value = ""; // Make API call and create new html element with result

    fetchShortenedUrl(newUrlToShorten);
  } else {
    errorMessageMobile.classList.add("visible");
    urlInputField.classList.add("empty");
    errorMessageDesktop.classList.add("visible");
  }
}); // Listen to copy button

function copy(copyText, button) {
  navigator.clipboard.writeText(copyText.innerHTML);
  button.innerHTML = "Copied!";
  button.classList.add("copied");
}