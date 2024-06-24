function initializePage() {

  if (!localStorage.getItem('token') || !localStorage.getItem('userId')) {

    window.location.href = 'conectare/login.html';
  }

  fetch(`http://localhost:8080/users/user/${localStorage.getItem('userId')}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      })
      .then(userData => {
        if(userData.role === "ADMIN")
          window.location.href = "admin.html";
      })
      .catch(error => console.error('Error fetching user data:', error));

  const apiUrl = "http://localhost:8080/anunt";

  const logoutButton = document.getElementById('logoutButton');
  logoutButton.addEventListener('click', function () {

    logoutUser();
  });


  function displayWelcomeMessage(userName, userRole) {
    const welcomeContainer = document.getElementById('user-name');
    const welcomeMessage = document.createElement('h1');
    welcomeMessage.textContent = `Bine ai venit, ${userName}` + '!';
    welcomeMessage.style = 'text-align: center; display: inline;';


    welcomeContainer.appendChild(welcomeMessage);


    if (userRole === "MEDIC" || userRole === "CENTRU") {
      const icon = document.createElement('img');
      icon.src = 'paw-icon.png';  // Verifică această cale
      icon.alt = 'Paw Icon';
      icon.style = 'width: 24px; height: 24px; margin-left: 10px; vertical-align: middle; display: inline;';
      welcomeContainer.appendChild(icon);
    }


    if (userRole === "MEDIC" || userRole === "CENTRU") {
      document.getElementById('evenimente-section').style.display = 'block';
      document.getElementById('posteaza-eveniment-link').style.display = 'inline';
    } else {
      document.getElementById('evenimente-section').style.display = 'none';
      document.getElementById('posteaza-eveniment-link').style.display = 'none';
    }
  }


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
          const userName = userData.username;
          const userRole = userData.role;
          localStorage.setItem('userName', userName);
          displayWelcomeMessage(userName, userRole);
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
            displayAnunturi([data]);
          }
        })
        .catch(error => console.error('Eroare la obținerea datelor:', error));
  }


  function displayAnunturi(anunturi) {
    console.log("Anunturi primite:", anunturi);

    const anunturiList = document.getElementById('container');


    while (anunturiList.firstChild) {
      anunturiList.removeChild(anunturiList.firstChild);
    }


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
    if (anunt.imagePath1) {
      const imagePath = anunt.imagePath1;
      const imageName = imagePath.split('/').pop();
      imageElement.src = backendImageUrl + imageName;
      imageElement.alt = anunt.name;
    } else {

      imageElement.src = 'path_to_default_image.jpg';
      imageElement.alt = 'Default Image';
    }

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `Descriere: ${anunt.description}`;
    descriptionElement.style.textAlign = 'left';

    container.appendChild(titleElement);
    container.appendChild(imageElement);

    const details = ['tip', 'rasa', 'gen', 'culoare', 'varsta', 'oras', 'adresa', 'tipAnunt'];
    details.forEach(detail => {
      if (anunt[detail]) {
        const detailElement = document.createElement('p');
        detailElement.textContent = `${detail.charAt(0).toUpperCase() + detail.slice(1)}: ${anunt[detail]}`;
        detailElement.style.textAlign = 'left';
        container.appendChild(detailElement);
      }
    });

    const sellerNameElement = document.createElement('p');
    sellerNameElement.textContent = `Nume Vanzator: ${anunt.user ? anunt.user.username : 'undefined'}`;
    sellerNameElement.style.textAlign = 'left';


    const emailElement = document.createElement('p');
    emailElement.textContent = `Email: ${anunt.user ? anunt.user.email : 'undefined'}`;
    emailElement.style.textAlign = 'left';

    const editButton = document.createElement('button');
    editButton.textContent = 'Editare';
    editButton.style = 'border: #333; padding: 10px 15px; cursor: pointer; margin-top: 10px; border-radius: 10px; background-color: #ffa31a;  color: black; height: 35px; margin-left: 20px;';
    editButton.id = `editButton_${anunt.id}`;
    editButton.addEventListener('click', () => handleEditButtonClick(anunt.id));

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

          updateLikeButton(anuntId, updatedAnunt.nrLikes, updatedAnunt.likedByCurrentUser);
        })
        .catch(error => console.error('Eroare la adăugarea like-ului:', error));
  }
  function updateLikeButton(anuntId, nrLikes, likedByCurrentUser) {
    const likeButton = document.getElementById(`likeButton_${anuntId}`);
    if (likeButton) {
      likeButton.textContent = likedByCurrentUser ? `Unlike (${nrLikes})` : `Like (${nrLikes})`;
    }
  }

  function handleEditButtonClick(anuntId) {

    window.location.href = `editAnunt.html?id=${anuntId}`;
  }

  function handleDeleteButtonClick(anuntId) {
    const confirmation = confirm('Ești sigur că vrei să ștergi acest anunț?');

    if (confirmation) {

      const deleteUrl = `${apiUrl}/id/${anuntId}`;
      fetch(deleteUrl, { method: 'DELETE' })
          .then(response => {
            if (response.ok) {

              console.log(`Anunt ${anuntId} a fost șters.`);

              location.reload();
            } else {
              throw new Error(`Request failed with status: ${response.status}`);
            }
          })
          .catch(error => console.error('Eroare la ștergerea anunțului:', error));
    }
  }

  function logoutUser() {

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    window.location.href = 'index.html';
  }


  getStatistica();


  getUserName(localStorage.getItem('userId'));
}

function displayStatistica(statistica) {
  const ctx = document.getElementById('myChart').getContext('2d');


  const timestamps = [
    new Date(statistica.t1),
    new Date(statistica.t2),
    new Date(statistica.t3),
    new Date(statistica.t4),
    new Date(statistica.t5),
    new Date(statistica.t6),
    new Date(statistica.t7),
    new Date(statistica.t8),
    new Date(statistica.t9),
    new Date(statistica.t10)
  ];

  const activityValues = [
    statistica.act1,
    statistica.act2,
    statistica.act3,
    statistica.act4,
    statistica.act5,
    statistica.act6,
    statistica.act7,
    statistica.act8,
    statistica.act9,
    statistica.act10
  ];


  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: [{
        label: 'Activitate aprecieri postari',
        data: activityValues,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute',
            displayFormats: {
              minute:'MMM D, h:mm'
            },
            tooltipFormat: 'MMM D, h:mm'
          },
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Activity'
          }
        }
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      }
    }
  });
}


function getStatistica() {
  const userId = localStorage.getItem('userId');
  const url = `http://localhost:8080/statistica/user/${userId}`;

  fetch(url)
      .then(response => {
        console.log("Response status:", response.status);
        if (response.ok) {
          return response.text().then(text => {
            try {
              return JSON.parse(text);
            } catch (error) {
              console.error('Error parsing JSON:', text);
              throw new Error('Invalid JSON response');
            }
          });
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      })
      .then(data => {
        displayStatistica(data);
      })
      .catch(error => console.error('Eroare la obținerea datelor:', error));
}

document.addEventListener("DOMContentLoaded", initializePage);
