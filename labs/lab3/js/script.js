let inventory = [];
let originalPrices = new Map();
let currentDiscount = null;

function initializeInventory() {
    originalPrices.clear();
    currentDiscount = null;
    inventory = [
        {
            name: "Healing Potion",
            type: "healing",
            price: 25.99,
            quantity: 15,
            description: "Restores health.",
            image: "img/healing-potion.png"
        },
        {
            name: "Mana Elixir",
            type: "enhancement",
            price: 32.50,
            quantity: 12,
            description: "Restores magical energy.",
            image: "img/mana-elixir.png"
        },
        {
            name: "Strength Brew",
            type: "enhancement",
            price: 28.75,
            quantity: 10,
            description: "Increases physical strength.",
            image: "img/strength-brew.png"
        },
        {
            name: "Invisibility Draught",
            type: "transformation",
            price: 45.00,
            quantity: 8,
            description: "Makes user invisible.",
            image: "img/invisibility-draught.png"
        },
        {
            name: "Fire Resistance Tonic",
            type: "protection",
            price: 35.25,
            quantity: 14,
            description: "Protects against fire.",
            image: "img/fire-resistance-tonic.png"
        },
        {
            name: "Speed Serum",
            type: "enhancement",
            price: 30.00,
            quantity: 11,
            description: "Increases movement speed.",
            image: "img/speed-serum.png"
        },
        {
            name: "Wisdom Potion",
            type: "enhancement",
            price: 40.50,
            quantity: 9,
            description: "Improves mental clarity.",
            image: "img/wisdom-potion.png"
        },
        {
            name: "Poison Antidote",
            type: "healing",
            price: 22.99,
            quantity: 18,
            description: "Cures poison.",
            image: "img/poison-antidote.png"
        },
        {
            name: "Love Potion",
            type: "transformation",
            price: 50.00,
            quantity: 5,
            description: "Creates feelings of affection.",
            image: "img/love-potion.png"
        },
        {
            name: "Night Vision Elixir",
            type: "enhancement",
            price: 27.50,
            quantity: 13,
            description: "Enables vision in darkness.",
            image: "img/night-vision-elixir.png"
        },
        {
            name: "Regeneration Potion",
            type: "healing",
            price: 38.75,
            quantity: 7,
            description: "Restores health over time.",
            image: "img/regeneration-potion.png"
        },
        {
            name: "Luck Elixir",
            type: "enhancement",
            price: 42.00,
            quantity: 6,
            description: "Increases luck.",
            image: "img/luck-elixir.png"
        },
        {
            name: "Frost Protection Potion",
            type: "protection",
            price: 33.50,
            quantity: 10,
            description: "Protects against cold.",
            image: "img/frost-protection-potion.png"
        },
        {
            name: "Lightning Bolt Elixir",
            type: "legendary",
            price: 47.75,
            quantity: 4,
            description: "Allows casting lightning spells.",
            image: "img/lightning-bolt-elixir.png"
        },
        {
            name: "Lightning Bolt Elixir",
            type: "legendary",
            price: 47.75,
            quantity: 4,
            description: "Allows casting lightning spells.",
            image: "img/lightning-bolt-elixir.png"
        },
        {
            name: "Teleportation Serum",
            type: "transformation",
            price: 55.00,
            quantity: 3,
            description: "Teleports user to known locations.",
            image: "img/teleportation-serum.png"
        },
        {
            name: "Shapeshifting Draught",
            type: "transformation",
            price: 60.00,
            quantity: 2,
            description: "Transforms user into any creature.",
            image: "img/shapeshifting-draught.png"
        },
        {
            name: "Time Freeze Potion",
            type: "legendary",
            price: 75.00,
            quantity: 1,
            description: "Stops time briefly.",
            image: "img/time-freeze-potion.png"
        },
        {
            name: "Ethan Potion",
            type: "legendary",
            price: 100.00,
            quantity: 1,
            description: "Special potion for Ethan. Grants power and wisdom.",
            image: "img/ethan-potion.png"
        },
        {
            name: "Phoenix Tears",
            type: "healing",
            price: 65.00,
            quantity: 2,
            description: "Grants resurrection and eternal youth.",
            image: "img/phoenix-tears.png"
        },
        {
            name: "Dragon Scale Elixir",
            type: "protection",
            price: 70.00,
            quantity: 1,
            description: "Provides protection and strength.",
            image: "img/dragon-scale-elixir.png"
        }
    ];
    
    inventory.forEach(item => {
        originalPrices.set(item.name, item.price);
    });
    
    listItems();
    updateStats();
    updateDiscountDisplay();
}

