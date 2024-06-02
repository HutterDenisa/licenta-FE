function initializePage() {
  const apiUrl = "http://localhost:8080/anunt";
  updateNavbar();

  document.getElementById('searchButton').addEventListener('click', () => searchAnunturi());
  document.getElementById('search-input').addEventListener('input', function () {
    const query = this.value.trim();
    searchAnunturi(query);
  });

  function getAnunturi(query = '') {
    const url = query ? `${apiUrl}/search/${query}` : apiUrl;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        displayAnunturi(data);
      })
      .catch(error => {
        console.error('Error fetching announcements:', error);
      });
  }

  function displayAnunturi(anunturi) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    anunturi.forEach(anunt => {
      container.appendChild(createAnuntElement(anunt));
    });
  }

  function createAnuntElement(anunt) {
    const backendImageUrl = "http://localhost:8080/anunt/image/";
    const container = document.createElement('div');
    container.classList.add('anunt');

    const titleElement = document.createElement('h2');
    titleElement.textContent = anunt.name;
    container.appendChild(titleElement);

    if (anunt.imagePath1) {
      const imageElement = document.createElement('img');
      const imageName = anunt.imagePath1.split('/').pop();
      imageElement.src = `${backendImageUrl}${imageName}`;
      imageElement.alt = 'Announcement Image';
      container.appendChild(imageElement);
    }

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `Descriere: ${anunt.description}`;
    container.appendChild(descriptionElement);

    const userElement = document.createElement('p');
    userElement.textContent = `Utilizator: ${anunt.user.username}`;
    if (anunt.user.role === "MEDIC" || anunt.user.role === "CENTRU") {
      const icon = document.createElement('img');
      icon.src = 'paw-icon.png'; // Verificați că calea este corectă
      icon.alt = 'Paw Icon';
      icon.className = 'user-icon';
      userElement.appendChild(icon);
    }
    container.appendChild(userElement);

    const likeButton = document.createElement('button');
    likeButton.textContent = `Like (${anunt.nrLikes})`;
    likeButton.addEventListener('click', () => toggleLike(anunt.id));
    container.appendChild(likeButton);

    return container;
  }

  function toggleLike(anuntId) {
    const likeUrl = `${apiUrl}/like/${anuntId}`;
    fetch(likeUrl, { method: 'PUT' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(updatedAnunt => {
        console.log(`Like status changed for Anunt ${anuntId}. New nrLikes: ${updatedAnunt.nrLikes}`);
        updateLikeButton(anuntId, updatedAnunt.nrLikes);
      })
      .catch(error => {
        console.error('Error when liking an announcement:', error);
      });
  }

  function updateLikeButton(anuntId, nrLikes) {
    const likeButton = document.getElementById(`likeButton_${anuntId}`);
    if (likeButton) {
      likeButton.textContent = `Like (${nrLikes})`;
    }
  }

  function updateNavbar() {
    const token = localStorage.getItem('token');
    const navbar = document.getElementById('myNavbar');

    if (token) {
      navbar.innerHTML = `<a class="navbar-link" href="indexsucces.html">Home</a>`;
    } else {
      navbar.innerHTML = `<a class="navbar-link" href="login.html">Login</a>`;
    }
  }

  function searchAnunturi(query = '') {
    getAnunturi(query);
  }

  // Initialize the page by fetching all announcements
  getAnunturi();
}

document.addEventListener("DOMContentLoaded", initializePage);
