function getPageText() {
    // A simple approach - you might want to refine how you extract the text
    return document.body.innerText;
}

chrome.runtime.sendMessage({
    action: "processPageText",
    text: getPageText(),
    url: window.location.href
});
