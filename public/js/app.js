async function loadButtons() {
    try {
        const response = await fetch('/api/buttons');
        const buttons = await response.json();
        const buttonList = document.getElementById('buttonList');
        buttonList.innerHTML = '';

        Object.entries(buttons).forEach(([buttonId, response]) => {
            const buttonCard = createButtonCard(buttonId, response);
            buttonList.appendChild(buttonCard);
        });
    } catch (error) {
        console.error('Error loading buttons:', error);
    }
}

function createButtonCard(buttonId, response) {
    const card = document.createElement('div');
    card.className = 'bg-white p-6 rounded-lg shadow-md';
    
    card.innerHTML = `
        <div class="flex justify-between items-start">
            <div class="flex-1">
                <h3 class="text-lg font-semibold mb-2">${buttonId}</h3>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">Response:</label>
                    <textarea
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        rows="2"
                    >${response}</textarea>
                </div>
                <button
                    onclick="updateButton('${buttonId}', this.parentElement.querySelector('textarea').value)"
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Save Changes
                </button>
            </div>
        </div>
    `;
    
    return card;
}

async function updateButton(buttonId, newResponse) {
    try {
        const response = await fetch(`/api/buttons/${encodeURIComponent(buttonId)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ response: newResponse }),
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Button response updated successfully!');
        } else {
            alert('Failed to update button response.');
        }
    } catch (error) {
        console.error('Error updating button:', error);
        alert('Error updating button response.');
    }
}

// Load buttons when the page loads
document.addEventListener('DOMContentLoaded', loadButtons);