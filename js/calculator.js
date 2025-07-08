// Variables globales
let currentBazaarPrices = {};
let calculationHistory = [];

// Données de référence pour les comparaisons (profits théoriques optimaux)
const referenceData = {
    'ENCHANTED_QUARTZ': { optimalPerHour: 28635, optimalProfit: 59600000 },
    'ENCHANTED_REDSTONE': { optimalPerHour: 42966, optimalProfit: 51500000 },
    'ENCHANTED_IRON': { optimalPerHour: 32091, optimalProfit: 44300000 },
    'ENCHANTED_GOLD': { optimalPerHour: 84579, optimalProfit: 42500000 },
    'ENCHANTED_DIAMOND': { optimalPerHour: 31812, optimalProfit: 43000000 },
    'ENCHANTED_COBBLESTONE': { optimalPerHour: 38280, optimalProfit: 49800000 },
    'ENCHANTED_TUNGSTEN': { optimalPerHour: 2435, optimalProfit: 32900000 },
    'ENCHANTED_UMBER': { optimalPerHour: 1275, optimalProfit: 1861500 },
    'FINE_JADE_GEMSTONE': { optimalPerHour: 1336, optimalProfit: 33400000 },
    'FINE_AMBER_GEMSTONE': { optimalPerHour: 1610, optimalProfit: 46700000 },
    'FINE_RUBY_GEMSTONE': { optimalPerHour: 1335, optimalProfit: 40050000 },
    'ENCHANTED_MITHRIL': { optimalPerHour: 13564, optimalProfit: 19800000 },
    'ENCHANTED_EMERALD': { optimalPerHour: 36216, optimalProfit: 38000000 },
    'ENCHANTED_MYCELIUM': { optimalPerHour: 31560, optimalProfit: 41000000 },
    'ENCHANTED_FLINT': { optimalPerHour: 6674, optimalProfit: 42100000 },
    'ENCHANTED_LAPIS_LAZULI': { optimalPerHour: 34375, optimalProfit: 32600000 },
    'ENCHANTED_OBSIDIAN': { optimalPerHour: 14865, optimalProfit: 32000000 },
    'ENCHANTED_SAND': { optimalPerHour: 36492, optimalProfit: 21900000 }
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation de la calculatrice...');
    
    loadBazaarPrices();
    loadCalculationHistory();
    
    // Auto-actualisation des prix toutes les 5 minutes
    setInterval(loadBazaarPrices, 300000);
    
    // Event listeners
    document.getElementById('itemSelect').addEventListener('change', updateCurrentPrice);
    
    // Validation des inputs
    setupInputValidation();
    
    console.log('Calculatrice initialisée avec succès');
});

// Récupération des prix bazaar depuis l'API Hypixel
async function loadBazaarPrices() {
    try {
        console.log('Récupération des prix bazaar depuis l\'API Hypixel...');
        
        const response = await fetch('https://api.hypixel.net/skyblock/bazaar');
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success || !data.products) {
            throw new Error('Réponse API invalide');
        }
        
        // Extraire les prix de vente instantanée
        Object.entries(data.products).forEach(([productId, productData]) => {
            if (productData.quick_status && productData.quick_status.sellPrice > 0) {
                currentBazaarPrices[productId] = productData.quick_status.sellPrice;
            }
        });
        
        updateStats();
        updateCurrentPrice();
        
        console.log(`Prix bazaar récupérés pour ${Object.keys(currentBazaarPrices).length} items`);
        
    } catch (error) {
        console.error('Erreur lors de la récupération des prix bazaar:', error);
        
        // Prix de fallback en cas d'échec de l'API
        currentBazaarPrices = {
            'ENCHANTED_QUARTZ': 2090,
            'ENCHANTED_REDSTONE': 1200,
            'ENCHANTED_IRON': 1380,
            'ENCHANTED_GOLD': 500,
            'ENCHANTED_DIAMOND': 1350,
            'ENCHANTED_COBBLESTONE': 1300,
            'ENCHANTED_TUNGSTEN': 13500,
            'ENCHANTED_UMBER': 1460,
            'FINE_JADE_GEMSTONE': 25000,
            'FINE_AMBER_GEMSTONE': 29000,
            'FINE_RUBY_GEMSTONE': 30000,
            'ENCHANTED_MITHRIL': 1460,
            'ENCHANTED_EMERALD': 1050,
            'ENCHANTED_MYCELIUM': 1300,
            'ENCHANTED_FLINT': 6310,
            'ENCHANTED_LAPIS_LAZULI': 950,
            'ENCHANTED_OBSIDIAN': 2150,
            'ENCHANTED_SAND': 600,
            'ENCHANTED_CARROT': 350,
            'ENCHANTED_POTATO': 400,
            'ENCHANTED_WHEAT': 450,
            'ENCHANTED_SUGAR_CANE': 480
        };
        
        updateStats();
        updateCurrentPrice();
        
        console.log('Utilisation des prix de fallback');
    }
}

