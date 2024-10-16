(function() {
    console.log('External script loaded to disable qdnGatewayShowModal');
    
    // Poll for qdnGatewayShowModal and disable it once it's defined
    const checkQdnGatewayInterval = setInterval(() => {
        if (typeof window.qdnGatewayShowModal === 'function') {
            console.log('Disabling qdnGatewayShowModal');
            
            // Disable qdnGatewayShowModal function
            window.qdnGatewayShowModal = function(message) {
                console.log('qdnGatewayShowModal function has been disabled.');
            };

            // Stop checking once qdnGatewayShowModal has been disabled
            clearInterval(checkQdnGatewayInterval);
        } else {
            console.log('Waiting for qdnGatewayShowModal to be defined...');
        }
    }, 100); // Check every 100ms

})();
