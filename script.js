document.addEventListener("DOMContentLoaded", function () {
  const itemContainer = document.getElementById("itemContainer");
  const itemTemplate = document.getElementById("itemTemplate");


  fetch('http://localhost:8080/api/v1')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {

      data.sort((a, b) => b.id - a.id);

      let currentRow;


      data.forEach((item, index) => {
        if (index % 3 === 0) {
          currentRow = document.createElement("div");
          currentRow.classList.add("row");
          itemContainer.appendChild(currentRow);
        }

        const templateContent = itemTemplate.content.cloneNode(true);

        const listItems = templateContent.querySelectorAll("ul li");
        listItems[0].querySelector("a").textContent = '';
        listItems[1].textContent += '' + (item['tip'] || 'No tip available');
        listItems[2].textContent += '' + (item['rasa'] || 'No rasa available');
        listItems[3].textContent += '' + (item['Gen'] || 'No Gen available');
        listItems[4].textContent += '' + (item['oras'] || 'No oras available') + ', ' + (item['adresa'] || 'No adresa available');

        const imgElement = document.createElement('img');
        imgElement.src = item['poza'];
        imgElement.classList.add('item-photo');
        templateContent.querySelector('.photocontainer').appendChild(imgElement);


        currentRow.appendChild(templateContent);
      });
    })
    .catch(error => {
      console.error('There was a problem fetching the data: ', error);
    });
});