// Mise à jour du prix actuel affiché
function updateCurrentPrice() {
    const selectedItem = document.getElementById('itemSelect').value;
    const priceElement = document.getElementById('currentPrice');
    
    if (selectedItem && currentBazaarPrices[selectedItem]) {
        priceElement.textContent = formatCoins(currentBazaarPrices[selectedItem]);
    } else {
        priceElement.textContent = '-';
    }
}

// Mise à jour des statistiques générales
function updateStats() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = new Date().toLocaleTimeString('fr-FR');
    }
}

// Configuration de la validation des inputs
function setupInputValidation() {
    const itemsInput = document.getElementById('itemsCollected');
    const minutesInput = document.getElementById('testMinutes');
    const secondsInput = document.getElementById('testSeconds');
    
    // Validation pour empêcher les valeurs négatives
    [itemsInput, minutesInput, secondsInput].forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
            if (this === secondsInput && this.value > 59) this.value = 59;
            if (this === minutesInput && this.value > 1440) this.value = 1440; // Max 24h
        });
    });
    
    // Validation minimum pour les items
    itemsInput.addEventListener('blur', function() {
        if (this.value && this.value < 1) this.value = 1;
    });
}

// Fonction principale de calcul des profits
function calculateProfit() {
    try {
        // Récupération des données du formulaire
        const selectedItem = document.getElementById('itemSelect').value;
        const itemsCollected = parseInt(document.getElementById('itemsCollected').value);
        const testMinutes = parseInt(document.getElementById('testMinutes').value) || 0;
        const testSeconds = parseInt(document.getElementById('testSeconds').value) || 0;
        
        // Validation des données
        if (!selectedItem) {
            alert('❌ Veuillez sélectionner un item');
            return;
        }
        
        if (!itemsCollected || itemsCollected <= 0) {
            alert('❌ Veuillez entrer un nombre d\'items valide (minimum 1)');
            return;
        }
        
        if (testMinutes === 0 && testSeconds === 0) {
            alert('❌ Veuillez entrer une durée de test valide');
            return;
        }
        
        if (!currentBazaarPrices[selectedItem]) {
            alert('❌ Prix non disponible pour cet item. Réessayez après actualisation des prix.');
            return;
        }
        
        // Calculs principaux
        const totalTestTimeMinutes = testMinutes + (testSeconds / 60);
        const totalTestTimeHours = totalTestTimeMinutes / 60;
        
        const itemsPerHour = itemsCollected / totalTestTimeHours;
        const pricePerItem = currentBazaarPrices[selectedItem];
        const profitPerHour = itemsPerHour * pricePerItem;
        
        // Affichage des résultats
        displayResults({
            selectedItem,
            itemsCollected,
            testMinutes,
            testSeconds,
            itemsPerHour,
            pricePerItem,
            profitPerHour
        });
        
        // Sauvegarde dans l'historique
        saveCalculation({
            selectedItem,
            itemsCollected,
            testMinutes,
            testSeconds,
            itemsPerHour,
            profitPerHour,
            timestamp: new Date()
        });
        
        console.log(`Calcul effectué: ${Math.round(itemsPerHour)} ${formatItemName(selectedItem)}/h = ${formatCoins(profitPerHour)}/h`);
        
    } catch (error) {
        console.error('Erreur lors du calcul:', error);
        alert('❌ Erreur lors du calcul. Vérifiez vos données et réessayez.');
    }
}

