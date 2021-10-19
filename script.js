// Goal: When a user enters a URL in the input and presses "Shorten it", the code will send a get request to shrtcode in order to receive back the shortened url. Once the url has been received, a new result will appear below the input box with the original url, the shortened url, and a button that allows the user to copy the shortened url. Old results will stack below new ones until the screen is refreshed.

// Define elements
const shortenButton = document.getElementById("shorten-button");
const urlInputField = document.getElementById("url-input-field");
const resultsList = document.getElementById("results");
const urlToCopy = document.getElementsByClassName("newUrl");
const copyButton = document.getElementsByClassName("copy-button");
const errorMessageMobile = document.getElementById("error-mobile");
const errorMessageDesktop = document.getElementById("error-desktop");
const backgroundFilter = document.getElementById("filter")
const loading = document.getElementById("loading")

let newUrlToShorten = "";
let newlyShortenedUrl = "";

resultsList.addEventListener("click", (e) => {
    if (e.target.className == 'copy-button') {
        let urlToCopy = e.target.previousElementSibling
        copy(urlToCopy, e.target)
    }
})

// Send a GET request to the API, waiting for the response
async function fetchShortenedUrl(url) {
    try {
        backgroundFilter.style.display = "block"
        loading.style.display = "block"
        document.querySelector("body").style.overflow = "hidden"
        let response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
        backgroundFilter.style.display = "none"
        loading.style.display = "none"
        document.querySelector("body").style.overflow = "scroll"
        let data = await response.json()
        // Receive the response and save it
        newlyShortenedUrl = data.result.short_link;
        // Display response on UI
        let newestResultElement = document.createElement("div");
        newestResultElement.className = "result";
        newestResultElement.innerHTML = 
            `<p class="url">${newUrlToShorten}</p>
            <div class="expand"></div>
            <hr>
            <p class="newUrl">${newlyShortenedUrl}</p>
            <button data-url="${newlyShortenedUrl}" class="copy-button">Copy</button>`;
        resultsList.insertBefore(newestResultElement, resultsList.firstChild)
    } catch(err) {
        // Handle errors
        console.log(err)
    }
}

// Listen to button press 
shortenButton.addEventListener("click", event => {
    if (urlInputField.value != "") {
        // Remove errors if applicable
        urlInputField.classList.remove("empty")
        errorMessageMobile.classList.remove("visible")
        errorMessageDesktop.classList.remove("visible")
        // Get value from input field
        newUrlToShorten = urlInputField.value;
        // Clear field
        urlInputField.value = ""
        // Make API call and create new html element with result
        fetchShortenedUrl(newUrlToShorten)
    } else {
        errorMessageMobile.classList.add("visible")
        urlInputField.classList.add("empty")
        errorMessageDesktop.classList.add("visible")
    }
})

// Listen to copy button
function copy(copyText, button) {
    navigator.clipboard.writeText(copyText.innerHTML)
    button.innerHTML = "Copied!"
    button.classList.add("copied")
}




