const startScanButton = document.getElementById("startScan");
const captureButton = document.getElementById("capture");
const video = document.getElementById("video");
const canvas = document.createElement("canvas");

// Function to start video stream
async function startScanner() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
  });
  video.srcObject = stream;
}

// Function to convert the image to grayscale
function convertToGrayscale(context, width, height) {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // Red
    data[i + 1] = avg; // Green
    data[i + 2] = avg; // Blue
    // data[i + 3] is the alpha channel (opacity)
  }

  context.putImageData(imageData, 0, 0);
}

// Function to capture a photo and scan the barcode
async function captureAndScan() {
  const codeReader = new ZXing.BrowserMultiFormatReader();

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the image to grayscale
  convertToGrayscale(context, canvas.width, canvas.height);

  // Display the image for debugging
  const dataUrl = canvas.toDataURL("image/png");
  const image = new Image();
  image.src = dataUrl;
  document.body.appendChild(image); // Append the captured image to the body for inspection

  image.onload = async () => {
    try {
      const result = await codeReader.decodeFromImageElement(image);
      alert(`Scanned barcode: ${result.text}`);
    } catch (err) {
      console.error(err);
      alert("Failed to scan the barcode.");
    }
  };
}

// Event listeners
startScanButton.addEventListener("click", startScanner);
captureButton.addEventListener("click", captureAndScan);
