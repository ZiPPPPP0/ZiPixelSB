// Configuration pour le Bazaar
const HYPIXEL_API_BASE = 'https://api.hypixel.net';

// Variables globales
let bazaarData = null;
let filteredItems = [];
let flipHistory = [];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeControls();
    loadBazaarData();
    updateStats();
    
    // Auto-actualisation toutes les 2 minutes
    setInterval(() => {
        loadBazaarData();
    }, 120000);
});

// Initialisation des contrôles
function initializeControls() {
    const minProfitFilter = document.getElementById('minProfitPercent');
    const minVolumeFilter = document.getElementById('minVolume');
    const maxCapitalFilter = document.getElementById('maxCapital');

    [minProfitFilter, minVolumeFilter, maxCapitalFilter].forEach(filter => {
        filter.addEventListener('input', applyFilters);
    });
}

// Application des filtres
function applyFilters() {
    if (!bazaarData || !bazaarData.products) return;

    const minProfitPercent = parseFloat(document.getElementById('minProfitPercent').value) || 0;
    const minVolume = parseInt(document.getElementById('minVolume').value) || 0;
    const maxCapital = parseInt(document.getElementById('maxCapital').value) || Infinity;

    filteredItems = Object.entries(bazaarData.products)
        .map(([name, data]) => ({
            name: name,
            displayName: formatItemName(name),
            buyPrice: data.quick_status.buyPrice,
            sellPrice: data.quick_status.sellPrice,
            buyVolume: data.quick_status.buyVolume,
            sellVolume: data.quick_status.sellVolume,
            profit: data.profit,
            profitPercent: data.profitPercent
        }))
        .filter(item => 
            item.profit > 0 && 
            item.profitPercent >= minProfitPercent &&
            item.buyVolume >= minVolume &&
            item.buyPrice <= maxCapital
        )
        .sort((a, b) => b.profitPercent - a.profitPercent);

    renderBazaarItems();
    updateStats();
}

// Chargement des données du Bazaar
async function loadBazaarData() {
    const refreshIndicator = document.getElementById('refreshIndicator');
    const bazaarContainer = document.getElementById('bazaarData');
    
    refreshIndicator.classList.add('active');
    
    try {
        // Pour cette démo, on simule des données du Bazaar
        // En réalité, vous utiliseriez: await fetch(`${HYPIXEL_API_BASE}/skyblock/bazaar`)
        
        const simulatedBazaarData = await simulateBazaarData();
        bazaarData = simulatedBazaarData;
        applyFilters();
        
        setTimeout(() => {
            refreshIndicator.classList.remove('active');
        }, 1000);
        
    } catch (error) {
        console.error('Erreur lors du chargement du Bazaar:', error);
        bazaarContainer.innerHTML = `
            <div class="error">
                ❌ Impossible de charger les données du Bazaar. 
                <br>Pour une utilisation réelle, vous devrez configurer l'API Key Hypixel.
                <br><strong>Endpoint:</strong> ${HYPIXEL_API_BASE}/skyblock/bazaar
            </div>
        `;
        refreshIndicator.classList.remove('active');
    }
}

// Simulation des données du Bazaar (plus complète)
async function simulateBazaarData() {
    const items = [
        { name: 'ENCHANTED_SUGAR_CANE', buyPrice: 45623, sellPrice: 48234, volume: 125000 },
        { name: 'ENCHANTED_ROTTEN_FLESH', buyPrice: 12450, sellPrice: 13100, volume: 89000 },
        { name: 'ENCHANTED_COBBLESTONE', buyPrice: 78934, sellPrice: 82156, volume: 156000 },
        { name: 'ENCHANTED_COAL', buyPrice: 23567, sellPrice: 24890, volume: 234000 },
        { name: 'ENCHANTED_IRON', buyPrice: 145230, sellPrice: 151200, volume: 67000 },
        { name: 'ENCHANTED_GOLD', buyPrice: 289456, sellPrice: 298765, volume: 34000 },
        { name: 'ENCHANTED_DIAMOND', buyPrice: 567890, sellPrice: 589123, volume: 23000 },
        { name: 'ENCHANTED_EMERALD', buyPrice: 145678, sellPrice: 152345, volume: 45000 },
        { name: 'ENCHANTED_REDSTONE', buyPrice: 34567, sellPrice: 36890, volume: 178000 },
        { name: 'ENCHANTED_LAPIS_LAZULI', buyPrice: 18945, sellPrice: 19876, volume: 95000 },
        { name: 'ENCHANTED_QUARTZ', buyPrice: 87456, sellPrice: 92134, volume: 56000 },
        { name: 'ENCHANTED_OBSIDIAN', buyPrice: 198765, sellPrice: 208934, volume: 34000 },
        { name: 'SUPER_COMPACTOR_3000', buyPrice: 1234567, sellPrice: 1356789, volume: 1200 },
        { name: 'ENCHANTED_EGG', buyPrice: 45678, sellPrice: 48234, volume: 67000 },
        { name: 'ENCHANTED_CAKE', buyPrice: 2345678, sellPrice: 2456789, volume: 890 },
        { name: 'ENCHANTED_BREAD', buyPrice: 15678, sellPrice: 16234, volume: 123000 }
    ];

    // Ajout de variation temporelle pour simuler des prix réels
    const timeVariation = Math.sin(Date.now() / 100000) * 0.1;
    
    return {
        success: true,
        products: items.reduce((acc, item) => {
            // Simulation de variation de prix
            const priceVariation = 1 + (Math.random() - 0.5) * 0.1 + timeVariation;
            const adjustedBuyPrice = Math.floor(item.buyPrice * priceVariation);
            const adjustedSellPrice = Math.floor(item.sellPrice * priceVariation);
            
            const profit = adjustedSellPrice - adjustedBuyPrice;
            const profitPercent = (profit / adjustedBuyPrice) * 100;
            
            acc[item.name] = {
                quick_status: {
                    buyPrice: adjustedBuyPrice,
                    sellPrice: adjustedSellPrice,
                    buyVolume: item.volume + Math.floor(Math.random() * 10000),
                    sellVolume: Math.floor(item.volume * 0.8) + Math.floor(Math.random() * 5000)
                },
                profit: profit,
                profitPercent: profitPercent
            };
            return acc;
        }, {})
    };
}

