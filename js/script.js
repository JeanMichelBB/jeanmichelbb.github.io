document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".carousel-slide");
    let currentSlide = 0;
  
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

    const iframe = document.getElementById('embedded-website');

    window.addEventListener('message', (event) => {
        // Verify the origin of the message
        if (event.origin !== 'https://twitterclone.sacenpapier.synology.me/') return;

        // Handle the message
        console.log('Message from iframe:', event.data);
    });

    // Send a message to the iframe
    iframe.onload = () => {
        iframe.contentWindow.postMessage('Hello from parent page', 'https://twitterclone.sacenpapier.synology.me/');
    };
  });
  