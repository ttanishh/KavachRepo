function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

// Function to get, update and display the Kavach score
function updateKavachScoreDisplay() {
  const today = getTodayDateString();
  const scoreKey = `quizScore_${today}`;
  let currentScore = parseInt(localStorage.getItem(scoreKey)) || 0;
  
  // Update the score display everywhere it appears
  const scoreDisplayElements = document.querySelectorAll('#score-display');
  scoreDisplayElements.forEach(element => {
    element.textContent = `${currentScore}`;
  });
  
  return currentScore;
}

// Function to increment the score and update display
function incrementKavachScore(points = 1) {
  const today = getTodayDateString();
  const scoreKey = `quizScore_${today}`;
  let currentScore = parseInt(localStorage.getItem(scoreKey)) || 0;
  
  currentScore += points;
  localStorage.setItem(scoreKey, currentScore);
  
  updateKavachScoreDisplay();
  return currentScore;
}
////////////////////////////////////////////////////////////
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  //Adding persistant score code
  updateKavachScoreDisplay();
  const actionLinks = document.querySelectorAll('.action-item a');
  actionLinks.forEach(link => {
    // Remove existing onclick handlers
    const oldOnclick = link.getAttribute('onclick');
    link.removeAttribute('onclick');
    
    // Add our new event listener
    link.addEventListener('click', function(e) {
      incrementKavachScore(1);
    });
  });
  // Get the location label element
  const locationLabel = document.getElementById('location-label');
  const safetyScoreValue = document.getElementById('refund-amount');
  
  // Function to get and display location
  function getLocation() {
    if (navigator.geolocation) {
      locationLabel.textContent = "Fetching location...";
      
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const latitude = position.coords.latitude.toFixed(4);
          const longitude = position.coords.longitude.toFixed(4);
          
          // Update the label to show we have the location
          locationLabel.textContent = "Safety Score";
          
          // Store the location data in a data attribute
          locationLabel.setAttribute('data-location', `Lat: ${latitude}, Long: ${longitude}`);
          
          // Calculate a safety score based on location (example implementation)
          calculateSafetyScore(latitude, longitude);
        },
        function(error) {
          handleLocationError(error);
        },
        { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      locationLabel.textContent = "Location Services";
      safetyScoreValue.textContent = "Unavailable";
    }
  }
  
  // Handle location errors
  function handleLocationError(error) {
    console.error("Geolocation error:", error);
    locationLabel.textContent = "Safety Score";
    
    switch(error.code) {
      case error.PERMISSION_DENIED:
        safetyScoreValue.textContent = "Access Denied";
        break;
      case error.POSITION_UNAVAILABLE:
        safetyScoreValue.textContent = "Unavailable";
        break;
      case error.TIMEOUT:
        safetyScoreValue.textContent = "Timeout";
        break;
      default:
        safetyScoreValue.textContent = "Error";
        break;
    }
  }
  
  // Calculate safety score based on location
  function calculateSafetyScore(latitude, longitude) {
    const hash = Math.sin(latitude * longitude) * 10000;
    const score = (Math.abs(hash) % 9) + 1; // Score between 1-10
    
    safetyScoreValue.textContent = score.toFixed(1);
    
    // Add appropriate styling based on score
    if (score >= 7) {
      safetyScoreValue.style.color = "#28a745"; // Green for safe
    } else if (score >= 4) {
      safetyScoreValue.style.color = "#ffc107"; // Yellow for moderate
    } else {
      safetyScoreValue.style.color = "#dc3545"; // Red for unsafe
    }
  }
  
  // Initialize location services
  getLocation();
  
  // Add tooltip or info display for the coordinates when hovering over safety score
  locationLabel.addEventListener('mouseenter', function() {
    const locationData = locationLabel.getAttribute('data-location');
    if (locationData) {
      // Create or update tooltip
      let tooltip = document.getElementById('location-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'location-tooltip';
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
      }
      tooltip.textContent = locationData;
      tooltip.style.display = 'block';
      tooltip.style.left = (event.pageX + 10) + 'px';
      tooltip.style.top = (event.pageY + 10) + 'px';
    }
  });
  
  locationLabel.addEventListener('mouseleave', function() {
    const tooltip = document.getElementById('location-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  });
});

////////////////MISBAH///////////////////////

// Handle tab navigation
document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tab.getAttribute('data-tab')) {
          content.classList.add('active');
        }
      });
    });
  });

  // ===== Monte Carlo Kavach Quiz =====
  const taxScenarios = [
      {
        "description": "If a person is arrested by the police, they must be produced before a magistrate within how many hours?",
        "options": [
          "24 hours",
          "48 hours",
          "72 hours",
          "12 hours"
        ],
        "correctOption": 0,
        "explanation": "Article 22(2) of the Indian Constitution mandates that an arrested individual must be produced before a magistrate within 24 hours to prevent unlawful detention."
      },
      {
        "description": "Under which section of CrPC can a citizen arrest a person committing a cognizable offence in their presence?",
        "options": [
          "Section 144",
          "Section 43",
          "Section 97",
          "Section 161"
        ],
        "correctOption": 1,
        "explanation": "Section 43 of the Criminal Procedure Code allows any private individual to arrest a person who commits a cognizable offence in their presence, and hand them over to the police."
      },
      
      {
        "description": "If a police officer refuses to register an FIR for a cognizable offence, what is your immediate legal remedy?",
        "options": [
          "File a writ petition",
          "Inform the media",
          "Complain to the magistrate",
          "Approach the Superintendent of Police"
        ],
        "correctOption": 3,
        "explanation": "Under Section 154(3) CrPC, you can approach the Superintendent of Police if the officer in charge refuses to file an FIR."
      },
      
      {
        "description": "Which fundamental right protects you from being forced to confess a crime?",
        "options": [
          "Right to Life - Article 21",
          "Right Against Exploitation - Article 23",
          "Right to Freedom of Religion - Article 25",
          "Right Against Self-Incrimination - Article 20(3)"
        ],
        "correctOption": 3,
        "explanation": "Article 20(3) of the Indian Constitution ensures that no person accused of a crime can be compelled to be a witness against themselves."
      },
      
      {
        "description": "Can a woman be arrested by the police after sunset and before sunrise?",
        "options": [
          "Yes, with written permission from a magistrate",
          "Yes, if the crime is serious",
          "No, never under any circumstances",
          "Yes, if female officers are available"
        ],
        "correctOption": 0,
        "explanation": "As per Section 46(4) of CrPC, women cannot be arrested after sunset and before sunrise without prior permission from a magistrate and the presence of a female officer."
      },
      
      {
        "description": "If you witness a road accident, what protection does the Good Samaritan Law offer you?",
        "options": [
          "Police cannot question you",
          "You are not legally liable for helping",
          "You must appear in court compulsorily",
          "You will receive monetary reward"
        ],
        "correctOption": 1,
        "explanation": "The Good Samaritan Law ensures that those who help accident victims are not harassed or held legally liable, encouraging people to assist without fear."
      },
            {
        "description": "Under which law can you file an RTI to ask questions about local police actions or public funds spent on safety?",
        "options": [
          "Right to Education Act",
          "Indian Penal Code",
          "Right to Information Act, 2005",
          "Consumer Protection Act"
        ],
        "correctOption": 2,
        "explanation": "The Right to Information Act, 2005 empowers citizens to request information from any public authority, including the police."
      },
      {
        "description": "If you are stopped by a police officer while driving, what document are they legally allowed to ask you for?",
        "options": [
          "Voter ID",
          "PAN Card",
          "Aadhaar Card",
          "Driver's Licence"
        ],
        "correctOption": 3,
        "explanation": "Under the Motor Vehicles Act, police can ask for your Driver’s Licence and registration documents while checking vehicles."
      },
      {
        "description": "Which constitutional article empowers a citizen to move the courts for the enforcement of their rights?",
        "options": [
          "Article 370",
          "Article 226",
          "Article 14",
          "Article 356"
        ],
        "correctOption": 1,
        "explanation": "Article 226 gives every citizen the right to move to the High Court for the enforcement of their Fundamental Rights."
      }      
      
      
      
      
  ];

  // Keeping track of used scenarios to avoid repetition
  let usedScenarioIndices = [];

  function getRandomScenario() {
    // Reseting if all scenarios have been used
    if (usedScenarioIndices.length === taxScenarios.length) {
      usedScenarioIndices = [];
    }
    
    let inx;
    do {
      inx = Math.floor(Math.random() * taxScenarios.length);
    } while (usedScenarioIndices.includes(inx));
    
    usedScenarioIndices.push(inx);
    return taxScenarios[inx];
  }

  function displayScenario() {
    const scenarioDescription = document.getElementById('scenario-description');
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');
    const nextButton = document.getElementById('next-scenario');
    
    // Safety checks
    if (!scenarioDescription || !quizOptions || !quizFeedback || !nextButton) return;
    
    const scenario = getRandomScenario();
    
    // Clear previous state
    scenarioDescription.innerHTML = `<p>${scenario.description}</p>`;
    quizOptions.innerHTML = '';
    quizFeedback.innerHTML = '';
    quizFeedback.style.display = 'none';
    quizFeedback.className = 'feedback';
    nextButton.style.display = 'none';
    
    // Add options
    scenario.options.forEach((option, index) => {
      const li = document.createElement('li');
      li.textContent = option;
      li.dataset.index = index;
      li.addEventListener('click', () => checkAnswer(index, scenario.correctOption, scenario.explanation));
      quizOptions.appendChild(li);
    });
  }

  function checkAnswer(selectedIndex, correctIndex, explanation) {
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');
    const nextButton = document.getElementById('next-scenario');
    
    // Safety checks
    if (!quizOptions || !quizFeedback || !nextButton) return;
  
    // Disable further clicks
    Array.from(quizOptions.children).forEach(li => {
      li.style.pointerEvents = 'none';
  
      // Style the correct answer
      if (parseInt(li.dataset.index) === correctIndex) {
        li.style.backgroundColor = '#c8e6c9'; 
        li.style.borderLeft = '4px solid #4CAF50';
      }
      
      // Style the incorrect selection
      if (parseInt(li.dataset.index) === selectedIndex && selectedIndex !== correctIndex) {
        li.style.backgroundColor = '#ffcdd2'; 
        li.style.borderLeft = '4px solid #e57373';
      }
    });
    
    quizFeedback.style.display = 'block';
    
    // Handle score and feedback
    if (selectedIndex === correctIndex) {
      quizFeedback.className = 'feedback correct';
      quizFeedback.innerHTML = `<p>Correct! ${explanation}</p>`;
      incrementKavachScore(2); // Increment by 2 for correct answers
    } else {
      quizFeedback.className = 'feedback incorrect';
      quizFeedback.innerHTML = `<p>Incorrect :(   ${explanation}</p>`;
      incrementKavachScore(-1); // Decrement by 1 for incorrect answers
    }
    
    nextButton.style.display = 'block';
  }
  
  // Initialize the quiz directly
  if (document.getElementById('scenario-description')) {
    displayScenario();
    const nextButton = document.getElementById('next-scenario');
    if (nextButton) {
      nextButton.addEventListener('click', displayScenario);
    }
  }

  // Text simplification functionality
  const textDiv = document.getElementById('selectedText');
  const simplytextDiv = document.getElementById('simplifiedText');
  const errorDiv = document.getElementById('error');
  const clearBtn = document.getElementById('clearBtn');
  const promptInput = document.getElementById('promptText');
  const submitBtn = document.getElementById('submitBtn');
  const outputDisplay = document.getElementById('outputDisplay');

  // Function to simplify/explain text
  function simplify(text) {
    if (!text || text.trim() === "") {
      return "No text to simplify.";
    }

    // Replace complex words with simpler synonyms
    const simpleWords = {
      "utilize": "use",
      "commence": "start"};

    let simplifiedText = text.split(/\b/).map(word => {
      return simpleWords[word.toLowerCase()] || word;
    }).join("");

    // Additional simplifications
    simplifiedText = simplifiedText.replace(/\bi\.e\.\b/g, "that is");

    return simplifiedText;
  }

  // Function to generate response based on query and context
  async function generateResponse(query, context) {
    if (!query || !context) return "Please provide both a question and text to analyze.";
  
    query = query.toLowerCase();
    context = context.toLowerCase();
  
    if (outputDisplay) {
      outputDisplay.innerHTML = '<span class="loading">Analyzing your question smartly...</span>';
    }
  
    await new Promise(resolve => setTimeout(resolve, 400));
  
    const sentences = context.split(/[.?!]\s*/).filter(Boolean);
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    const synonyms = {
      explain: ['define', 'describe', 'meaning', 'clarify'],
      cause: ['reason', 'because', 'due', 'hence'],
      steps: ['process', 'procedure', 'method', 'how'],
      compare: ['versus', 'vs', 'difference', 'similar', 'contrast'],
      list: ['examples', 'types', 'items', 'includes'],
      when: ['time', 'duration', 'timeline', 'period'],
      where: ['location', 'place', 'site', 'situated'],
      quantity: ['number', 'how many', 'how much', 'amount', 'measure']
    };
  
    const stem = (word) => word.replace(/ing$|ed$|s$/g, '');
  
    const extractKeyPhrases = (text) =>
      [...new Set(text.split(/\W+/).map(w => stem(w)).filter(w => w.length > 2 && !commonWords.has(w)))];
  
    const scoreSentence = (sentence, keywords) => {
      const words = sentence.split(/\W+/).map(stem);
      return keywords.reduce((score, k) => score + (words.includes(k) ? 1 : 0), 0);
    };
  
    const getTopSentences = (keywords, max = 3) => {
      return sentences
        .map(text => ({ text, score: scoreSentence(text, keywords) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, max)
        .map(item => item.text);
    };
  
    const classifyQuery = (query) => {
      for (let [type, triggers] of Object.entries(synonyms)) {
        if (triggers.some(trigger => query.includes(trigger))) return type;
      }
      if (query.startsWith("what is") || query.startsWith("who is")) return "explain";
      if (query.startsWith("how")) return "steps";
      if (query.startsWith("why")) return "cause";
      if (query.startsWith("when")) return "when";
      if (query.startsWith("where")) return "where";
      if (query.startsWith("list") || query.includes("what are the")) return "list";
      return "general";
    };
  
    const keywords = extractKeyPhrases(query);
    const queryType = classifyQuery(query);
  
    let response = "";
  
    switch (queryType) {
      case "explain":
        response = getTopSentences(keywords).join(' ');
        return response ? `Explanation: ${response}` : "";
  
      case "steps":
        response = sentences
          .filter(s => /first|then|next|finally|step|process/.test(s))
          .filter(s => scoreSentence(s, keywords) > 0)
          .join(' ');
        return response ? ` Process: ${response}` : "";
  
      case "cause":
        response = sentences
          .filter(s => /because|reason|due to|hence|therefore/.test(s))
          .filter(s => scoreSentence(s, keywords) > 0)
          .join(' ');
        return response ? `Reason: ${response}` : "";
  
      case "compare":
        response = sentences
          .filter(s => /while|whereas|unlike|however|compared to/.test(s))
          .filter(s => scoreSentence(s, keywords) > 0)
          .join(' ');
        return response ? `Comparison: ${response}` : "";
  
      case "when":
        response = sentences
          .filter(s => /when|after|before|during|while|until/.test(s))
          .filter(s => scoreSentence(s, keywords) > 0)
          .join(' ');
        return response ? `Time Info: ${response}` : "";
  
      case "where":
        response = sentences
          .filter(s => /in|at|on|near|located/.test(s))
          .filter(s => scoreSentence(s, keywords) > 0)
          .join(' ');
        return response ? `📍 Location: ${response}` : "";
  
      case "list":
        response = sentences
          .filter(s => /includes|such as|like|following|example/.test(s))
          .filter(s => scoreSentence(s, keywords) > 0)
          .join(' ');
        return response ? `List: ${response}` : "";
  
      case "quantity":
        response = sentences
          .filter(s => /\d+/.test(s))
          .filter(s => scoreSentence(s, keywords) > 0)
          .join(' ');
        return response ? `Quantity: ${response}` : "";
  
      default:
        const bestMatch = getTopSentences(keywords, 3);
        return bestMatch.length
          ? `Based on your query, here's what I found:\n${bestMatch.join(' ')}`
          : " :( I couldn't find exact info for that. Try rephrasing the question.";
    }
  }
  
  // Function to update the display
  function updateDisplay() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['selectedText', 'timestamp'], function(result) {
        if (chrome.runtime.lastError) {
          if (errorDiv) {
            errorDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
          }
          return;
        }
        
        if (textDiv && simplytextDiv) {
          if (result.selectedText) {
            textDiv.textContent = result.selectedText;
            simplytextDiv.textContent = simplify(result.selectedText);
          } else {
            textDiv.textContent = 'No text selected';
            simplytextDiv.textContent = 'No text selected';
          }
        }
      });
    } else if (textDiv && simplytextDiv) {
      textDiv.textContent = 'Chrome storage not available';
      simplytextDiv.textContent = 'Chrome storage not available';
    }
  }
  
  // Update display when elements are available
  if (textDiv && simplytextDiv) {
    updateDisplay();
  }
  
  // Clear button handler
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.clear(function() {
          if (textDiv) textDiv.textContent = 'No text selected';
          if (simplytextDiv) simplytextDiv.textContent = 'No text selected';
          if (outputDisplay) outputDisplay.textContent = 'Response will appear here...';
          if (promptInput) promptInput.value = '';
        });
      } else {
        if (textDiv) textDiv.textContent = 'Chrome storage not available';
        if (simplytextDiv) simplytextDiv.textContent = 'Chrome storage not available';
      }
    });
  }

  // Submit button handler
  if (submitBtn && promptInput && outputDisplay) {
    submitBtn.addEventListener('click', async function() {
      const query = promptInput.value.trim();
      const selectedText = textDiv ? textDiv.textContent : '';
      
      if (!query) {
        outputDisplay.textContent = 'Please enter a question.';
        return;
      }
      
      if (selectedText === 'No text selected' || selectedText === 'Chrome storage not available') {
        outputDisplay.textContent = 'Please select some text first.';
        return;
      }
      
      const response = await generateResponse(query, selectedText);
      outputDisplay.textContent = response;
    });

    // Enter key handler for prompt input
    promptInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        submitBtn.click();
      }
    });
  }
});