function addItem(item) {
    try {
        if (!item || typeof item !== 'object') {
            throw new Error("Invalid item object provided");
        }
        
        if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
            throw new Error("Item name is required and must be a non-empty string");
        }
        
        if (!item.type || typeof item.type !== 'string' || item.type.trim() === '') {
            throw new Error("Item type is required and must be a non-empty string");
        }
        
        if (typeof item.price !== 'number' || item.price < 0) {
            throw new Error("Price must be a non-negative number");
        }
        
        if (typeof item.quantity !== 'number' || item.quantity < 0 || !Number.isInteger(item.quantity)) {
            throw new Error("Quantity must be a non-negative integer");
        }
        
        if (!item.description || typeof item.description !== 'string') {
            throw new Error("Description is required and must be a string");
        }

        originalPrices.set(item.name, item.price);
        
        if (currentDiscount !== null) {
            const discountMultiplier = 1 - (currentDiscount / 100);
            item.price = parseFloat((item.price * discountMultiplier).toFixed(2));
        }

        inventory.push(item);
        listItems();
        updateStats();
        return true;
    } catch (error) {
        return false;
    }
}

function removeItem(itemName) {
    try {
        if (!itemName || typeof itemName !== 'string' || itemName.trim() === '') {
            throw new Error("Item name is required");
        }

        const index = inventory.findIndex(item => 
            item.name.toLowerCase() === itemName.toLowerCase()
        );

        if (index === -1) {
            throw new Error(`Item "${itemName}" not found in inventory`);
        }

        inventory.splice(index, 1);
        listItems();
        updateStats();
        return true;
    } catch (error) {
        return false;
    }
}

function getItem(itemName) {
    try {
        if (!itemName || typeof itemName !== 'string' || itemName.trim() === '') {
            throw new Error("Item name is required");
        }

        const item = inventory.find(invItem => 
            invItem.name.toLowerCase() === itemName.toLowerCase()
        );

        if (!item) {
            throw new Error(`Item "${itemName}" not found in inventory`);
        }

        return item;
    } catch (error) {
        return null;
    }
}

function listItems() {
    const container = document.getElementById('inventoryContainer');
    if (!container) {
        console.error("Inventory container not found");
        return;
    }

    container.innerHTML = '';
    container.classList.remove('category-container');
    container.classList.add('inventory-grid');

    if (inventory.length === 0) {
        container.innerHTML = '<p class="empty-message">No items in inventory</p>';
        return;
    }

    inventory.forEach((item, index) => {
        const itemCard = createItemCard(item, index);
        container.appendChild(itemCard);
    });

    updateStats();
}

function createItemCard(item, index) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.index = index;
    card.dataset.name = item.name.toLowerCase();
    card.dataset.type = item.type.toLowerCase();

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'item-image-wrapper';
    
    if (item.image && item.image.trim() !== '') {
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.name;
        image.className = 'item-image';
        image.onerror = function() {
            this.style.display = 'none';
        };
        imageWrapper.appendChild(image);
    }

    const name = document.createElement('h3');
    name.className = 'item-name';
    name.textContent = item.name;

    const type = document.createElement('p');
    type.className = 'item-type';
    type.textContent = `Type: ${item.type}`;

    const price = document.createElement('p');
    price.className = 'item-price';
    price.textContent = `$${item.price.toFixed(2)}`;

    const quantity = document.createElement('p');
    quantity.className = 'item-quantity';
    quantity.textContent = `Quantity: ${item.quantity}`;

    const description = document.createElement('p');
    description.className = 'item-description';
    description.textContent = item.description;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-remove';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => removeItem(item.name);

    card.appendChild(imageWrapper);
    card.appendChild(name);
    card.appendChild(type);
    card.appendChild(price);
    card.appendChild(quantity);
    card.appendChild(description);
    card.appendChild(removeBtn);

    return card;
}

