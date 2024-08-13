const startScanButton = document.getElementById('startScan');
const captureButton = document.getElementById('capture');
const video = document.getElementById('video');
const canvas = document.createElement('canvas');

// Function to start the video stream
async function startScanner() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing the camera:', err);
    }
}

// Function to convert the captured image to grayscale
function convertToGrayscale(context, width, height) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;        // Red
        data[i + 1] = avg;    // Green
        data[i + 2] = avg;    // Blue
        // data[i + 3] is the alpha channel (opacity)
    }

    context.putImageData(imageData, 0, 0);
}

// Function to adjust contrast (optional)
function adjustContrast(context, width, height, contrast) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;        // Red
        data[i + 1] = factor * (data[i + 1] - 128) + 128; // Green
        data[i + 2] = factor * (data[i + 2] - 128) + 128; // Blue
    }

    context.putImageData(imageData, 0, 0);
}

// Function to capture an image and scan the PDF417 barcode
async function captureAndScan() {
    const codeReader = new ZXing.BrowserPDF417Reader();
    
    // Set canvas dimensions to match the video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the image to grayscale and adjust contrast
    convertToGrayscale(context, canvas.width, canvas.height);
    adjustContrast(context, canvas.width, canvas.height, 50);

    // Display the captured image for debugging (optional)
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
