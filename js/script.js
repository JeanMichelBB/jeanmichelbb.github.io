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

  // Function to handle iframe load and server status
  function handleIframeLoad(iframeId, fallbackContainerId, serverUrl, messageElementId, pollingInterval = 5000) {
    const iframe = document.getElementById(iframeId);
    const fallbackContainer = document.getElementById(fallbackContainerId);
    const messageElement = document.getElementById(messageElementId);

    if (!iframe || !fallbackContainer || !messageElement) return;

    // Initially, show the fallback and iframe
    iframe.style.display = "block"; // Ensure the iframe is shown
    fallbackContainer.style.display = "block"; // Show fallback
    messageElement.style.display = "block"; // Show message
    messageElement.textContent = 'Checking server status...';

    function updateStatus() {
      checkServerStatus(serverUrl)
        .then(isUp => {
          if (isUp) {
            // Server is up: hide the fallback message
            fallbackContainer.style.display = "none"; // Hide the fallback when server is up
            messageElement.style.display = "none"; // Optionally hide the checking message
          } else {
            // Server is down: keep fallback visible
            messageElement.textContent = 'Server is down, please wait...'; // Optional: update message
          }
        });
    }

    // Start checking server status right away
    updateStatus();
  }

}
);