function searchItems(query) {
    try {
        if (!query || typeof query !== 'string' || query.trim() === '') {
            throw new Error("Search query is required");
        }

        const searchTerm = query.toLowerCase().trim();
        const container = document.getElementById('inventoryContainer');
        
        if (!container) {
            console.error("Inventory container not found");
            return;
        }

        container.innerHTML = '';
        container.classList.remove('category-container');
        container.classList.add('inventory-grid');

        const matchingItems = inventory.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.type.toLowerCase().includes(searchTerm)
        );

        if (matchingItems.length === 0) {
            container.innerHTML = `<p class="empty-message">No items found matching "${query}"</p>`;
            return [];
        }

        matchingItems.forEach((item, index) => {
            const originalIndex = inventory.findIndex(invItem => invItem.name === item.name);
            const itemCard = createItemCard(item, originalIndex);
            container.appendChild(itemCard);
        });

        return matchingItems;
    } catch (error) {
        return [];
    }
}

function calculateTotalValue() {
    try {
        if (inventory.length === 0) {
            return 0;
        }

        let totalValue = 0;
        for (let i = 0; i < inventory.length; i++) {
            totalValue += inventory[i].price * inventory[i].quantity;
        }

        updateStats();
        return totalValue;
    } catch (error) {
        return 0;
    }
}

