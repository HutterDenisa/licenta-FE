function initializePage() {
    const apiUrl = "http://localhost:8080/eveniment";
    updateNavbar();

    document.getElementById('searchButton').addEventListener('click', () => searchEvenimente());
    document.getElementById('search-input').addEventListener('input', function () {
        const query = this.value.trim();
        searchEveniment(query);
    });

    function getEvenimente(query = '') {
        const url = query ? `${apiUrl}/search/${query}` : apiUrl;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                displayEvenimente(data);
            })
            .catch(error => {
                console.error('Error fetching announcements:', error);
            });
    }

    function displayEvenimente(evenimente) {
        const container2 = document.getElementById('container2');
        container2.innerHTML = '';
        evenimente.forEach(eveniment => {
            container2.appendChild(createEvenimentElement(eveniment));
        });
    }

    function createEvenimentElement(eveniment) {
        const backendImageUrl = "http://localhost:8080/eveniment/image/";
        const container2 = document.createElement('div');
        container2.classList.add('eveniment');

        const titleElement = document.createElement('h2');
        titleElement.textContent = eveniment.name;
        container2.appendChild(titleElement);

        if (eveniment.imagePath1) {
            const imageElement = document.createElement('img');
            const imageName = eveniment.imagePath1.split('/').pop();
            imageElement.src = `${backendImageUrl}${imageName}`;
            imageElement.alt = 'Announcement Image';
            container2.appendChild(imageElement);
        }

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = `Descriere: ${eveniment.description}`;
        container2.appendChild(descriptionElement);

        const details = ['oras', 'locatie'];
        details.forEach(detail => {
            if (eveniment[detail]) {
                const detailElement = document.createElement('p');
                detailElement.textContent = `${detail.charAt(0).toUpperCase() + detail.slice(1)}: ${eveniment[detail]}`;
                container2.appendChild(detailElement);
            }
        });

        const userElement = document.createElement('p');
        userElement.textContent = `Utilizator: ${eveniment.user.username}`;
        if (eveniment.user.role === "MEDIC" || eveniment.user.role === "CENTRU") {
            const icon = document.createElement('img');
            icon.src = 'paw-icon.png'; // Verificați că calea este corectă
            icon.alt = 'Paw Icon';
            icon.className = 'user-icon';
            userElement.appendChild(icon);
        }
        container2.appendChild(userElement);

        const emailElement = document.createElement('p');
        emailElement.textContent = `Email: ${eveniment.user.email}`;
        container2.appendChild(emailElement);

        const likeButton = document.createElement('button');
        likeButton.style = 'border: #333; padding: 10px 15px; cursor: pointer; margin-top: 10px; border-radius: 10px; background-color: #ffa31a;  color: black; height: 35px;';
        likeButton.textContent = `Like (${eveniment.nrLikes})`;
        likeButton.id = `likeButton_${eveniment.id}`;
        likeButton.addEventListener('click', () => handleLikeButtonClick(eveniment.id));
        container2.appendChild(likeButton);

        return container2;
    }


    function handleLikeButtonClick(evenimentId) {
        const likeUrl = `${apiUrl}/like/${evenimentId}`;

        fetch(likeUrl, { method: 'PUT' })
            .then(response => response.json())
            .then(updatedEveniment => {
                console.log(`Like status changed for Eveniment ${evenimentId}. New nrLikes: ${updatedEveniment.nrLikes}`);
                updateLikeButton(evenimentId, updatedEveniment.nrLikes);
            })
            .catch(error => console.error('Eroare la adăugarea like-ului:', error));
    }

    function updateLikeButton(evenimentId, nrLikes) {
        const likeButton = document.getElementById(`likeButton_${evenimentId}`);
        if (likeButton) {
            likeButton.textContent = nrLikes > 0 ? `Unlike (${nrLikes})` : `Like (${nrLikes})`;
        }
    }


    function updateNavbar() {
        const token = localStorage.getItem('token');
        const navbar = document.getElementById('myNavbar');

        if (token) {
            navbar.innerHTML = `<nav class="navbar-comp" id="myNavbar">
    <img src="logoFurever.png" alt="Furever Logo">
    <a class="navbar-link "><a href="index.html" style="text-decoration: none;">Acasa</a></a>
    <a class="navbar-link "><a href="adaugareanunturi.html" style="text-decoration: none;">Posteaza evenimente</a></a>
    <a class="navbar-link "><a href="account.html" style="text-decoration: none;">Profil</a></a>
    </nav>`;
        } else {
            navbar.innerHTML = `<a class="navbar-link" href="login.html">Login</a>`;
        }
    }

    function searchEvenimente(query = '') {
        getEvenimente(query);
    }

    getEvenimente();
}

document.addEventListener("DOMContentLoaded", initializePage);
