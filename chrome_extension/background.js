// let model = null;

// // Initialize the Gemini AI model
// async function initGeminiAI() {
//   try {
//     const { GoogleGenerativeAI } = await import('https://cdn.jsdelivr.net/npm/@google/generative-ai@0.3.0/dist/browser/index.js'); 
//     // there are issues with the import, so I have to use the CDN link.
//     const apiKey = process.env.GEMINI_API_KEY;
//     const genAI = new GoogleGenerativeAI(apiKey);

//     model = genAI.getGenerativeModel({
//       model: "gemini-2.0-flash",
//     });

//     console.log("Gemini AI initialized successfully");
//   } catch (error) {
//     console.error("Failed to initialize Gemini AI:", error);
//   }
// }

// initGeminiAI();
////////////////////////////

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.storage.local.set({
      onboardingComplete: false,
      userPreferences: {
        autoFill: true,
        saveDocuments: true,
        notificationEnabled: true
      }
    });
    
    chrome.tabs.create({
      url: 'onboarding.html'
    });
  }
});