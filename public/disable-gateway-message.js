// (function() {
//    // Immediately disable qdnGatewayShowModal if it exists


//     // Now, let's wrap the handleResponse function with the new condition
//     const originalHandleResponse = window.handleResponse; // Save the original handleResponse function

//     if (typeof originalHandleResponse === 'function') {
//         // Create the wrapper function to enhance the original handleResponse
//         window.handleResponse = function(event, response) {
//             // Check if the response contains the specific error message
//             if (response && typeof response === 'string' && response.includes("Interactive features were requested")) {
//                 console.log('Response contains "Interactive features were requested", skipping processing.');
//                 return; // Skip further processing
//             }

//             // Call the original handleResponse for normal processing
//             originalHandleResponse(event, response);
//         };

//         console.log('handleResponse has been enhanced to skip specific error handling.');
//     } else {
//         console.log('No handleResponse function found to enhance.');
//     }

// })();
