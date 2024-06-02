document.addEventListener('DOMContentLoaded', () => {
  const apiUrlAnunt = "http://localhost:8080/anunt";
  const apiUrlUsers = "http://localhost:8080/users";

  // Funcția pentru a obține și afișa toate anunțurile
  function getAnunturi() {
    fetch(apiUrlAnunt)
      .then(response => response.json())
      .then(data => displayAnunturi(data))
      .catch(error => console.error('Eroare la obținerea anunțurilor:', error));
  }

  // Funcția pentru a afișa anunțurile
  function displayAnunturi(anunturi) {
    const container = document.getElementById('anunturi-container');
    container.innerHTML = '';

    anunturi.forEach(anunt => {
      const anuntElement = document.createElement('div');
      anuntElement.classList.add('anunt');
      anuntElement.innerHTML = `
                <h2>${anunt.name}</h2>
                <p>Descriere: ${anunt.description}</p>
                <button onclick="deleteAnunt(${anunt.id})">Ștergere</button>
            `;
      container.appendChild(anuntElement);
    });
  }

  // Funcția pentru a șterge un anunț
  window.deleteAnunt = function (anuntId) {
    if (confirm('Ești sigur că vrei să ștergi acest anunț?')) {
      fetch(`${apiUrlAnunt}/id/${anuntId}`, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            console.log(`Anunt ${anuntId} a fost șters.`);
            getAnunturi(); // Reîncarcă lista de anunțuri
          } else {
            throw new Error(`Request failed with status: ${response.status}`);
          }
        })
        .catch(error => console.error('Eroare la ștergerea anunțului:', error));
    }
  };

  // Funcția pentru a obține și afișa toți utilizatorii
  function getUsers() {
    fetch(apiUrlUsers)
      .then(response => response.json())
      .then(data => {
        console.log('Received users:', data); // Adăugăm un console log pentru a verifica datele
        displayUsers(data);
      })
      .catch(error => console.error('Eroare la obținerea utilizatorilor:', error));
  }

  // Funcția pentru a afișa utilizatorii
  function displayUsers(users) {
    const container = document.getElementById('users-container');
    container.innerHTML = '';

    users.forEach(user => {
      const userElement = document.createElement('div');
      userElement.classList.add('user');

      // Adăugăm emoji-ul sau icon-ul în funcție de rolul utilizatorului
      let nameWithRole = user.username ? user.username : 'Nume neprecizat';
      if (user.role === 'MEDIC' || user.role === 'CENTRU') {
        nameWithRole += ' <i class="fas fa-paw"></i>'; // Adăugăm icon-ul cu labuță
      }

      userElement.innerHTML = `
                <h2>${nameWithRole}</h2>
                <p>Email: ${user.email}</p>
                <button onclick="deleteUser(${user.id})">Ștergere</button>
            `;
      container.appendChild(userElement);
    });
  }

  // Funcția pentru a șterge un utilizator
  window.deleteUser = function (userId) {
    if (confirm('Ești sigur că vrei să ștergi acest utilizator?')) {
      fetch(`${apiUrlUsers}/id/${userId}`, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            console.log(`Utilizator ${userId} a fost șters.`);
            getUsers(); // Reîncarcă lista de utilizatori
          } else {
            throw new Error(`Request failed with status: ${response.status}`);
          }
        })
        .catch(error => console.error('Eroare la ștergerea utilizatorului:', error));
    }
  };

  // Inițializează pagina
  getAnunturi();
  getUsers();
});
