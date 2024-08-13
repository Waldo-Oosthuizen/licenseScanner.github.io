const startScanButton = document.getElementById('startScan');
const captureButton = document.getElementById('capture');
const video = document.getElementById('video');
const canvas = document.createElement('canvas');
const guideCanvas = document.getElementById('guideCanvas');

// Function to start the video stream
async function startScanner() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;

        // Adjust guide canvas size to match video
        guideCanvas.width = video.videoWidth;
        guideCanvas.height = video.videoHeight;

        drawGuideLines();
    } catch (err) {
        console.error('Error accessing the camera:', err);
    }
}

// Function to draw guide lines on the guide canvas
function drawGuideLines() {
    const context = guideCanvas.getContext('2d');
    const { width, height } = guideCanvas;

    // Clear the canvas
    context.clearRect(0, 0, width, height);

    // Draw semi-transparent background
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, width, height);

    // Define the rectangle area for the barcode (centered on the screen)
    const rectWidth = width * 0.8;
    const rectHeight = height * 0.2;
    const rectX = (width - rectWidth) / 2;
    const rectY = (height - rectHeight) / 2;

    // Clear the center rectangle
    context.clearRect(rectX, rectY, rectWidth, rectHeight);

    // Draw the rectangle border
    context.strokeStyle = '#00FF00'; // Green guide lines
    context.lineWidth = 2;
    context.strokeRect(rectX, rectY, rectWidth, rectHeight);
}

// Function to capture an image and scan the PDF417 barcode
async function captureAndScan() {
    const codeReader = new ZXing.BrowserPDF417Reader();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the image to grayscale and adjust contrast
    convertToGrayscale(context, canvas.width, canvas.height);
    adjustContrast(context, canvas.width, canvas.height, 50);

    const dataUrl = canvas.toDataURL('image/png');
    const image = new Image();
    image.src = dataUrl;
    document.body.appendChild(image);

    image.onload = async () => {
        try {
            const result = await codeReader.decodeFromImageElement(image);
            alert(`Scanned barcode: ${result.text}`);
        } catch (err) {
            console.error('Failed to scan the barcode:', err);
            alert('Failed to scan the barcode.');
        }
    };
}

// Event listeners
startScanButton.addEventListener('click', startScanner);
captureButton.addEventListener('click', captureAndScan);