// Affichage des items du Bazaar
function renderBazaarItems() {
    const container = document.getElementById('bazaarData');
    
    if (filteredItems.length === 0) {
        container.innerHTML = '<div class="no-data">Aucun flip trouvé avec les filtres actuels. Essayez d\'ajuster vos critères.</div>';
        return;
    }

    container.innerHTML = `
        <div class="bazaar-grid">
            ${filteredItems.map(item => `
                <div class="bazaar-item" onclick="addToHistory('${item.name}', ${item.profit}, ${item.profitPercent})">
                    <div class="item-info">
                        <div class="item-name">${item.displayName}</div>
                        <div class="item-volume">Volume: ${formatNumber(item.buyVolume)} | ${formatNumber(item.sellVolume)}</div>
                    </div>
                    <div class="item-prices">
                        <div class="buy-price">Achat: ${formatCoins(item.buyPrice)}</div>
                        <div class="sell-price">Vente: ${formatCoins(item.sellPrice)}</div>
                        <div class="profit-indicator ${getProfitClass(item.profitPercent)}">
                            +${item.profitPercent.toFixed(1)}%
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Déterminer la classe CSS basée sur le pourcentage de profit
function getProfitClass(profitPercent) {
    if (profitPercent >= 10) return 'profit-excellent';
    if (profitPercent >= 5) return 'profit-high';
    if (profitPercent >= 2) return 'profit-medium';
    return 'profit-low';
}

// Ajouter un flip à l'historique
function addToHistory(itemName, profit, profitPercent) {
    const historyItem = {
        timestamp: new Date(),
        itemName: formatItemName(itemName),
        profit: profit,
        profitPercent: profitPercent
    };
    
    flipHistory.unshift(historyItem);
    
    // Garder seulement les 10 derniers
    if (flipHistory.length > 10) {
        flipHistory = flipHistory.slice(0, 10);
    }
    
    renderHistory();
}

// Affichage de l'historique
function renderHistory() {
    const container = document.getElementById('historyData');
    
    if (flipHistory.length === 0) {
        container.innerHTML = '<div class="loading">Aucun historique pour le moment...</div>';
        return;
    }

    container.innerHTML = flipHistory.map(item => `
        <div class="history-item">
            <div class="history-timestamp">${item.timestamp.toLocaleString('fr-FR')}</div>
            <div class="history-details">
                ${item.itemName} - ${formatCoins(item.profit)} (+${item.profitPercent.toFixed(1)}%)
            </div>
        </div>
    `).join('');
}

// Mise à jour des statistiques
function updateStats() {
    document.getElementById('totalItems').textContent = filteredItems.length;
    document.getElementById('bestFlip').textContent = filteredItems.length > 0 
        ? `${filteredItems[0].profitPercent.toFixed(1)}%`
        : '-';
    
    const totalProfit = filteredItems.reduce((sum, item) => sum + item.profit, 0);
    document.getElementById('totalProfit').textContent = formatCoins(totalProfit);
    
    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('fr-FR');
}

// Utilitaires de formatage
function formatCoins(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'K';
    }
    return amount.toString();
}

function formatNumber(num) {
    return num.toLocaleString('fr-FR');
}

function formatItemName(name) {
    return name.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}