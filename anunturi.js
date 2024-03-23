function initializePage() {
  const apiUrl = "http://localhost:8080/anunt";

  updateNavbar();

  function getAnunturi(name) {
    const url = name ? `${apiUrl}/anunt/${name}` : apiUrl;

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      })
      .then(data => {
        if (Array.isArray(data)) {
          console.log("Data received:", data);
          displayAnunturi(data);
        } else {
          console.log("Single data received:", data);
          displayAnunturi([data]);
        }
      })
      .catch(error => console.error('Eroare la obținerea datelor:', error));
  }

  function displayAnunturi(anunturi) {
    const container = document.getElementById('container');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }


    anunturi.forEach(anunt => {
      const anuntElement = createAnuntElement(anunt);
      container.appendChild(anuntElement);
    });
  }

  function createAnuntElement(anunt) {
    const backendImageUrl = "http://localhost:8080/anunt/image/";
    const container = document.createElement('div');
    container.classList.add('anunt');

    const titleElement = document.createElement('h2');
    titleElement.textContent = anunt.name;

    const imageElement = document.createElement('img');
    const imagePath = anunt.path;
    const imageName = imagePath.split('/').pop();
    imageElement.src = backendImageUrl + imageName;
    imageElement.alt = anunt.name;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `Descriere: ${anunt.description}`;
    descriptionElement.style='text-align: left;';

    const sellerNameElement = document.createElement('p');
    sellerNameElement.textContent = `Nume Vanzator: ${anunt.user.name}`;
    sellerNameElement.style='text-align: left;';

    const emailElement = document.createElement('p');
    emailElement.textContent = `Email: ${anunt.user.email}`;
    emailElement.style='text-align: left; ';

    const tipElement = document.createElement('p');
    tipElement.textContent = `Tip : ${anunt.tip}`;
    tipElement.style='text-allign: left;';

    const rasaElement = document.createElement('p');
    rasaElement.textContent = `Rasa : ${anunt.rasa}`;
    rasaElement.style='text-allign: left;';

    const orasElement = document.createElement('p');
    orasElement.textContent = `Oras : ${anunt.tip}`;
    orasElement.style='text-allign: left;';

    container.appendChild(titleElement);
    container.appendChild(imageElement);
    container.appendChild(descriptionElement);
    container.appendChild(sellerNameElement);
    container.appendChild(emailElement);
    container.append(tipElement);
    container.append(rasaElement);
    container.append(orasElement);

    const likeButton = document.createElement('button');
    likeButton.textContent = `Like (${anunt.nrLikes})`;
    likeButton.style='background-color: #ffa31a; color: black; border: #333; padding: 10px 15px; cursor: pointer; margin-top: 10px; border-radius: 10px;';
    likeButton.id = `likeButton_${anunt.id}`;
    likeButton.addEventListener('click', () => handleLikeButtonClick(anunt.id));

    container.appendChild(likeButton);

    return container;
  }

  function handleLikeButtonClick(anuntId) {
    const likeUrl = `${apiUrl}/like/${anuntId}`;

    fetch(likeUrl, { method: 'PUT' })
      .then(response => response.json())
      .then(updatedAnunt => {
        console.log(`Like status changed for Anunt ${anuntId}. New nrLikes: ${updatedAnunt.nrLikes}`);
        updateLikeButton(anuntId, updatedAnunt.nrLikes);
      })
      .catch(error => console.error('Eroare la adăugarea like-ului:', error));
  }

  function updateLikeButton(anuntId, nrLikes) {
    const likeButton = document.getElementById(`likeButton_${anuntId}`);
    if (likeButton) {
      likeButton.textContent = nrLikes > 0 ? `Unlike (${nrLikes})` : `Like (${nrLikes})`;
    }
  }



  function searchAnunturi() {
    var input = document.getElementById('search-input');
    var filter = input.value.trim();


    if (filter === '') {
      getAnunturi();
    } else {

      getAnunturi(filter);
    }
  }


  document.getElementById('searchButton').addEventListener('click', searchAnunturi);

  document.getElementById('search-input').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      searchAnunturi();
    }
  });

  function updateNavbar() {
    var token = localStorage.getItem('token');
    var navbar = document.getElementById('myNavbar');

    if (token) {
      // Utilizatorul este autentificat, afișează "Profil" și ascunde "Conecteaza-te"
      navbar.innerHTML = `


      <ul>
        <li><a href="#home" style="font-size: 30px"><b>Acasa</b></a></li>

        <li><a href="#despre" style="font-size: 30px"><b>Despre noi</b></a></li>
        <li><a href="#contact" style="font-size: 30px"><b>Contact</b></a> </li>
        <li><a href="#" style="font-size: 30px"><b>Anunturi</b></a>
          <ul>
            <li><a href="#" style="font-size: medium" ><b>Animal spre adoptie</b></a></li>
            <li><a href="anunturi.html" style="font-size: medium"><b>Animal pierdut</b></a></li>
            <li><a href="#" style="font-size: medium"><b>Animal spre vanzare</b></a></li>
          </ul>
        </li>
        <li><a href="roata.html" style="font-size: 20px"><b>Roata</b></a></li>
        <li><a href="account.html" style="font-size: 20px"><b>Profil</b></a></li>

      </ul>


            `;
    } else {
      // Utilizatorul nu este autentificat, afișează "Conecteaza-te" și ascunde "Profil"
      navbar.innerHTML = `

      <ul>
        <li><a href="#home" style="font-size: 30px"><b>Acasa</b></a></li>

        <li><a href="#despre" style="font-size: 30px"><b>Despre noi</b></a></li>
        <li><a href="#contact" style="font-size: 30px"><b>Contact</b></a> </li>
        <li><a href="#" style="font-size: 30px"><b>Anunturi</b></a>
          <ul>
            <li><a href="#" style="font-size: medium" ><b>Animal spre adoptie</b></a></li>
            <li><a href="anunturi.html" style="font-size: medium"><b>Animal pierdut</b></a></li>
            <li><a href="#" style="font-size: medium"><b>Animal spre vanzare</b></a></li>
          </ul>
        </li>
        <li><a href="roata.html" style="font-size: 20px"><b>Roata</b></a></li>
        <li><a href="conectare/login.html" style="font-size: 30px"><b>Conectare</b></a></li>
      </ul>


            `;
    }
  }


  getAnunturi();
}

document.addEventListener("DOMContentLoaded", initializePage);
