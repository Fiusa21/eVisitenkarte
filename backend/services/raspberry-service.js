require('dotenv').config();

//CHECK CONNECTION
const deviceUrl = process.env.DEVICE_URL;
async function checkConnection() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(deviceUrl, {
            method: 'HEAD',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        return response.ok; //200-299
    } catch (error) {
        console.log("Device unreachable:", error.message);
        return false;
    }
}

/**
 * Handles the logic of checking connection and forwarding the image
 * @param {Buffer} imageBuffer - The raw binary data
 * @returns {Promise<{success: boolean, status: number, message: string}>}
 */
async function handleImageUpload(imageBuffer) {

    const isOnline = await checkConnection();
    if (!isOnline) {
        return { success: false, status: 503, message: "Display device is offline" };
    }

    try {
        const deviceResponse = await fetch(`${deviceUrl}/api`, {
            method: 'POST',
            body: imageBuffer,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': imageBuffer.length.toString()
            }
        });

        if (deviceResponse.ok) {
            return { success: true, status: 200, message: "Image sent successfully" };
        } else {
            const errorDetail = await deviceResponse.text();
            return { success: false, status: deviceResponse.status, message: errorDetail };
        }
    } catch (err) {
        console.error("Raspberry Service: Forwarding error:", err);
        return { success: false, status: 500, message: "Error communicating with device" };
    }
}



module.exports = {checkConnection, handleImageUpload}