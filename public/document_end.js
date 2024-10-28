
const script2 = document.createElement('script');
script2.src = chrome.runtime.getURL('disable-gateway-message.js'); // Reference the external script
document.documentElement.appendChild(script2); // Inject it into the page
script2.onload = function() {
    script2.remove(); // Clean up after the script has been injected and run
};