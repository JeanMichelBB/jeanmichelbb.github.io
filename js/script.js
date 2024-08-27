// js.script.js
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".carousel-slide");
  let currentSlide = 0;
  let translations = {};

  const textElement = document.getElementById('typingText');
  let text = '';
  let index = 0;

  function type() {
    if (index < text.length) {
      textElement.textContent += text.charAt(index);
      index++;
      setTimeout(type, 50); // Adjust speed here
    }
  }

  fetch('translations.json')
    .then(response => response.json())
    .then(data => {
      translations = data; // Assign the fetched data to the translations variable

      // Determine the current language
      const language = 'en'; // Replace with logic to get the user's language
      text = translations[language].typingText;
      type();
    })
    .catch(error => console.error('Error fetching translations:', error));

  function toggleLanguage() {
    const elements = document.querySelectorAll('[data-language]');
    const currentLanguage = elements[0]?.getAttribute('data-language');
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    const languageButton = document.getElementById('languageButton');

    elements.forEach(element => {
      const key = element.id;
      if (translations[newLanguage] && translations[newLanguage][key]) {
        element.textContent = translations[newLanguage][key];
        element.setAttribute('data-language', newLanguage);
      }
    });

    // Update the button text to indicate the next language toggle
    if (languageButton) {
      languageButton.textContent = newLanguage;
    }

    // Update and retype the typing text
    text = translations[newLanguage].typingText;
    textElement.textContent = ''; // Clear current text
    index = 0; // Reset index
    type(); // Start typing effect
  }

  // Attach the language toggle function to the button
  const languageButton = document.querySelector("#languageButton");
  if (languageButton) {
    languageButton.addEventListener('click', toggleLanguage);
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "block" : "none";
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  // Display the first slide when the page loads
  showSlide(currentSlide);

  // Attach navigation functions to arrow buttons
  document.querySelector(".carousel-navigation.prev").onclick = prevSlide;
  document.querySelector(".carousel-navigation.next").onclick = nextSlide;

  window.addEventListener('message', (event) => {
    // Verify the origin of the message
    if (event.origin !== 'https://twitterclone.sacenpapier.synology.me/') return;

    // Handle the message
    console.log('Message from iframe:', event.data);
  });
// Function to send a message to the iframe
function sendMessageToIframe(iframe, message, origin) {
  if (iframe) {
    iframe.onload = () => {
      iframe.contentWindow.postMessage(message, origin);
    };
  }
}

// Function to check server status
function checkServerStatus(url, timeout = 5000) {
  console.log('Attempting to check server status for:', url);
  return Promise.race([
    fetch(url, { method: 'GET' })
      .then(response => {
        console.log('Fetch response status:', response.status);
        return response.ok;
      }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
  ])
  .catch(error => {
    console.error('Error checking server status:', error);
    return false;
  });
}

// Function to handle iframe load and server status
function handleIframeLoad(iframeId, fallbackContainerId, serverUrl, messageElementId, pollingInterval = 5000) {
  const iframe = document.getElementById(iframeId);
  const fallbackContainer = document.getElementById(fallbackContainerId);
  const messageElement = document.getElementById(messageElementId);

  if (!iframe || !fallbackContainer || !messageElement) return;

  function updateStatus() {
    checkServerStatus(serverUrl)
      .then(isUp => {
        if (isUp) {
          iframe.style.display = "block";
          fallbackContainer.style.display = "none";
          messageElement.style.display = "none";
        } else {
          iframe.style.display = "none";
          fallbackContainer.style.display = "block";
          messageElement.style.display = "block";
          messageElement.textContent = 'Server is down, please wait...';
          setTimeout(updateStatus, pollingInterval); // Poll every `pollingInterval` milliseconds
        }
      });
  }

  updateStatus();
}

// For BotWhy iframe
handleIframeLoad('embedded-website-botwhy', 'fallbackContainerBotwhy', 'https://botwhy.sacenpapier.synology.me/', 'messageBotwhy');

// For Twitter Clone iframe
handleIframeLoad('embedded-website-twitter', 'fallbackContainerTwitter', 'https://twitterclone.sacenpapier.synology.me/', 'messageTwitter');

// For Grafana iframe
handleIframeLoad('embedded-website-grafana', 'fallbackContainerGrafana', 'https://grafana.sacenpapier.synology.me/', 'messageGrafana');

// Optionally send a message to the Twitter iframe after it loads
const twitterIframe = document.getElementById('embedded-website-twitter');
sendMessageToIframe(twitterIframe, 'Hello from parent page', 'https://twitterclone.sacenpapier.synology.me/');
});