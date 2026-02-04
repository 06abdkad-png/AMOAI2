// 1. Klistra in länken till din modell här (från Teachable Machine)
const URL = "https://teachablemachine.withgoogle.com/models/my_model/";

let model, webcam, labelContainer, maxPredictions;

// Den här funktionen körs när man klickar på knappen
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Ladda modellen och metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Inställningar för webbkameran
    const flip = true; // om webbkameran ska speglas
    webcam = new tmImage.Webcam(200, 200, flip); // bredd, höjd, spegling
    await webcam.setup(); // begär åtkomst till kameran
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Lägg till webbkameran i HTML-containern
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    // Förbered etiketter (labels) för resultatet
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
    
    // Inaktivera knappen efter start så man inte klickar flera gånger
    document.getElementById("startBtn").disabled = true;
    document.getElementById("startBtn").innerText = "Körs...";
}

async function loop() {
    webcam.update(); // uppdatera webbkamerans bild
    await predict();
    window.requestAnimationFrame(loop);
}

// Kör bilden genom AI-modellen
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(0) + "%";
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

// Koppla knappen till init-funktionen
document.getElementById("startBtn").addEventListener("click", init);