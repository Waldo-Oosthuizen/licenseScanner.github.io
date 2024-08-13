// Importing the necessary libraries
import { BrowserPDF417Reader } from '@zxing/library';

// Initialize the barcode reader
const codeReader = new BrowserPDF417Reader();

// Capture and scan function
async function captureAndScan() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to grayscale and adjust contrast
    convertToGrayscale(context, canvas.width, canvas.height);
    adjustContrast(context, canvas.width, canvas.height, 50);

    // Create an image element for the captured frame
    const dataUrl = canvas.toDataURL('image/png');
    const image = new Image();
    image.src = dataUrl;
    document.body.appendChild(image);

    image.onload = async () => {
        try {
            const result = await codeReader.decodeFromImageElement(image);
            alert(`Scanned barcode: ${result.text}`);
        } catch (err) {
            console.error('Scanning failed:', err);
            alert('Failed to scan the barcode.');
        }
    };
}
