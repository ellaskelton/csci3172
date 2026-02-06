let creatures = [];

function createCreatureObject(name, type, habitat, imageUrl, notes) {
    return {
        id: Date.now(),
        name: name,
        type: type,
        habitat: habitat,
        imageUrl: imageUrl || '',
        notes: notes || ''
    };
}

function resetForm() {
    document.getElementById('addCreatureForm').reset();
}

function displayCreatures(creaturesToDisplay = creatures) {
    const sanctuary = document.getElementById('creatureSanctuary');
    sanctuary.innerHTML = '';
    
    if (creaturesToDisplay.length === 0) {
        sanctuary.innerHTML = '<p class="text-muted">No creatures found. Add some fantastic beasts to your sanctuary!</p>';
        return;
    }
    
    const container = document.createElement('div');
    container.className = 'row';
    
    creaturesToDisplay.forEach(creature => {
        const card = createCreatureCard(creature);
        container.appendChild(card);
    });
    
    sanctuary.appendChild(container);
}

function createCreatureCard(creature) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    
    const card = document.createElement('div');
    card.className = 'card h-100';
    card.setAttribute('data-creature-id', creature.id);
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    if (creature.imageUrl) {
        const img = document.createElement('img');
        img.src = creature.imageUrl;
        img.alt = creature.name;
        img.className = 'card-img-top';
        img.style.maxHeight = '200px';
        img.style.objectFit = 'cover';
        img.onerror = function() {
            this.style.display = 'none';
        };
        card.appendChild(img);
    }
    
    const nameHeading = document.createElement('h5');
    nameHeading.className = 'card-title';
    nameHeading.textContent = creature.name;
    cardBody.appendChild(nameHeading);
    
    const typePara = document.createElement('p');
    typePara.className = 'card-text';
    typePara.innerHTML = '<strong>Type:</strong> ' + creature.type;
    cardBody.appendChild(typePara);
    
    const habitatPara = document.createElement('p');
    habitatPara.className = 'card-text';
    habitatPara.innerHTML = '<strong>Habitat:</strong> ' + creature.habitat;
    cardBody.appendChild(habitatPara);
    
    if (creature.notes) {
        const notesPara = document.createElement('p');
        notesPara.className = 'card-text';
        notesPara.innerHTML = '<strong>Notes:</strong> ' + creature.notes;
        cardBody.appendChild(notesPara);
    }
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger btn-sm mt-2';
    removeBtn.textContent = 'Remove Creature';
    removeBtn.onclick = function() {
        removeCreature(creature.id);
    };
    cardBody.appendChild(removeBtn);
    
    card.appendChild(cardBody);
    col.appendChild(card);
    
    return col;
}

function addCreature(event) {
    event.preventDefault();
    
    const name = document.getElementById('creatureName').value.trim();
    const type = document.getElementById('creatureType').value.trim();
    const habitat = document.getElementById('creatureHabitat').value.trim();
    const imageUrl = document.getElementById('creatureImageUrl').value.trim();
    const notes = document.getElementById('creatureNotes').value.trim();
    
    if (!name || !type || !habitat) {
        alert('Please fill in all required fields (Name, Type, and Habitat).');
        return;
    }
    
    const creature = createCreatureObject(name, type, habitat, imageUrl, notes);
    
    creatures.push(creature);
    
    resetForm();
    
    displayCreatures();
    
    document.getElementById('searchInput').value = '';
}

function removeCreature(creatureId) {
    if (confirm('Are you sure you want to remove this creature from the sanctuary?')) {
        creatures = creatures.filter(creature => creature.id !== creatureId);
        
        displayCreatures();
        
        const searchValue = document.getElementById('searchInput').value.trim();
        if (searchValue) {
            searchCreatures();
        }
    }
}

function searchCreatures() {
    const searchValue = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (searchValue === '') {
        displayCreatures();
        return;
    }
    
    const filteredCreatures = creatures.filter(creature => {
        const nameMatch = creature.name.toLowerCase().includes(searchValue);
        const typeMatch = creature.type.toLowerCase().includes(searchValue);
        return nameMatch || typeMatch;
    });
    
    displayCreatures(filteredCreatures);
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addCreatureForm');
    if (form) {
        form.addEventListener('submit', addCreature);
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchCreatures);
    }
    
    displayCreatures();
});
