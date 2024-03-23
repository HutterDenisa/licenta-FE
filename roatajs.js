// Function to fetch data from the API
async function fetchData() {
  try {
    const response = await fetch('http://localhost:8080/api/v1');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.map(item => item.image_url);
  } catch (error) {
    console.error('There was a problem fetching the data: ', error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const container = document.querySelector(".container");
  const parts = document.querySelectorAll(".part");
  const btn = document.getElementById("spin");
  const stoper = document.querySelector(".stoper");
  const mid = document.querySelector(".mid");

  let spinning = false;

  // Function to simulate the spinning effect
  async function startSpinning() {
    if (!spinning) {
      spinning = true;

      // Fetch image URLs from the API
      const imageUrls = await fetchData();

      const degrees = Math.ceil(Math.random() * 10000);
      const stopDegrees = degrees + 360 * 6; // Rotates at least 6 full circles before stopping

      container.style.transition = "transform 5s ease-out";
      container.style.transform = `rotate(${stopDegrees}deg)`;

      setTimeout(async () => {
        spinning = false;
        container.style.transition = "none";

        const currentRotation = stopDegrees % 360;
        const partIndex = Math.floor(currentRotation / 60);
        const selectedImageUrl = imageUrls[partIndex];

        // Fetch the link for the selected item (assuming item ID starts from 1)
        const selectedItemId = partIndex + 1;
        const itemLink = `http://localhost/anunt?=${selectedItemId}`;

        // Redirect to the selected item's link
        window.location.href = itemLink;
      }, 5000); // Adjust this timeout value according to your transition duration
    }
  }

  btn.addEventListener("click", startSpinning);
});
