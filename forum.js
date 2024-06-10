document.addEventListener('DOMContentLoaded', function() {
    fetchUserNameAndRole();
    fetchMessages();
});

function fetchUserNameAndRole() {
    const userId = localStorage.getItem('userId'); // Ensure userId is stored in localStorage
    fetch(`http://localhost:8080/users/user/${userId}`)
        .then(response => response.json())
        .then(userData => {
            const userNameElement = document.createElement('span');
            userNameElement.textContent = `Bine ai venit, ${userData.username}!`;

            if (userData.role === "MEDIC" || userData.role === "CENTRU") {
                const pawIcon = document.createElement('img');
                pawIcon.src = 'paw-icon.png'; // Replace with the correct path to your icon
                pawIcon.alt = 'Paw Icon';
                pawIcon.className = 'paw-icon';
                userNameElement.appendChild(pawIcon);
            }

            document.body.insertBefore(userNameElement, document.getElementById('messages-container'));
        })
        .catch(error => console.error('Error fetching user data:', error));
}


function fetchMessages() {
    fetch('http://localhost:8080/mesaj')
        .then(response => response.json())
        .then(messages => {
            const container = document.getElementById('messages-container');
            container.innerHTML = ''; // Clear container before adding messages
            messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message-box';
                messageDiv.setAttribute('data-id', message.id); // Add data-id attribute
                messageDiv.innerHTML = `
                    <div class="email">Postat de: ${message.user.email}</div>
                    <div class="content">${message.mesaj}</div>
                `;
                if (userIsMedic()) { // Add reply button only for MEDIC role
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
    // Assuming the role is stored in localStorage
    const userRole = localStorage.getItem('userRole');
    return userRole === 'MEDIC';
}

function showReplyInput(messageId) {
    const messageDiv = document.querySelector(`.message-box[data-id='${messageId}']`);
    const existingReplyContainer = messageDiv.querySelector('.reply-input-container');
    if (existingReplyContainer) {
        // If a reply input already exists, do not create another one
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

    const userId = localStorage.getItem('userId'); // Ensure userId is stored in localStorage
    const replyData = new FormData();
    replyData.append("userId", userId);
    replyData.append("mesaj", replyContent);
    replyData.append("parentId", messageId); // Include parent message ID if needed

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
            console.log('Reply sent and response received:', data); // Verify what is being returned
            addReplyToUI(data, messageId); // Assume `data` is the reply object as expected
        })
        .catch(error => console.error('Error sending reply:', error));
}

function sendMessage() {
    const messageContent = document.getElementById('messageInput').value;
    if (!messageContent.trim()) {
        alert('Please write a message.');
        return;
    }
    const userId = localStorage.getItem('userId'); // Ensure userId is stored in localStorage

    const messageData = new FormData();
    messageData.append("userId", userId);
    messageData.append("mesaj", messageContent);

    fetch('http://localhost:8080/mesaj', {
        method: 'POST',
        body: messageData, // Ensure your backend is set to receive this structure or adapt accordingly
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Message sent and response received:', data); // Verify what is being returned
            addMessageToUI(data); // Assume `data` is the message object as expected
        })
        .catch(error => console.error('Error sending message:', error));
}

function addMessageToUI(message) {
    const container = document.getElementById('messages-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-box';
    messageDiv.setAttribute('data-id', message.id); // Add data-id attribute
    messageDiv.innerHTML = `
        <div class="email">Posted by: ${message.user.email}</div>
        <div class="content">${message.mesaj}</div>
    `;
    if (userIsMedic()) { // Add reply button for new messages
        const replyButton = document.createElement('button');
        replyButton.className = 'reply-button';
        replyButton.textContent = 'Răspunde';
        replyButton.onclick = function() { showReplyInput(message.id); };
        messageDiv.appendChild(replyButton);
    }
    container.appendChild(messageDiv); // Append new message to the container
    document.getElementById('messageInput').value = ''; // Clear the input field
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
        messageDiv.appendChild(replyDiv); // Append new reply to the message
    } else {
        console.error(`Message div with id ${messageId} not found`);
    }
}
