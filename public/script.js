document.addEventListener("DOMContentLoaded", function () {
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const closeBtn = document.getElementById("close-btn");

  // Toggle the sidebar when the hamburger icon is clicked
  hamburgerMenu.addEventListener("click", function () {
    dropdownMenu.classList.toggle("show");
  });

  // Close the sidebar when the close button is clicked
  closeBtn.addEventListener("click", function () {
    dropdownMenu.classList.remove("show");
  });

  // Optional: Close the sidebar when clicked outside
  document.addEventListener("click", function (event) {
    if (
      !hamburgerMenu.contains(event.target) &&
      !dropdownMenu.contains(event.target)
    ) {
      dropdownMenu.classList.remove("show");
    }
  });
});


// pre loader
// JavaScript to hide preloader after a delay once page loads
window.addEventListener('load', function() {
    // Add a small delay (e.g., 1.5 seconds) before hiding the preloader
    setTimeout(function() {
        // Add class 'loaded' to the body to hide the preloader
        document.body.classList.add('loaded');
    }, 2000); // 1500ms = 1.5 seconds delay
});