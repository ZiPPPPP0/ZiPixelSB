// Configuration API
const HYPIXEL_API_BASE = 'https://api.hypixel.net';

// Définition des crafts Yog Armor
const yogArmorCrafts = [
    {
        id: 'yog_helmet',
        name: 'Yog Helmet',
        icon: '⛑️',
        materials: {
            ENCHANTED_HARDSTONE: 100,
            YOGGIE: 40
        },
        auctionSearchTerms: ['yog helmet', 'yog_helmet', 'YOG_HELMET']
    },
    {
        id: 'yog_chestplate',
        name: 'Yog Chestplate',
        icon: '🛡️',
        materials: {
            ENCHANTED_HARDSTONE: 160,
            YOGGIE: 40
        },
        auctionSearchTerms: ['yog chestplate', 'yog_chestplate', 'YOG_CHESTPLATE']
    },
    {
        id: 'yog_leggings',
        name: 'Yog Leggings',
        icon: '👖',
        materials: {
            ENCHANTED_HARDSTONE: 140,
            YOGGIE: 40
        },
        auctionSearchTerms: ['yog leggings', 'yog_leggings', 'YOG_LEGGINGS']
    },
    {
        id: 'yog_boots',
        name: 'Yog Boots',
        icon: '🥾',
        materials: {
            ENCHANTED_HARDSTONE: 80,
            YOGGIE: 40
        },
        auctionSearchTerms: ['yog boots', 'yog_boots', 'YOG_BOOTS']
    }
];

// Variables globales
let materialPrices = {};
let armorPrices = {};
let profitHistory = [];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation Yog Armor Calculator...');
    
    loadProfitHistory();
    refreshAllData();
    
    // Auto-actualisation toutes les 5 minutes
    setInterval(() => {
        refreshAllData();
    }, 300000);
});

// Chargement de tous les prix
async function refreshAllData() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    try {
        loadingIndicator.classList.add('active');
        
        console.log('Chargement des prix des matériaux...');
        await loadMaterialPrices();
        
        console.log('Chargement des prix auction house...');
        await loadAuctionPrices();
        
        console.log('Calcul des profits...');
        calculateProfits();
        
        console.log('Mise à jour de l\'affichage...');
        updateDisplay();
        
        console.log('Sauvegarde dans l\'historique...');
        saveProfitSnapshot();
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showError('Erreur lors du chargement des données: ' + error.message);
    } finally {
        loadingIndicator.classList.remove('active');
    }
}

// Chargement des prix des matériaux depuis le Bazaar
async function loadMaterialPrices() {
    try {
        const response = await fetch(`${HYPIXEL_API_BASE}/skyblock/bazaar`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success || !data.products) {
            throw new Error('Réponse API bazaar invalide');
        }
        
        // Extraire les prix des matériaux nécessaires (ENCHANTED_HARDSTONE et YOGGIE)
        materialPrices = {};
        
        if (data.products.ENCHANTED_HARDSTONE && data.products.ENCHANTED_HARDSTONE.quick_status) {
            materialPrices.ENCHANTED_HARDSTONE = {
                buyPrice: data.products.ENCHANTED_HARDSTONE.quick_status.buyPrice || 0,
                sellPrice: data.products.ENCHANTED_HARDSTONE.quick_status.sellPrice || 0,
                buyVolume: data.products.ENCHANTED_HARDSTONE.quick_status.buyVolume || 0,
                sellVolume: data.products.ENCHANTED_HARDSTONE.quick_status.sellVolume || 0
            };
        }
        
        if (data.products.YOGGIE && data.products.YOGGIE.quick_status) {
            materialPrices.YOGGIE = {
                buyPrice: data.products.YOGGIE.quick_status.buyPrice || 0,
                sellPrice: data.products.YOGGIE.quick_status.sellPrice || 0,
                buyVolume: data.products.YOGGIE.quick_status.buyVolume || 0,
                sellVolume: data.products.YOGGIE.quick_status.sellVolume || 0
            };
        }
        
        // Prix de fallback si pas de données API
        if (!materialPrices.ENCHANTED_HARDSTONE) {
            materialPrices.ENCHANTED_HARDSTONE = {
                buyPrice: 480,
                sellPrice: 500,
                buyVolume: 50000,
                sellVolume: 30000
            };
        }
        
        if (!materialPrices.YOGGIE) {
            materialPrices.YOGGIE = {
                buyPrice: 15000,
                sellPrice: 16000,
                buyVolume: 5000,
                sellVolume: 3000
            };
        }
        
        console.log('Prix matériaux chargés:', materialPrices);
        
    } catch (error) {
        console.error('Erreur lors du chargement des prix bazaar:', error);
        
        // Prix de fallback en cas d'erreur
        materialPrices = {
            ENCHANTED_HARDSTONE: {
                buyPrice: 480,
                sellPrice: 500,
                buyVolume: 50000,
                sellVolume: 30000
            },
            YOGGIE: {
                buyPrice: 15000,
                sellPrice: 16000,
                buyVolume: 5000,
                sellVolume: 3000
            }
        };
    }
}

