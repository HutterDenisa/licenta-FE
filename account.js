function initializePage() {

  if (!localStorage.getItem('token') || !localStorage.getItem('userId')) {
    // Utilizatorul nu este autentificat, redirectionare către pagina de login
    window.location.href = 'conectare/login.html';
  }

  const apiUrl = "http://localhost:8080/anunt";

  const logoutButton = document.getElementById('logoutButton');
  logoutButton.addEventListener('click', function () {
    // Apelul funcției pentru deconectare
    logoutUser();
  });

  // Funcția pentru afișarea mesajului de bun venit
  function displayWelcomeMessage(userName, userRole) {
    const welcomeContainer = document.getElementById('user-name');
    const welcomeMessage = document.createElement('h1');
    welcomeMessage.textContent = `Bine ai venit, ${userName}`;
    welcomeMessage.style = 'text-align: center; display: inline;';  // Modificat pentru aliniere

    // Adaugă mesajul de bun venit în container
    welcomeContainer.appendChild(welcomeMessage);

    // Verifică rolul utilizatorului și adaugă iconul dacă este necesar
    if (userRole === "MEDIC" || userRole === "CENTRU") {
      const icon = document.createElement('img');
      icon.src = 'paw-icon.png';  // Verifică această cale
      icon.alt = 'Paw Icon';
      icon.style = 'width: 24px; height: 24px; margin-left: 10px; vertical-align: middle; display: inline;';
      welcomeContainer.appendChild(icon);
    }
  }


  // Funcția pentru a obține numele utilizatorului din server
  function getUserName(userId) {
    const userUrl = `http://localhost:8080/users/user/${userId}`;

    fetch(userUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      })
      .then(userData => {
        const userName = userData.username; // Asumăm că numele utilizatorului este disponibil în răspuns
        const userRole = userData.role; // Asumăm că rolul este de asemenea disponibil
        localStorage.setItem('userName', userName); // Salvează numele utilizatorului în Local Storage
        displayWelcomeMessage(userName, userRole); // Modificată pentru a include rolul
        getAnunturi(userId);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }

  function getAnunturi(userId) {
    const url = `${apiUrl}/userId/${userId}`;

    fetch(url)
      .then(response => {
        console.log("Response status:", response.status);
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
          displayAnunturi([data]); // Convert single object to an array
        }
      })
      .catch(error => console.error('Eroare la obținerea datelor:', error));
  }

  // Funcția pentru afișarea anunțurilor
  function displayAnunturi(anunturi) {
    console.log("Anunturi primite:", anunturi);

    const anunturiList = document.getElementById('container');

    // Sterge anunțurile existente (dacă există)
    while (anunturiList.firstChild) {
      anunturiList.removeChild(anunturiList.firstChild);
    }

    // Adaugă anunțurile noi
    anunturi.forEach(anunt => {
      const anuntElement = createAnuntElement(anunt);
      anunturiList.appendChild(anuntElement);
    });
  }

  function createAnuntElement(anunt) {
    const backendImageUrl = "http://localhost:8080/anunt/image/";
    const container = document.createElement('div');
    container.classList.add('anunt');

    const titleElement = document.createElement('h2');
    titleElement.textContent = anunt.name;

    const imageElement = document.createElement('img');
    if (anunt.imagePath1) {  // Verificăm dacă există calea imaginii
      const imagePath = anunt.imagePath1;
      const imageName = imagePath.split('/').pop();
      imageElement.src = backendImageUrl + imageName;
      imageElement.alt = anunt.name;
    } else {
      // Setează o imagine implicită în cazul în care anunt.imagePath1 este undefined
      imageElement.src = 'path_to_default_image.jpg'; // Poți înlocui cu calea reală către imaginea implicită
      imageElement.alt = 'Default Image';
    }

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `Descriere: ${anunt.description}`;
    descriptionElement.style.textAlign = 'left';

    const sellerNameElement = document.createElement('p');
    sellerNameElement.textContent = `Nume Vanzator: ${anunt.user ? anunt.user.name : 'undefined'}`;
    sellerNameElement.style.textAlign = 'left';

    const emailElement = document.createElement('p');
    emailElement.textContent = `Email: ${anunt.user ? anunt.user.email : 'undefined'}`;
    emailElement.style.textAlign = 'left';

    const editButton = document.createElement('button');
    editButton.textContent = 'Editare';
    editButton.style = 'border: #333; padding: 10px 15px; cursor: pointer; margin-top: 10px; border-radius: 10px; background-color: #ffa31a;  color: black; height: 35px; margin-left: 20px;';
    editButton.id = `editButton_${anunt.id}`;
    editButton.addEventListener('click', () => handleEditButtonClick(anunt.id));

    container.appendChild(titleElement);
    container.appendChild(imageElement);
    container.appendChild(descriptionElement);
    container.appendChild(sellerNameElement);
    container.appendChild(emailElement);

    const likeButton = document.createElement('button');
    likeButton.style = 'border: #333; padding: 10px 15px; cursor: pointer; margin-top: 10px; border-radius: 10px; background-color: #ffa31a;  color: black; height: 35px;';
    likeButton.textContent = `Like (${anunt.nrLikes})`;
    likeButton.id = `likeButton_${anunt.id}`;
    likeButton.addEventListener('click', () => handleLikeButtonClick(anunt.id));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Ștergere';
    deleteButton.id = `deleteButton_${anunt.id}`;
    deleteButton.addEventListener('click', () => handleDeleteButtonClick(anunt.id));
    deleteButton.style = 'border: #333; padding: 10px 15px; cursor: pointer; margin-top: 10px; border-radius: 10px; background-color: #ffa31a;  color: black; height: 35px; margin-left: 20px;';

    container.appendChild(likeButton);
    container.appendChild(editButton);
    container.appendChild(deleteButton);

    return container;
  }

  function handleLikeButtonClick(anuntId) {
    const likeUrl = `${apiUrl}/like/${anuntId}`;

    fetch(likeUrl, { method: 'PUT' })
      .then(response => response.json())
      .then(updatedAnunt => {
        console.log(`Like status changed for Anunt ${anuntId}. New nrLikes: ${updatedAnunt.nrLikes}`);
        // Actualizează interfața cu noul număr de "like"-uri
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

  function handleEditButtonClick(anuntId) {
    // Redirecționează utilizatorul către pagina de editare, trimițând ID-ul anunțului
    window.location.href = `editAnunt.html?id=${anuntId}`;
  }

  function handleDeleteButtonClick(anuntId) {
    const confirmation = confirm('Ești sigur că vrei să ștergi acest anunț?');

    if (confirmation) {
      // Trimite o cerere de ștergere către backend
      const deleteUrl = `${apiUrl}/id/${anuntId}`;
      fetch(deleteUrl, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            // Actualizează interfața după ștergere
            console.log(`Anunt ${anuntId} a fost șters.`);
            // Reîncarcă pagina sau actualizează lista anunțurilor în alt mod
            location.reload();
          } else {
            throw new Error(`Request failed with status: ${response.status}`);
          }
        })
        .catch(error => console.error('Eroare la ștergerea anunțului:', error));
    }
  }

  function logoutUser() {
    // Șterge token-ul, userId-ul și userName-ul din localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    updateNavbar();

    // Redirecționează utilizatorul la pagina de login
    window.location.href = 'index.html';
  }

  function updateNavbar() {
    var token = localStorage.getItem('token');
    var navbar = document.getElementById('myNavbar');

    if (token) {
      // Utilizatorul este autentificat, afișează "Profil" și ascunde "Conecteaza-te"
      navbar.innerHTML = `
                <img class="navbar-logo" height="80px" src="logo2.png" style=" width: 100px; height: 100px; border-radius: 150px 150px 150px 150px;">
                <a class="navbar-link" href="indexsucces.html">Acasa</a>
                <a class="navbar-link" href="contact.html">Contacteaza-ne!</a>
                <a class="navbar-link" href="echipa.html">Echipa</a>
                <a class="navbar-link" href="anunturi.html">Anunturi</a>
                <a class="navbar-link" href="formularanunturi.html">Posteaza anunt</a>
                <a class="navbar-link" href="account.html">Profil</a>
            `;
    } else {
      // Utilizatorul nu este autentificat, afișează "Conecteaza-te" și ascunde "Profil"
      navbar.innerHTML = `
            <img class="navbar-logo" height="80px" src="logo2.png" style=" width: 100px; height: 100px; border-radius: 150px 150px 150px 150px;">
                <a class="navbar-link" href="index.html">Acasa</a>
                <a class="navbar-link" href="contact.html">Contacteaza-ne!</a>
                <a class="navbar-link" href="echipa.html">Echipa</a>
                <a class="navbar-link" href="anunturi.html">Anunturi</a>
                <a class="navbar-link" href="formularanunturi.html">Posteaza anunt</a>
                <a class="navbar-link" href="login.html" style="text-decoration: none;">Conecteaza-te</a>
            `;
    }
  }

  getUserName(localStorage.getItem('userId'));
}
document.addEventListener("DOMContentLoaded", initializePage);
