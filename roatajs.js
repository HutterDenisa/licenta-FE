
async function fetchFilteredData(filters) {
  try {
    const { culoare, gen, oras, tip } = filters;
    const response = await fetch(`http://localhost:8080/anunt/roata/${oras}/${gen}/${tip}/${culoare}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem fetching the data: ', error);
    return [];
  }
}

document.querySelectorAll('.form-container input').forEach(input => {
  input.addEventListener('focus', function() {
    this.style.boxShadow = '0 0 0 30px white inset';
    this.style.borderColor = '#f8d7e8';
  });
  input.addEventListener('input', function() {
    this.style.backgroundColor = 'white';
    this.style.color = '#333';
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('filterForm');
  const container = document.querySelector(".container");
  const stoper = document.querySelector(".stoper");
  const mid = document.querySelector(".mid");
  const resultContainer = document.getElementById('resultContainer');

  let spinning = false;

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!spinning) {
      spinning = true;

      const filters = {
        culoare: form.culoare.value || "any",
        gen: form.gen.value || "any",
        oras: form.oras.value || "any",
        tip: form.tip.value || "any"
      };

      const anunturi = await fetchFilteredData(filters);

      if (anunturi.length === 0) {
        alert("Nu s-au găsit anunțuri care să corespundă criteriilor.");
        spinning = false;
        return;
      }

      const degrees = Math.ceil(Math.random() * 10000);
      const stopDegrees = degrees + 360 * 6;

      container.style.transition = "transform 5s ease-out";
      container.style.transform = `rotate(${stopDegrees}deg)`;

      setTimeout(() => {
        spinning = false;
        container.style.transition = "none";

        const currentRotation = stopDegrees % 360;
        const partIndex = Math.floor(currentRotation / 60);
        const selectedAnunt = anunturi[partIndex % anunturi.length];

        displayAnunt(selectedAnunt);

      }, 5000);
    }
  });

  function displayAnunt(anunt) {
    resultContainer.innerHTML = '';

    const anuntElement = document.createElement('div');
    anuntElement.classList.add('anunt');

    const titleElement = document.createElement('h2');
    titleElement.textContent = anunt.name;
    anuntElement.appendChild(titleElement);

    if (anunt.imagePath1) {
      const imageElement = document.createElement('img');
      imageElement.src = `http://localhost:8080/anunt/image/${anunt.imagePath1.split('/').pop()}`;
      imageElement.alt = 'Announcement Image';
      anuntElement.appendChild(imageElement);
    }

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `Descriere: ${anunt.description}`;
    anuntElement.appendChild(descriptionElement);

    const details = ['tip', 'rasa', 'gen', 'culoare', 'varsta', 'oras', 'adresa', 'tipAnunt'];
    details.forEach(detail => {
      if (anunt[detail]) {
        const detailElement = document.createElement('p');
        detailElement.textContent = `${detail.charAt(0).toUpperCase() + detail.slice(1)}: ${anunt[detail]}`;
        anuntElement.appendChild(detailElement);
      }
    });
    const usernameElement = document.createElement('p');
    usernameElement.textContent = `Utilizator: ${anunt.user.username}`;
    anuntElement.appendChild(usernameElement);

    resultContainer.appendChild(anuntElement);
    resultContainer.style.display = 'block';
  }
});
