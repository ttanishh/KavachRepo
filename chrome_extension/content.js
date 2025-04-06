  
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fillForm') {
    fillFormWithData(message.data, message.formType);
    sendResponse({success: true});
  } else if (message.action === 'detectFormFields') {
    const fields = detectFormFields();
    sendResponse({fields: fields});
  }
  
  return true;
});

function detectFormFields() {
  const hostname = window.location.hostname;
  let fieldsFound = [];
  
  let siteMapping = null;
  for (const site in fieldMappings) {
    if (hostname.includes(site)) {
      siteMapping = fieldMappings[site];
      break;
    }
  }
  
  if (!siteMapping) {
    return fieldsFound;
  }
  
  for (const field in siteMapping) {
    const selector = siteMapping[field];
    const element = document.querySelector(selector);
    if (element) {
      fieldsFound.push({
        id: field,
        selector: selector,
        type: element.type || 'text'
      });
    }
  }
  
  return fieldsFound;
}

function fillFormWithData(data, formType) {
  const hostname = window.location.hostname;
  
  let siteMapping = null;
  for (const site in fieldMappings) {
    if (hostname.includes(site)) {
      siteMapping = fieldMappings[site];
      break;
    }
  }
  
  if (!siteMapping) {
    console.warn('No field mapping found for this website');
    return;
  }
  
  for (const fieldId in data) {
    const mappedField = `${formType}_${fieldId}`;
    const selector = siteMapping[mappedField];
    
    if (selector) {
      const element = document.querySelector(selector);
      if (element) {
        element.value = data[fieldId];
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        
        highlightField(element);
      }
    }
  }
  
  showNotification(`Successfully filled ${Object.keys(data).length} fields`);
}

function highlightField(element) {
  const originalBackground = element.style.backgroundColor;
  const originalTransition = element.style.transition;
  
  element.style.transition = 'background-color 1s';
  element.style.backgroundColor = '#e6f7ff';
  
  setTimeout(() => {
    element.style.backgroundColor = originalBackground;
    element.style.transition = originalTransition;
  }, 1000);
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 20px';
  notification.style.backgroundColor = '#4CAF50';
  notification.style.color = 'white';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '10000';
  notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}
/////////////////////////////////////
function addAssistantButton() {
  const button = document.createElement('button');
  button.textContent = 'KAVACH ASSISTANT';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.padding = '10px 15px';
  button.style.backgroundColor = '#0c677c'; 
  button.style.color = 'white';
  button.style.border = 'solid 2px white';
  button.style.borderRadius = '4px';
  button.style.zIndex = '10000';
  button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  button.style.cursor = 'move'; 
  let isDragging = false;
  let offsetX, offsetY;

  // Mouse Down event
  button.addEventListener('mousedown', (e) => {
    isDragging = false; // Reset drag state
    
    const rect = button.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    // Set a small threshold for dragging
    const startX = e.clientX;
    const startY = e.clientY;
    
    function onMouseMove(e) {
      // Check if we've moved enough to consider it a drag
      if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
        isDragging = true;
        
        button.style.right = 'auto';
        button.style.bottom = 'auto';
        button.style.left = `${e.clientX - offsetX}px`;
        button.style.top = `${e.clientY - offsetY}px`;
      }
    }
    e.preventDefault();
  });
    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mouseup', function() {
      const selectedText = window.getSelection().toString().trim();
      
      if (selectedText.length > 0) {
        // Store the selected text to Chrome storage
        chrome.storage.local.set({
          'selectedText': selectedText,
          'timestamp': new Date().getTime()
        }, function() {
          console.log('Text selected and saved to storage:', selectedText.substring(0, 50) + '...');
        });
      }
    });

    


  // Click event - now separate from drag functionality
  button.addEventListener('click', (e) => {
    if (isDragging) return; // Don't open if we were dragging
    
    // Create and open iframe-based popup instead of using chrome.action.openPopup()
    const existingPopup = document.getElementById('kavach-popup-iframe');
    if (existingPopup) {
      // If popup exists, toggle visibility
      if (existingPopup.style.display === 'none') {
        existingPopup.style.display = 'block';
      } else {
        existingPopup.style.display = 'none';
      }
      return;
    }
    
    // Create popup iframe
    const popup = document.createElement('iframe');
    popup.id = 'kavach-popup-iframe';
    popup.src = chrome.runtime.getURL('popup.html');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '400px';
    popup.style.height = '600px';
    popup.style.border = '1px solid #ccc';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    popup.style.zIndex = '10001';
    popup.style.backgroundColor = 'white';
    
    // Add close button for the popup
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'fixed';
    closeButton.style.top = `calc(50% - 300px - 20px)`;
    closeButton.style.left = `calc(50% + 200px - 20px)`;
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.borderRadius = '50%';
    closeButton.style.backgroundColor = '#0c677c';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '10002';
    closeButton.style.display = 'flex';
    closeButton.style.alignItems = 'center';
    closeButton.style.justifyContent = 'center';
    
    closeButton.addEventListener('click', () => {
      document.body.removeChild(popup);
      document.body.removeChild(closeButton);
    });
    
    document.body.appendChild(popup);
    document.body.appendChild(closeButton);
  });
  
  document.body.appendChild(button);
}

(function init() {
  if (document.readyState === 'complete') {
    addAssistantButton();
  } else {
    window.addEventListener('load', addAssistantButton);
  }
})();