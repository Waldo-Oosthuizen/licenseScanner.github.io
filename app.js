const startScanButton = document.getElementById('startScan');
const video = document.getElementById('video');

// Function to start video stream and scan for barcodes
async function startScanner() {
    const codeReader = new ZXing.BrowserBarcodeReader();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        
        const result = await codeReader.decodeFromVideoElement(video);
        alert(`Scanned barcode: ${result.text}`);
        
        // Stop the video stream after scanning
        stream.getTracks().forEach(track => track.stop());
    } catch (err) {
        console.error(err);
        alert('Error accessing the camera or scanning the barcode');
    }
}

startScanButton.addEventListener('click', startScanner);
