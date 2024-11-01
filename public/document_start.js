const script = document.createElement('script');
script.src = chrome.runtime.getURL('disable-gateway-popup.js'); // Reference the external script
document.documentElement.appendChild(script); // Inject it into the page
script.onload = function() {
    script.remove(); // Clean up after the script has been injected and run
};