function groupByCategory() {
    try {
        if (inventory.length === 0) {
            return {};
        }

        const categoryMap = new Map();

        inventory.forEach(item => {
            const type = item.type.toLowerCase();
            if (!categoryMap.has(type)) {
                categoryMap.set(type, []);
            }
            categoryMap.get(type).push(item);
        });

        const container = document.getElementById('inventoryContainer');
        if (!container) {
            console.error("Inventory container not found");
            return categoryMap;
        }

        container.innerHTML = '';
        container.classList.remove('inventory-grid');
        container.classList.add('category-container');

        categoryMap.forEach((items, category) => {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';

            const categoryHeader = document.createElement('h3');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} - ${items.length} items`;
            categorySection.appendChild(categoryHeader);

            const categoryGrid = document.createElement('div');
            categoryGrid.className = 'category-grid';

            items.forEach((item, index) => {
                const originalIndex = inventory.findIndex(invItem => invItem.name === item.name);
                const itemCard = createItemCard(item, originalIndex);
                categoryGrid.appendChild(itemCard);
            });

            categorySection.appendChild(categoryGrid);
            container.appendChild(categorySection);
        });

        return categoryMap;
    } catch (error) {
        return {};
    }
}

function findDuplicates() {
    try {
        if (inventory.length === 0) {
            return [];
        }

        const seenNames = new Set();
        const duplicates = [];

        inventory.forEach(item => {
            const nameLower = item.name.toLowerCase();
            if (seenNames.has(nameLower)) {
                duplicates.push(item);
            } else {
                seenNames.add(nameLower);
            }
        });

        const container = document.getElementById('inventoryContainer');
        if (!container) {
            console.error("Inventory container not found");
            return duplicates;
        }

        const allCards = container.querySelectorAll('.item-card');
        allCards.forEach(card => {
            card.classList.remove('duplicate-highlight');
        });

        if (duplicates.length > 0) {
            duplicates.forEach(duplicate => {
                const cards = container.querySelectorAll(`[data-name="${duplicate.name.toLowerCase()}"]`);
                cards.forEach(card => {
                    card.classList.add('duplicate-highlight');
                });
            });
        }

        return duplicates;
    } catch (error) {
        return [];
    }
}

function applyDiscount(discountPercentage) {
    try {
        if (typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 100) {
            throw new Error("Discount percentage must be a number between 0 and 100");
        }

        if (inventory.length === 0) {
            return false;
        }

        if (currentDiscount !== null) {
            return false;
        }

        inventory.forEach(item => {
            if (!originalPrices.has(item.name)) {
                originalPrices.set(item.name, item.price);
            }
        });

        const discountMultiplier = 1 - (discountPercentage / 100);
        currentDiscount = discountPercentage;

        inventory.forEach(item => {
            const originalPrice = originalPrices.get(item.name);
            item.price = parseFloat((originalPrice * discountMultiplier).toFixed(2));
        });

        listItems();
        updateStats();
        updateDiscountDisplay();
        return true;
    } catch (error) {
        return false;
    }
}

function removeDiscount() {
    try {
        if (currentDiscount === null) {
            return false;
        }

        inventory.forEach(item => {
            const originalPrice = originalPrices.get(item.name);
            if (originalPrice !== undefined) {
                item.price = originalPrice;
            }
        });

        currentDiscount = null;

        listItems();
        updateStats();
        updateDiscountDisplay();
        return true;
    } catch (error) {
        return false;
    }
}

function updateDiscountDisplay() {
    const discountDisplay = document.getElementById('discountDisplay');
    if (!discountDisplay) return;

    if (currentDiscount !== null) {
        discountDisplay.innerHTML = `
            <div class="discount-info">
                <span class="discount-text">Current Discount: <strong>${currentDiscount}%</strong></span>
                <button onclick="removeDiscount()" class="btn btn-remove-discount">Remove Discount</button>
            </div>
        `;
        discountDisplay.style.display = 'block';
    } else {
        discountDisplay.style.display = 'none';
    }
}

function updateStats() {
    const totalItemsElement = document.getElementById('totalItems');
    const totalValueElement = document.getElementById('totalValue');

    if (totalItemsElement) {
        totalItemsElement.textContent = inventory.length;
    }

    if (totalValueElement) {
        let totalValue = 0;
        inventory.forEach(item => {
            totalValue += item.price * item.quantity;
        });
        totalValueElement.textContent = `$${totalValue.toFixed(2)}`;
    }
}

function handleAddItem() {
    const name = document.getElementById('itemName').value.trim();
    const type = document.getElementById('itemType').value.trim();
    const image = document.getElementById('itemImage').value.trim();
    const price = parseFloat(document.getElementById('itemPrice').value);
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const description = document.getElementById('itemDescription').value.trim();

    if (!name || !type || isNaN(price) || isNaN(quantity) || !description) {
        return;
    }

    const newItem = {
        name: name,
        type: type,
        price: price,
        quantity: quantity,
        description: description,
        image: image || ""
    };

    if (addItem(newItem)) {
        document.getElementById('itemName').value = '';
        document.getElementById('itemType').value = '';
        document.getElementById('itemImage').value = '';
        document.getElementById('itemPrice').value = '';
        document.getElementById('itemQuantity').value = '';
        document.getElementById('itemDescription').value = '';
    }
}

function handleSearch() {
    const query = document.getElementById('searchQuery').value.trim();
    if (query) {
        searchItems(query);
    } else {
        listItems();
    }
}

function handleApplyDiscount() {
    const discountInput = document.getElementById('discountPercentage');
    const discount = parseFloat(discountInput.value);
    
    if (isNaN(discount) || discount < 0 || discount > 100) {
        return;
    }

    applyDiscount(discount);
    discountInput.value = '';
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchQuery');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    initializeInventory();
    createMagicalParticles();
});

function createMagicalParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const startX = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = 12 + Math.random() * 8;
        
        particle.style.left = startX + '%';
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = duration + 's';
        
        container.appendChild(particle);
    }

    setInterval(() => {
        const particles = container.querySelectorAll('.particle');
        particles.forEach(particle => {
            if (parseFloat(particle.style.left) > 100 || parseFloat(particle.style.left) < -10) {
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = '0s';
            }
        });
    }, 1000);
}