document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const evenimentId = urlParams.get('id');

    const editEvenimentForm = document.getElementById('editEvenimentForm');

    // Populează formularul cu datele anunțului existent
    fetch(`http://localhost:8080/eveniment/old/edit/${evenimentId}`)
        .then(response => response.json())
        .then(eveniment => {
            document.getElementById('title').value = eveniment.name;
            document.getElementById('description').value = eveniment.description;
            document.getElementById('oras').value = eveniment.oras;
            document.getElementById('locatie').value = eveniment.locatie;
            // Alte câmpuri pentru editare
            document.getElementById('image').files[0] = eveniment.imaginePath1;
            // La submit, trimite actualizările către backend
            editEvenimentForm.addEventListener('submit', function (event) {
                event.preventDefault();
                submitEditedEveniment(evenimentId);
            });
        })
        .catch(error => console.error('Eroare la obținerea detaliilor pentru editare:', error));
});

function submitEditedEveniment(evenimentId) {
    const editedEvenimentData = {
        name: document.getElementById('title').value,
        description: document.getElementById('description').value,
        locatie: document.getElementById('locatie').value,
        oras: document.getElementById('oras').value,
        image: document.getElementById('image').files[0],
        // Alte câmpuri pentru editare
    };

    // Trimite actualizările către backend
    fetch(`http://localhost:8080/eveniment/edit/${evenimentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedEvenimentData)
    })
        .then(response => {
            if (response.ok) {
                console.log(`Eveniment ${evenimentId} a fost actualizat.`);
                // Redirecționează utilizatorul către pagina cu anunțurile sale sau altă destinație relevantă
                window.location.href = 'account.html';
            } else {
                throw new Error(`Request failed with status: ${response.status}`);
            }
        })
        .catch(error => console.error('Eroare la actualizarea evenimentului:', error));
}

function back(){
    window.location.href = 'account.html';
}
