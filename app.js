const startScanButton = document.getElementById('startScan');
const captureButton = document.getElementById('capture');
const video = document.getElementById('video');
const canvas = document.createElement('canvas');

async function startScanner() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing the camera:', err);
    }
}

startScanButton.addEventListener('click', startScanner);
