document.addEventListener('DOMContentLoaded', () => {
  const apiUrlAnunt = "http://localhost:8080/anunt";
  const apiUrlUsers = "http://localhost:8080/users";
  const apiUrlEvenimente = "http://localhost:8080/eveniment";

  const logoutButton = document.getElementById('logoutButton');
  logoutButton.addEventListener('click', function () {

    logoutUser();
  });
  // Search functionality setup
  document.getElementById('search-anunturi').addEventListener('input', function () {
    searchAnunturi(this.value.trim());
  });

  document.getElementById('search-evenimente').addEventListener('input', function () {
    searchEvenimente(this.value.trim());
  });

  document.getElementById('search-users').addEventListener('input', function () {
    searchUsers(this.value.trim());
  });

  function searchAnunturi(query) {
    fetch(`${apiUrlAnunt}/search/${query}`)
        .then(response => response.json())
        .then(data => displayAnunturi(data))
        .catch(error => console.error('Error searching announcements:', error));
  }

  function searchEvenimente(query) {
    fetch(`${apiUrlEvenimente}/search/${query}`)
        .then(response => response.json())
        .then(data => displayEvenimente(data))
        .catch(error => console.error('Error searching events:', error));
  }

  function logoutUser() {

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');


    window.location.href = 'index.html';
  }

  function searchUsers(query) {
    fetch(`${apiUrlUsers}/search/${query}`)
        .then(response => response.json())
        .then(data => displayUsers(data))
        .catch(error => console.error('Error searching users:', error));
  }

  function getAnunturi() {
    fetch(apiUrlAnunt)
        .then(response => response.json())
        .then(data => displayAnunturi(data))
        .catch(error => console.error('Error fetching announcements:', error));
  }

  function displayAnunturi(anunturi) {
    const container = document.getElementById('anunturi-container');
    container.innerHTML = '';
    anunturi.forEach(anunt => {
      const anuntElement = document.createElement('div');
      anuntElement.classList.add('anunt');
      anuntElement.innerHTML = `
        <h2>${anunt.name}</h2>
        <p>Description: ${anunt.description}</p>
        <button onclick="deleteAnunt(${anunt.id})">Delete</button>
      `;
      container.appendChild(anuntElement);
    });
  }

  function getEvenimente() {
    fetch(apiUrlEvenimente)
        .then(response => response.json())
        .then(data => displayEvenimente(data))
        .catch(error => console.error('Error fetching events:', error));
  }

  function displayEvenimente(evenimente) {
    const container = document.getElementById('evenimente-container');
    container.innerHTML = '';
    evenimente.forEach(eveniment => {
      const eventElement = document.createElement('div');
      eventElement.classList.add('eveniment');
      eventElement.innerHTML = `
        <h2>${eveniment.name}</h2>
        <p>Description: ${eveniment.description}</p>
        <button onclick="deleteEveniment(${eveniment.id})">Delete</button>
      `;
      container.appendChild(eventElement);
    });
  }

  function getUsers() {
    fetch(apiUrlUsers)
        .then(response => response.json())
        .then(data => displayUsers(data))
        .catch(error => console.error('Error fetching users:', error));
  }

  function displayUsers(users) {
    const container = document.getElementById('users-container');
    container.innerHTML = '';
    users.forEach(user => {
      const userElement = document.createElement('div');
      userElement.classList.add('user');

      let nameWithRole = user.username;
      if (user.role === 'MEDIC' || user.role === 'CENTRU') {
        nameWithRole += ' <i class="fas fa-paw"></i>';
      }

      userElement.innerHTML = `
        <h2>${nameWithRole}</h2>
        <p>Email: ${user.email}</p>
        <button onclick="deleteUser(${user.id})">Delete</button>
      `;
      container.appendChild(userElement);
    });
  }


  getAnunturi();
  getEvenimente();
  getUsers();
});
