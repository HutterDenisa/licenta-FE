document.addEventListener("DOMContentLoaded", function () {
  const itemContainer = document.getElementById("itemContainer");
  const itemTemplate = document.getElementById("itemTemplate");

  // Fetch data from the JSON API
  fetch('http://localhost:8080/api/v1') // Replace this URL with your API endpoint
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Sort the fetched data in decreasing order based on the 'id' property
      data.sort((a, b) => b.id - a.id);

      let currentRow;

      // Loop through the fetched data and create div structures for each item
      data.forEach((item, index) => {
        if (index % 3 === 0) {
          currentRow = document.createElement("div");
          currentRow.classList.add("row");
          itemContainer.appendChild(currentRow);
        }

        // Clone the item template content
        const templateContent = itemTemplate.content.cloneNode(true);

        // Modify the cloned template with fetched data (excluding 'id' and 'poza')
        const listItems = templateContent.querySelectorAll("ul li");
        listItems[0].querySelector("a").textContent = ''; // No title available in your JSON
        listItems[1].textContent += '' + (item['tip'] || 'No tip available');
        listItems[2].textContent += '' + (item['rasa'] || 'No rasa available');
        listItems[3].textContent += '' + (item['Gen'] || 'No Gen available');
        listItems[4].textContent += '' + (item['oras'] || 'No oras available') + ', ' + (item['adresa'] || 'No adresa available');

        // Create an img element for the photo, set its source, and append it to the template
        const imgElement = document.createElement('img');
        imgElement.src = item['poza']; // 'poza' is the key for the base64 image in your API response
        imgElement.classList.add('item-photo');
        templateContent.querySelector('.photocontainer').appendChild(imgElement);

        // Append the modified template content to the currentRow
        currentRow.appendChild(templateContent);
      });
    })
    .catch(error => {
      console.error('There was a problem fetching the data: ', error);
    });
});