// Chargement des prix auction house depuis l'API Hypixel
async function loadAuctionPrices() {
    try {
        console.log('Récupération des données auction house...');
        
        // Première requête pour obtenir le nombre total de pages
        const firstResponse = await fetch(`${HYPIXEL_API_BASE}/skyblock/auctions?page=0`);
        
        if (!firstResponse.ok) {
            throw new Error(`Erreur HTTP: ${firstResponse.status}`);
        }
        
        const firstData = await firstResponse.json();
        
        if (!firstData.success) {
            throw new Error('Réponse API auction invalide');
        }
        
        const totalPages = firstData.totalPages || 1;
        console.log(`Total de ${totalPages} pages d'auctions à analyser`);
        
        // Collecter toutes les auctions Yog Armor
        const yogAuctions = [];
        
        // Analyser les 10 premières pages pour éviter de surcharger
        const pagesToCheck = Math.min(10, totalPages);
        
        for (let page = 0; page < pagesToCheck; page++) {
            try {
                const response = await fetch(`${HYPIXEL_API_BASE}/skyblock/auctions?page=${page}`);
                
                if (!response.ok) {
                    console.warn(`Erreur page ${page}:`, response.status);
                    continue;
                }
                
                const data = await response.json();
                
                if (!data.success || !data.auctions) {
                    console.warn(`Données invalides page ${page}`);
                    continue;
                }
                
                // Filtrer les auctions Yog Armor
                const pageYogAuctions = data.auctions.filter(auction => {
                    if (!auction.item_name || !auction.bin) return false;
                    
                    const itemName = auction.item_name.toLowerCase();
                    return itemName.includes('yog') && 
                           (itemName.includes('helmet') || 
                            itemName.includes('chestplate') || 
                            itemName.includes('leggings') || 
                            itemName.includes('boots'));
                });
                
                yogAuctions.push(...pageYogAuctions);
                
                // Délai pour éviter rate limiting
                if (page < pagesToCheck - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
            } catch (error) {
                console.warn(`Erreur lors du chargement de la page ${page}:`, error);
            }
        }
        
        console.log(`${yogAuctions.length} auctions Yog trouvées sur ${pagesToCheck} pages`);
        
        // Analyser les prix par pièce
        armorPrices = {};
        
        yogArmorCrafts.forEach(craft => {
            const craftAuctions = yogAuctions.filter(auction => {
                const itemName = auction.item_name.toLowerCase();
                return craft.auctionSearchTerms.some(term => 
                    itemName.includes(term.toLowerCase())
                );
            });
            
            if (craftAuctions.length > 0) {
                const binPrices = craftAuctions
                    .filter(auction => auction.bin && auction.starting_bid > 0)
                    .map(auction => auction.starting_bid)
                    .sort((a, b) => a - b);
                
                if (binPrices.length > 0) {
                    armorPrices[craft.id] = {
                        lowestBin: binPrices[0],
                        averagePrice: binPrices[Math.floor(binPrices.length / 2)], // Médiane
                        highestBin: binPrices[binPrices.length - 1],
                        volume: binPrices.length,
                        lastUpdated: new Date(),
                        allPrices: binPrices.slice(0, 10) // Garder les 10 plus bas
                    };
                    
                    console.log(`${craft.name}: ${binPrices.length} auctions, prix min: ${formatCoins(binPrices[0])}`);
                }
            }
        });
        
        // Prix de fallback pour les pièces sans données
        yogArmorCrafts.forEach(craft => {
            if (!armorPrices[craft.id]) {
                console.warn(`Pas de données auction pour ${craft.name}, utilisation de prix estimés`);
                
                // Prix estimés basés sur les coûts de craft
                const estimatedCraftCost = calculateEstimatedCraftCost(craft);
                const estimatedSellPrice = estimatedCraftCost * 1.3; // 30% de marge estimée
                
                armorPrices[craft.id] = {
                    lowestBin: Math.floor(estimatedSellPrice * 0.9),
                    averagePrice: estimatedSellPrice,
                    highestBin: Math.floor(estimatedSellPrice * 1.2),
                    volume: 0,
                    lastUpdated: new Date(),
                    isEstimated: true
                };
            }
        });
        
        console.log('Prix auction finaux:', armorPrices);
        
    } catch (error) {
        console.error('Erreur lors du chargement des prix auction:', error);
        
        // Prix de fallback complets en cas d'erreur
        yogArmorCrafts.forEach(craft => {
            const estimatedCraftCost = calculateEstimatedCraftCost(craft);
            const estimatedSellPrice = estimatedCraftCost * 1.2;
            
            armorPrices[craft.id] = {
                lowestBin: Math.floor(estimatedSellPrice * 0.85),
                averagePrice: estimatedSellPrice,
                highestBin: Math.floor(estimatedSellPrice * 1.15),
                volume: 0,
                lastUpdated: new Date(),
                isEstimated: true
            };
        });
    }
}

// Calcul du coût de craft estimé (coût d'opportunité)
function calculateEstimatedCraftCost(craft) {
    let cost = 0;
    Object.entries(craft.materials).forEach(([material, quantity]) => {
        const materialPrice = materialPrices[material];
        if (materialPrice) {
            cost += quantity * materialPrice.sellPrice;
        }
    });
    return cost;
}

// Calcul des profits pour chaque pièce
function calculateProfits() {
    yogArmorCrafts.forEach(craft => {
        const armorPrice = armorPrices[craft.id];
        
        if (!armorPrice) {
            console.warn(`Prix auction manquant pour ${craft.name}`);
            return;
        }
        
        // Calcul du coût de craft (utilise sellPrice car on vend nos matériaux farmés)
        let craftCost = 0;
        Object.entries(craft.materials).forEach(([material, quantity]) => {
            const materialPrice = materialPrices[material];
            if (materialPrice) {
                craftCost += quantity * materialPrice.sellPrice;
            }
        });
        
        // Utiliser le prix le plus bas (lowestBin) pour être réaliste
        const sellPrice = armorPrice.lowestBin;
        
        // Calcul des profits (en soustrayant les frais d'auction house ~2%)
        const auctionFees = sellPrice * 0.02;
        const netSellPrice = sellPrice - auctionFees;
        
        craft.analysis = {
            craftCost: craftCost,
            sellPrice: sellPrice,
            netSellPrice: netSellPrice,
            auctionFees: auctionFees,
            rawProfit: netSellPrice - craftCost,
            profitPercent: ((netSellPrice - craftCost) / craftCost) * 100,
            volume: armorPrice.volume,
            lowestBin: armorPrice.lowestBin,
            averagePrice: armorPrice.averagePrice,
            highestBin: armorPrice.highestBin,
            isRealData: !armorPrice.isEstimated
        };
        
        console.log(`${craft.name}: ${formatCoins(craft.analysis.rawProfit)} profit (${craft.analysis.profitPercent.toFixed(1)}%)`);
    });
}

// Mise à jour de l'affichage
function updateDisplay() {
    updateMaterialPrices();
    updateArmorCards();
    updateStats();
    updateHistoricalData();
}

// Mise à jour des prix des matériaux
function updateMaterialPrices() {
    // Enchanted Hardstone
    const hardstonePrice = document.getElementById('hardstonePrice');
    const hardstoneStock = document.getElementById('hardstoneStock');
    
    if (hardstonePrice && materialPrices.ENCHANTED_HARDSTONE) {
        hardstonePrice.textContent = formatCoins(materialPrices.ENCHANTED_HARDSTONE.sellPrice);
        hardstoneStock.textContent = `Stock: ${formatNumber(materialPrices.ENCHANTED_HARDSTONE.sellVolume)}`;
    }
    
    // Yoggie
    const yoggiePrice = document.getElementById('yoggiePrice');
    const yoggieStock = document.getElementById('yoggieStock');
    
    if (yoggiePrice && materialPrices.YOGGIE) {
        yoggiePrice.textContent = formatCoins(materialPrices.YOGGIE.sellPrice);
        yoggieStock.textContent = `Stock: ${formatNumber(materialPrices.YOGGIE.sellVolume)}`;
    }
}

// Mise à jour des cartes d'armure
function updateArmorCards() {
    const armorGrid = document.getElementById('armorGrid');
    
    if (!armorGrid) return;
    
    const html = yogArmorCrafts.map(craft => {
        if (!craft.analysis) {
            return `
                <div class="armor-card">
                    <div class="armor-header">
                        <span class="armor-name">${craft.name}</span>
                        <span class="armor-icon">${craft.icon}</span>
                    </div>
                    <div class="error-message">Données indisponibles</div>
                </div>
            `;
        }
        
        const analysis = craft.analysis;
        const isProfit = analysis.rawProfit > 0;
        const isBreakEven = Math.abs(analysis.rawProfit) < 100000;
        
        let cardClass = 'armor-card';
        if (isBreakEven) cardClass += ' break-even';
        else if (isProfit) cardClass += ' profitable';
        else cardClass += ' loss';
        
        let profitClass = 'profit-display';
        if (isBreakEven) profitClass += ' profit-neutral';
        else if (isProfit) profitClass += ' profit-positive';
        else profitClass += ' profit-negative';
        
        const dataStatus = analysis.isRealData ? '🟢 Prix réels' : '🟡 Prix estimés';
        
        return `
            <div class="${cardClass}">
                <div class="armor-header">
                    <span class="armor-name">${craft.name}</span>
                    <span class="armor-icon">${craft.icon}</span>
                </div>
                
                <div class="${profitClass}">
                    <div class="profit-amount">${formatCoins(analysis.rawProfit)}</div>
                    <div class="profit-percentage">${analysis.profitPercent >= 0 ? '+' : ''}${analysis.profitPercent.toFixed(1)}% profit</div>
                </div>
                
                <div class="price-breakdown">
                    <div class="price-row">
                        <span class="price-label">Prix vente (lowest BIN):</span>
                        <span class="price-value">${formatCoins(analysis.sellPrice)}</span>
                    </div>
                    <div class="price-row">
                        <span class="price-label">Frais auction (2%):</span>
                        <span class="price-value">-${formatCoins(analysis.auctionFees)}</span>
                    </div>
                    <div class="price-row">
                        <span class="price-label">Prix net:</span>
                        <span class="price-value">${formatCoins(analysis.netSellPrice)}</span>
                    </div>
                    <div class="price-row">
                        <span class="price-label">Coût craft:</span>
                        <span class="price-value">${formatCoins(analysis.craftCost)}</span>
                    </div>
                    <div class="price-row">
                        <span class="price-label">Profit net:</span>
                        <span class="price-value">${formatCoins(analysis.rawProfit)}</span>
                    </div>
                </div>
                
                <div class="cost-breakdown">
                    <strong>Coût d'opportunité (si vendus au bazaar):</strong><br>
                    ${Object.entries(craft.materials).map(([material, qty]) => {
                        const price = materialPrices[material] ? materialPrices[material].sellPrice : 0;
                        const cost = qty * price;
                        return `• ${qty}x ${formatMaterialName(material)} = ${formatCoins(cost)}`;
                    }).join('<br>')}
                </div>
                
                <div class="auction-info">
                    <strong>Info Auction House (${dataStatus}):</strong><br>
                    • Volume: ${analysis.volume} BIN disponibles<br>
                    • Prix min: ${formatCoins(analysis.lowestBin)}<br>
                    • Prix moyen: ${formatCoins(analysis.averagePrice)}<br>
                    • Prix max: ${formatCoins(analysis.highestBin)}
                </div>
            </div>
        `;
    }).join('');
    
    armorGrid.innerHTML = html;
}

// Mise à jour des statistiques
function updateStats() {
    // Profit total pour un set complet
    const totalProfitElement = document.getElementById('totalProfit');
    if (totalProfitElement) {
        const totalProfit = yogArmorCrafts.reduce((sum, craft) => {
            return sum + (craft.analysis ? craft.analysis.rawProfit : 0);
        }, 0);
        totalProfitElement.textContent = formatCoins(totalProfit);
    }
    
    // Meilleure pièce
    const bestPieceElement = document.getElementById('bestPiece');
    if (bestPieceElement) {
        const bestCraft = yogArmorCrafts.reduce((best, craft) => {
            if (!craft.analysis) return best;
            if (!best.analysis) return craft;
            return craft.analysis.rawProfit > best.analysis.rawProfit ? craft : best;
        }, {});
        
        bestPieceElement.textContent = bestCraft.name || '-';
    }
    
    // Coût total des matériaux
    const materialCostsElement = document.getElementById('materialCosts');
    if (materialCostsElement) {
        const totalCost = yogArmorCrafts.reduce((sum, craft) => {
            return sum + (craft.analysis ? craft.analysis.craftCost : 0);
        }, 0);
        materialCostsElement.textContent = formatCoins(totalCost);
    }
    
    // Dernière mise à jour
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = new Date().toLocaleTimeString('fr-FR');
    }
}