// Affichage des résultats détaillés
function displayResults(data) {
    const {
        selectedItem,
        itemsCollected,
        testMinutes,
        testSeconds,
        itemsPerHour,
        pricePerItem,
        profitPerHour
    } = data;
    
    // Afficher la section résultats
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    
    // 💰 Profit par heure
    document.getElementById('resultProfitHour').textContent = formatCoins(profitPerHour);
    document.getElementById('resultProfitDetails').textContent = 
        `${formatCoins(pricePerItem)} coins/item × ${Math.round(itemsPerHour)} items/h`;
    
    // ⚡ Production par heure
    document.getElementById('resultProductionHour').textContent = formatNumber(Math.round(itemsPerHour));
    
    // Mise à jour des stats du header
    document.getElementById('hourlyProfit').textContent = formatCoins(profitPerHour);
    document.getElementById('hourlyItems').textContent = formatNumber(Math.round(itemsPerHour));
    
    // 📊 Calcul de l'efficacité (si données de référence disponibles)
    if (referenceData[selectedItem]) {
        const reference = referenceData[selectedItem];
        const efficiencyPercent = (itemsPerHour / reference.optimalPerHour) * 100;
        
        document.getElementById('resultEfficiency').textContent = `${efficiencyPercent.toFixed(1)}%`;
        document.getElementById('resultEfficiencyDetails').textContent = 
            `par rapport au setup optimal (${formatNumber(reference.optimalPerHour)} items/h)`;
        
        // ⚖️ Comparaison de profit
        const profitDifference = profitPerHour - reference.optimalProfit;
        const profitDifferencePercent = ((profitPerHour / reference.optimalProfit) - 1) * 100;
        
        const comparisonElement = document.getElementById('resultComparison');
        const comparisonDetailsElement = document.getElementById('resultComparisonDetails');
        
        if (profitDifference >= 0) {
            comparisonElement.textContent = `+${formatCoins(profitDifference)}`;
            comparisonElement.style.color = '#28a745';
            comparisonDetailsElement.textContent = 
                `Meilleur que le setup optimal de +${profitDifferencePercent.toFixed(1)}%`;
        } else {
            comparisonElement.textContent = `${formatCoins(profitDifference)}`;
            comparisonElement.style.color = '#dc3545';
            comparisonDetailsElement.textContent = 
                `En dessous du setup optimal de ${Math.abs(profitDifferencePercent).toFixed(1)}%`;
        }
    } else {
        // Pas de données de référence disponibles
        document.getElementById('resultEfficiency').textContent = 'N/A';
        document.getElementById('resultEfficiencyDetails').textContent = 'Pas de données de référence pour cet item';
        document.getElementById('resultComparison').textContent = 'N/A';
        document.getElementById('resultComparisonDetails').textContent = 'Pas de données de comparaison disponibles';
    }
    
    // Scroll automatique vers les résultats
    resultsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Sauvegarde d'un calcul dans l'historique
function saveCalculation(calculation) {
    // Ajouter le timestamp sous forme d'objet Date
    calculation.timestamp = new Date();
    
    // Ajouter au début de l'historique
    calculationHistory.unshift(calculation);
    
    // Garder seulement les 10 derniers calculs
    if (calculationHistory.length > 10) {
        calculationHistory = calculationHistory.slice(0, 10);
    }
    
    // Sauvegarder dans le localStorage (sans les Date objects pour éviter les erreurs)
    try {
        const historyToSave = calculationHistory.map(calc => ({
            ...calc,
            timestamp: calc.timestamp.toISOString()
        }));
        localStorage.setItem('calculationHistory', JSON.stringify(historyToSave));
    } catch (error) {
        console.warn('Impossible de sauvegarder l\'historique dans localStorage:', error);
    }
    
    renderHistory();
}

// Chargement de l'historique depuis le localStorage
function loadCalculationHistory() {
    try {
        const saved = localStorage.getItem('calculationHistory');
        if (saved) {
            const parsedHistory = JSON.parse(saved);
            calculationHistory = parsedHistory.map(calc => ({
                ...calc,
                timestamp: new Date(calc.timestamp)
            }));
            renderHistory();
        }
    } catch (error) {
        console.warn('Impossible de charger l\'historique depuis localStorage:', error);
        calculationHistory = [];
    }
}

// Affichage de l'historique des calculs
function renderHistory() {
    const container = document.getElementById('calculationHistory');
    const clearBtn = document.querySelector('.clear-history-btn');
    
    if (!container) {
        console.error('Container calculationHistory non trouvé');
        return;
    }
    
    if (calculationHistory.length === 0) {
        container.innerHTML = '<div class="no-history">Aucun calcul effectué pour le moment</div>';
        if (clearBtn) clearBtn.style.display = 'none';
        return;
    }
    
    container.innerHTML = calculationHistory.map(calc => {
        const itemName = formatItemName(calc.selectedItem);
        const duration = calc.testMinutes > 0 ? 
            `${calc.testMinutes}m ${calc.testSeconds}s` : 
            `${calc.testSeconds}s`;
        
        return `
            <div class="history-item">
                <div class="history-header">
                    <div class="history-item-name">${itemName}</div>
                    <div class="history-timestamp">${calc.timestamp.toLocaleString('fr-FR')}</div>
                </div>
                <div class="history-details">
                    Test: <strong>${calc.itemsCollected} items</strong> en ${duration}<br>
                    Production: <strong>${Math.round(calc.itemsPerHour)} items/h</strong><br>
                    Profit: <span class="history-profit">${formatCoins(calc.profitPerHour)}/h</span>
                </div>
            </div>
        `;
    }).join('');
    
    if (clearBtn) clearBtn.style.display = 'block';
}

// Vider l'historique des calculs
function clearHistory() {
    if (confirm('❓ Êtes-vous sûr de vouloir vider l\'historique de tous vos calculs ?')) {
        calculationHistory = [];
        try {
            localStorage.removeItem('calculationHistory');
        } catch (error) {
            console.warn('Impossible de vider l\'historique:', error);
        }
        renderHistory();
        console.log('Historique des calculs vidé');
    }
}

// Réinitialisation du formulaire
function resetForm() {
    document.getElementById('itemSelect').value = '';
    document.getElementById('itemsCollected').value = '';
    document.getElementById('testMinutes').value = '';
    document.getElementById('testSeconds').value = '';
    
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
    
    // Reset des stats du header
    document.getElementById('hourlyProfit').textContent = '-';
    document.getElementById('hourlyItems').textContent = '-';
    
    updateCurrentPrice();
    console.log('Formulaire réinitialisé');
}

// Utilitaires de formatage
function formatCoins(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'K';
    }
    return Math.round(amount).toLocaleString('fr-FR');
}

function formatNumber(num) {
    return num.toLocaleString('fr-FR');
}

function formatItemName(itemId) {
    return itemId.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Fonction pour exporter les résultats en CSV (fonctionnalité bonus)
function exportResults() {
    if (calculationHistory.length === 0) {
        alert('❌ Aucun calcul à exporter');
        return;
    }
    
    try {
        const data = calculationHistory.map(calc => ({
            Item: formatItemName(calc.selectedItem),
            'Items_récoltés': calc.itemsCollected,
            'Durée_minutes': calc.testMinutes + (calc.testSeconds / 60),
            'Items_par_heure': Math.round(calc.itemsPerHour),
            'Profit_par_heure': Math.round(calc.profitPerHour),
            'Date': calc.timestamp.toLocaleString('fr-FR')
        }));
        
        const csv = [
            Object.keys(data[0]).join(','),
            ...data.map(row => Object.values(row).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `skyblock_calculator_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        console.log('Résultats exportés en CSV');
        
    } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        alert('❌ Erreur lors de l\'export des résultats');
    }
}

// Fonction utilitaire pour actualiser manuellement les prix
function refreshPrices() {
    console.log('Actualisation manuelle des prix...');
    loadBazaarPrices();
}