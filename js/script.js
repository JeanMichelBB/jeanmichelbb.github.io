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
  });
  