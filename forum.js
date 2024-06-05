document.addEventListener('DOMContentLoaded', function() {
    fetchMessages();
});


function fetchMessages() {
    fetch('http://localhost:8080/mesaj')
        .then(response => response.json())
        .then(messages => {
            const container = document.getElementById('messages-container');
            messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message-box';
                messageDiv.innerHTML = `
                    <div class="email">Posted by: ${message.user.email}</div>
                    <div class="content">${message.mesaj}</div>
                `;
                if (userIsMedic()) { // Assuming there's a function or flag to check if the user is a MEDIC
                    const replyButton = document.createElement('button');
                    replyButton.className = 'reply-button';
                    replyButton.textContent = 'Reply';
                    replyButton.onclick = function() { replyToMessage(message.id); };
                    messageDiv.appendChild(replyButton);
                }
                container.appendChild(messageDiv);
            });
        });
}

function userIsMedic() {
    // You should implement this based on your authentication logic
    return true; // Temporary placeholder
}

function replyToMessage(messageId) {
    console.log('Reply to message ID:', messageId);
    // Implement the reply functionality here


const messageContent = document.getElementById('messageInput').value;
if (!messageContent.trim()) {
    alert('Please write a message.');
    return;
}
    const message = {
        userId: localStorage.getItem('userId'),
        messaj: messageContent
    };

    fetch('http://localhost:8080/mesaj', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message) // Ensure your backend is set to receive this structure or adapt accordingly
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
    messageDiv.innerHTML = `
        <div class="email">Posted by: ${message.user.email}</div>
        <div class="content">${message.content}</div>
    `;
    container.appendChild(messageDiv); // Append new message to the container
    document.getElementById('messageInput').value = ''; // Clear the input field
}
// console.log('Sending message:', message);