// Sauvegarde d'un snapshot dans l'historique
function saveProfitSnapshot() {
    const snapshot = {
        timestamp: new Date(),
        totalProfit: yogArmorCrafts.reduce((sum, craft) => sum + (craft.analysis?.rawProfit || 0), 0),
        pieces: yogArmorCrafts.map(craft => ({
            name: craft.name,
            profit: craft.analysis?.rawProfit || 0,
            profitPercent: craft.analysis?.profitPercent || 0,
            craftCost: craft.analysis?.craftCost || 0,
            sellPrice: craft.analysis?.sellPrice || 0,
            isRealData: craft.analysis?.isRealData || false
        })),
        materials: {
            enchantedHardstone: materialPrices.ENCHANTED_HARDSTONE?.sellPrice || 0,
            yoggie: materialPrices.YOGGIE?.sellPrice || 0
        }
    };
    
    profitHistory.unshift(snapshot);
    
    // Garder seulement les 20 derniers
    if (profitHistory.length > 20) {
        profitHistory = profitHistory.slice(0, 20);
    }
    
    // Sauvegarder dans localStorage
    try {
        const historyToSave = profitHistory.map(item => ({
            ...item,
            timestamp: item.timestamp.toISOString()
        }));
        localStorage.setItem('yogArmorHistory', JSON.stringify(historyToSave));
    } catch (error) {
        console.warn('Impossible de sauvegarder l\'historique:', error);
    }
}

