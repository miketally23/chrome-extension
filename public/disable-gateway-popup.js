
// (function() {
//     console.log('External script loaded to disable qdnGatewayShowModal');
    
//     const timeoutDuration = 5000; // Set timeout duration to 5 seconds (5000ms)
//     let elapsedTime = 0; // Track the time that has passed

//     // Poll for qdnGatewayShowModal and disable it once it's defined
//     const checkQdnGatewayInterval = setInterval(() => {
//         elapsedTime += 100; // Increment elapsed time by the polling interval (100ms)

//         if (typeof window.qdnGatewayShowModal === 'function') {
//             console.log('Disabling qdnGatewayShowModal');
            
//             // Disable qdnGatewayShowModal function
//             window.qdnGatewayShowModal = function(message) {
//                 console.log('qdnGatewayShowModal function has been disabled.');
//             };

//             // Stop checking once qdnGatewayShowModal has been disabled
//             clearInterval(checkQdnGatewayInterval);
//         } else if (elapsedTime >= timeoutDuration) {
//             console.log('Timeout reached, stopping polling for qdnGatewayShowModal.');
//             clearInterval(checkQdnGatewayInterval); // Stop checking after 5 seconds
//         } 
//     }, 100); // Check every 100ms

// })();
