const axios = require('axios');

//CHECK CONNECTION
const deviceUrl = 'http://192.168.4.1:3000';
async function checkConnection() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(deviceUrl, {
            method: 'HEAD',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        return response.ok; // Returns true if status is 200-299
    } catch (error) {
        // Network error, timeout, or device offline
        console.log("Device unreachable:", error.message);
        return false;
    }

}


module.exports = {checkConnection}