// Chargement de l'historique
function loadProfitHistory() {
    try {
        const saved = localStorage.getItem('yogArmorHistory');
        if (saved) {
            const parsedHistory = JSON.parse(saved);
            profitHistory = parsedHistory.map(item => ({
                ...item,
                timestamp: new Date(item.timestamp)
            }));
        }
    } catch (error) {
        console.warn('Impossible de charger l\'historique:', error);
        profitHistory = [];
    }
}

// Mise à jour de l'historique affiché
function updateHistoricalData() {
    const container = document.getElementById('historicalData');
    
    if (!container) return;
    
    if (profitHistory.length === 0) {
        container.innerHTML = '<div class="no-data">Aucun historique pour le moment...</div>';
        return;
    }
    
    const html = profitHistory.slice(0, 10).map(snapshot => `
        <div class="historical-item">
            <div class="historical-header">
                <strong>Snapshot du ${snapshot.timestamp.toLocaleString('fr-FR')}</strong>
                <span class="historical-timestamp">Profit total: ${formatCoins(snapshot.totalProfit)}</span>
            </div>
            <div class="historical-details">
                ${snapshot.pieces.map(piece => `
                    <div>${piece.name}: ${formatCoins(piece.profit)} (${piece.profitPercent >= 0 ? '+' : ''}${piece.profitPercent.toFixed(1)}%) ${piece.isRealData ? '🟢' : '🟡'}</div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Vider l'historique
function clearProfitHistory() {
    if (confirm('❓ Êtes-vous sûr de vouloir vider l\'historique des profits ?')) {
        profitHistory = [];
        try {
            localStorage.removeItem('yogArmorHistory');
        } catch (error) {
            console.warn('Impossible de vider l\'historique:', error);
        }
        updateHistoricalData();
        console.log('Historique des profits vidé');
    }
}

// Affichage d'erreur
function showError(message) {
    const armorGrid = document.getElementById('armorGrid');
    if (armorGrid) {
        armorGrid.innerHTML = `
            <div class="error-message">
                ❌ ${message}
                <br><button onclick="refreshAllData()" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">🔄 Réessayer</button>
            </div>
        `;
    }
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

function formatMaterialName(material) {
    const names = {
        'ENCHANTED_HARDSTONE': 'Enchanted Hardstone',
        'YOGGIE': 'Yoggie'
    };
    return names[material] || material;
}