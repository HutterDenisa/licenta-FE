document.addEventListener('DOMContentLoaded', function() {
    fetchUserNameAndRole();
    fetchMessages();
});

function fetchUserNameAndRole() {
    const userId = localStorage.getItem('userId');
    fetch(`http://localhost:8080/users/user/${userId}`)
        .then(response => response.json())
        .then(userData => {
            const userNameElement = document.createElement('span');
            userNameElement.textContent = `Bine ai venit, ${userData.username}!`;

            if (userData.role === "MEDIC" || userData.role === "CENTRU") {
                const pawIcon = document.createElement('img');
                pawIcon.src = 'paw-icon.png';
                pawIcon.alt = 'Paw Icon';
                pawIcon.className = 'paw-icon';
                userNameElement.appendChild(pawIcon);
            }


            localStorage.setItem('userRole', userData.role);
        })
        .catch(error => console.error('Error fetching user data:', error));
}

function fetchMessages() {
    fetch('http://localhost:8080/mesaj')
        .then(response => response.json())
        .then(messages => {
            const container = document.getElementById('messages-container');
            container.innerHTML = '';
            messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message-box';
                messageDiv.setAttribute('data-id', message.id);

                let emailContent = `Postat de: ${message.user.email}`;
                if (message.user.role === "MEDIC" || message.user.role === "CENTRU") {
                    emailContent += ` <img src="paw-icon.png" alt="Paw Icon" class="paw-icon-email">`;
                }

                messageDiv.innerHTML = `
                    <div class="email">${emailContent}</div>
                    <div class="content">${message.mesaj}</div>
                `;

                if (userIsMedic()) {
                    const replyButton = document.createElement('button');
                    replyButton.className = 'reply-button';
                    replyButton.textContent = 'Răspunde';
                    replyButton.onclick = function() { showReplyInput(message.id); };
                    messageDiv.appendChild(replyButton);
                }
                container.appendChild(messageDiv);
            });
        });
}

function userIsMedic() {

    const userRole = localStorage.getItem('userRole');
    return userRole === 'MEDIC';
}

function showReplyInput(messageId) {
    const messageDiv = document.querySelector(`.message-box[data-id='${messageId}']`);
    const existingReplyContainer = messageDiv.querySelector('.reply-input-container');
    if (existingReplyContainer) {

        return;
    }
    const replyContainer = document.createElement('div');
    replyContainer.className = 'reply-input-container';
    replyContainer.innerHTML = `
        <textarea id="replyInput-${messageId}" placeholder="Scrie răspunsul tău aici..." rows="2"></textarea>
        <button onclick="replyToMessage(${messageId})">Trimite răspunsul</button>
    `;
    messageDiv.appendChild(replyContainer);
}

function replyToMessage(messageId) {
    const replyContent = document.getElementById(`replyInput-${messageId}`).value;
    if (!replyContent.trim()) {
        alert('Scrie un răspuns');
        return;
    }

    const userId = localStorage.getItem('userId');
    const replyData = new FormData();
    replyData.append("userId", userId);
    replyData.append("mesaj", replyContent);
    replyData.append("parentId", messageId);

    fetch('http://localhost:8080/mesaj', {
        method: 'POST',
        body: replyData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Reply sent and response received:', data);
            addReplyToUI(data, messageId);
        })
        .catch(error => console.error('Error sending reply:', error));
}

function sendMessage() {
    const messageContent = document.getElementById('messageInput').value;
    if (!messageContent.trim()) {
        alert('Please write a message.');
        return;
    }
    const userId = localStorage.getItem('userId');

    const messageData = new FormData();
    messageData.append("userId", userId);
    messageData.append("mesaj", messageContent);

    fetch('http://localhost:8080/mesaj', {
        method: 'POST',
        body: messageData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Message sent and response received:', data);
            addMessageToUI(data);
        })
        .catch(error => console.error('Error sending message:', error));
}

function addMessageToUI(message) {
    const container = document.getElementById('messages-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-box';
    messageDiv.setAttribute('data-id', message.id);

    let emailContent = `Postat de: ${message.user.email}`;
    if (message.user.role === "MEDIC" || message.user.role === "CENTRU") {
        emailContent += ` <img src="paw-icon.png" alt="Paw Icon" class="paw-icon-email">`;
    }

    messageDiv.innerHTML = `
        <div class="email">${emailContent}</div>
        <div class="content">${message.mesaj}</div>
    `;

    if (userIsMedic()) {
        const replyButton = document.createElement('button');
        replyButton.className = 'reply-button';
        replyButton.textContent = 'Răspunde';
        replyButton.onclick = function() { showReplyInput(message.id); };
        messageDiv.appendChild(replyButton);
    }
    container.appendChild(messageDiv);
    document.getElementById('messageInput').value = '';
}

function addReplyToUI(reply, messageId) {
    const messageDiv = document.querySelector(`.message-box[data-id='${messageId}']`);
    if (messageDiv) {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'reply-box';
        replyDiv.innerHTML = `
            <div class="email">Replied by: ${reply.user.email}</div>
            <div class="content">${reply.mesaj}</div>
        `;
        messageDiv.appendChild(replyDiv);
    } else {
        console.error(`Message div with id ${messageId} not found`);
    }
}
