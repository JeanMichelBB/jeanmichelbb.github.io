// js.script.js
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".carousel-slide");
  let currentSlide = 0;
  
  function toggleLanguage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const currentLanguage = welcomeMessage.getAttribute('data-language');

    if (currentLanguage === 'en') {
      welcomeMessage.textContent = 'Bonjour, bienvenue';
      welcomeMessage.setAttribute('data-language', 'fr');
    } else {
      welcomeMessage.textContent = 'Hello, welcome';
      welcomeMessage.setAttribute('data-language', 'en');
    }
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

  // Send a message to the iframe
  const twitterIframe = document.getElementById('embedded-website-twitter');
  if (twitterIframe) {
    twitterIframe.onload = () => {
      twitterIframe.contentWindow.postMessage('Hello from parent page', 'https://twitterclone.sacenpapier.synology.me/');
    };
  }

  function handleIframeLoad(iframeId, fallbackMessageId, serverUrl) {
    const iframe = document.getElementById(iframeId);
    const fallbackMessage = document.getElementById(fallbackMessageId);

    if (!iframe || !fallbackMessage) return;

    // Check if the server is reachable
    function checkServerStatus(url) {
      return fetch(url, { method: 'HEAD' })
        .then(response => {
          if (!response.ok) throw new Error('Server not reachable');
          return true;
        })
        .catch(error => {
          console.error('Server is down:', error);
          return false;
        });
    }

    checkServerStatus(serverUrl)
      .then(isUp => {
        if (isUp) {
          iframe.style.display = "block";
          fallbackMessage.style.display = "none";
        } else {
          iframe.style.display = "none";
          fallbackMessage.style.display = "block";
        }
      });

    // The iframe element doesn't always trigger the error event. So rely on visibility check.
  }

  // For BotWhy iframe
  handleIframeLoad('embedded-website-botwhy', 'fallback-message-botwhy', 'https://botwhy.sacenpapier.synology.me/');

  // For Twitter Clone iframe
  handleIframeLoad('embedded-website-twitter', 'fallback-message-twitter', 'https://twitterclone.sacenpapier.synology.me/');

  // For Grafana
  handleIframeLoad('embedded-website-grafana', 'fallback-message-grafana', 'https://grafana.sacenpapier.synology.me/');
});