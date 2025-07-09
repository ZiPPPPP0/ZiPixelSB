// Configuration
const HYPIXEL_API_BASE = 'https://api.hypixel.net';

// Données des méthodes de gains - Mining Methods avec production par heure
const moneyMethods = [
    {
        id: 'mining_quartz',
        title: 'Quartz Mining',
        category: 'mining',
        difficulty: 3,
        baseProfit: 59600000,
        production: {
            item: 'ENCHANTED_QUARTZ',
            amount: 28635,
            npcPrice: 639,
            lastBazaarPrice: 2090
        },
        profitRange: '18.3M - 59.6M',
        description: 'Mine du quartz pour produire 28,635 enchanted quartz par heure. Méthode très rentable avec un bon profit bazaar.',
        requirements: ['Full Divan Armor', 'Blue Cheese Drill', 'Mining Fortune optimisée'],
        tips: 'Le prix bazaar varie beaucoup, surveillez les fluctuations pour maximiser les profits'
    },
    {
        id: 'mining_redstone',
        title: 'Redstone Mining',
        category: 'mining',
        difficulty: 2,
        baseProfit: 51500000,
        production: {
            item: 'ENCHANTED_REDSTONE',
            amount: 42966,
            npcPrice: 160,
            lastBazaarPrice: 1200
        },
        profitRange: '6.87M - 51.5M',
        description: 'Mine de la redstone pour produire 42,966 enchanted redstone par heure. Bon volume de production.',
        requirements: ['Full Divan Armor', 'Blue Cheese Drill', 'Fortune Mining'],
        tips: 'Grande différence entre vente NPC et bazaar, privilégiez le bazaar'
    },
    {
        id: 'mining_iron',
        title: 'Iron Mining',
        category: 'mining',
        difficulty: 2,
        baseProfit: 44300000,
        production: {
            item: 'ENCHANTED_IRON',
            amount: 32091,
            npcPrice: 318,
            lastBazaarPrice: 1380
        },
        profitRange: '10.2M - 44.3M',
        description: 'Mine du fer pour produire 32,091 enchanted iron par heure. Méthode stable et accessible.',
        requirements: ['Full Glossy Mineral Armor', 'Blue Cheese Drill', 'Mining Fortune'],
        tips: 'Bon compromis entre accessibilité et rentabilité'
    },
    {
        id: 'mining_cobblestone',
        title: 'Cobblestone Mining',
        category: 'mining',
        difficulty: 1,
        baseProfit: 49800000,
        production: {
            item: 'ENCHANTED_COBBLESTONE',
            amount: 38280,
            npcPrice: 159,
            lastBazaarPrice: 1300
        },
        profitRange: '6.1M - 49.8M (avec Haste Rings)',
        description: 'Mine de la cobblestone avec 1,649 Mining Fortune et 310 Block Fortune. Produit 38,280 enchanted cobblestone/h et 300k XP/h.',
        requirements: ['Full Glossy Mineral Armor', 'Scatha Pet', 'Blue Cheese Drill', 'Haste Rings (pour prix max)'],
        tips: 'Avec Haste Rings: 1,300 coins/item vs 440 sans. Investissement rentable!'
    },
    {
        id: 'mining_tungsten',
        title: 'Tungsten Mining',
        category: 'mining',
        difficulty: 5,
        baseProfit: 32900000,
        production: {
            item: 'ENCHANTED_TUNGSTEN',
            amount: 2435,
            npcPrice: 2435,
            lastBazaarPrice: 13500
        },
        profitRange: '5.93M - 32.9M',
        description: 'Mine du tungsten avec 2,159 Mining Fortune et 125 Dwarven Metal Fortune. Produit 2,435 enchanted tungsten/h et 1.68M XP/h.',
        requirements: ['Full Divan Armor', 'Blue Cheese Drill', 'Setup très avancé'],
        tips: 'Énorme différence entre bazaar et NPC. Nécessite un setup dwarven optimal'
    },
    {
        id: 'mining_umber',
        title: 'Umber Mining',
        category: 'mining',
        difficulty: 5,
        baseProfit: 1861500,
        production: {
            item: 'ENCHANTED_UMBER',
            amount: 1275,
            npcPrice: 1275,
            lastBazaarPrice: 1460
        },
        profitRange: '1.62M - 1.86M',
        description: 'Mine de l\'umber avec 2,159 Mining Fortune et 125 Dwarven Metal Fortune. Produit 1,275 enchanted umber/h et complément au tungsten.',
        requirements: ['Full Divan Armor', 'Blue Cheese Drill', 'Setup très avancé'],
        tips: 'Souvent miné en complément du tungsten. Prix plus stable que le tungsten'
    },
    {
        id: 'mining_amber',
        title: 'Amber Gemstone Mining',
        category: 'mining',
        difficulty: 5,
        baseProfit: 46700000,
        production: {
            item: 'FINE_AMBER_GEMSTONE',
            amount: 1610,
            npcPrice: 18696,
            lastBazaarPrice: 29000
        },
        profitRange: '30.1M - 46.7M',
        description: 'Mine de l\'ambre avec 2,169 Mining Fortune et 190 Gemstone Fortune. Produit 1,610 fine amber/h ou 20.1 flawless/h et 920k XP/h.',
        requirements: ['Full Divan Armor', 'Blue Cheese Drill', 'Setup gemstone expert'],
        tips: 'Prix très volatils. Les flawless amber sont plus rares mais beaucoup plus chers'
    },
    {
        id: 'mining_gold',
        title: 'Gold Mining',
        category: 'mining',
        difficulty: 3,
        baseProfit: 42500000,
        production: {
            item: 'ENCHANTED_GOLD',
            amount: 84579,
            npcPrice: 480,
            lastBazaarPrice: 500
        },
        profitRange: '40.6M - 42.5M',
        description: 'Mine de l\'or avec 1,699 Mining Fortune et 110 Ore Fortune. Produit 84,579 enchanted gold/h et 5.15M XP/h.',
        requirements: ['Full Glossy Mineral Armor', 'Divan Armor (Swap)', 'Blue Cheese Drill'],
        tips: 'Excellent pour l\'XP mining en plus du profit. Prix relativement stables'
    },
    {
        id: 'mining_diamond',
        title: 'Diamond Mining',
        category: 'mining',
        difficulty: 3,
        baseProfit: 43000000,
        production: {
            item: 'ENCHANTED_DIAMOND',
            amount: 31812,
            npcPrice: 1280,
            lastBazaarPrice: 1350
        },
        profitRange: '40.7M - 43M',
        description: 'Mine des diamants pour produire 31,812 enchanted diamonds par heure et 1.56M XP/h.',
        requirements: ['Full Glossy Mineral Armor', 'Blue Cheese Drill', 'Accès deep caverns'],
        tips: 'Très stable, prix peu volatils. Bon pour l\'XP mining'
    },
    {
        id: 'mining_flint',
        title: 'Flint Mining',
        category: 'mining',
        difficulty: 4,
        baseProfit: 42100000,
        production: {
            item: 'ENCHANTED_FLINT',
            amount: 6674,
            npcPrice: 640,
            lastBazaarPrice: 6310
        },
        profitRange: '4.27M - 42.1M',
        description: 'Mine du flint avec 1,044 Mining Fortune et 310 Block Fortune. Produit 6,674 enchanted flint/h et 112k XP/h.',
        requirements: ['Full Glossy Mineral Armor', 'Flint Shovel', 'Blue Cheese Drill'],
        tips: 'Prix très élevé par item mais production plus faible. Très sensible aux fluctuations bazaar'
    },
    {
        id: 'mining_mycelium',
        title: 'Mycelium/Red Sand Mining',
        category: 'mining',
        difficulty: 3,
        baseProfit: 41000000,
        production: {
            item: 'ENCHANTED_MYCELIUM',
            amount: 31560,
            npcPrice: 798,
            lastBazaarPrice: 1300
        },
        profitRange: '25.2M - 41M',
        description: 'Mine du mycelium/red sand avec 1,019 Mining Fortune et 310 Block Fortune. Produit 31,560 enchanted mycelium/h et 1.4M XP/h.',
        requirements: ['Full Glossy Mineral Armor', 'Blue Cheese Drill', 'Black Cat Pet'],
        tips: 'Bon équilibre entre profit et XP. Zones parfois difficiles d\'accès'
    },
    {
        id: 'mining_ruby',
        title: 'Ruby Gemstone Mining',
        category: 'mining',
        difficulty: 5,
        baseProfit: 40300000,
        production: {
            items: [
                { item: 'FINE_RUBY_GEMSTONE', amount: 1335, npcPrice: 26217, lastBazaarPrice: 30000 },
                { item: 'FINE_TOPAZ_GEMSTONE', amount: 490, npcPrice: 18367, lastBazaarPrice: 20000 }
            ]
        },
        profitRange: '35M - 40.3M',
        description: 'Mine des rubis avec 2,169 Mining Fortune et 190 Gemstone Fortune. Produit 1,335 fine ruby/h + 490 fine topaz/h et 1.06M XP/h.',
        requirements: ['Full Divan Armor', 'Heated Reforge', 'Bell Pet', 'Blue Cheese Drill'],
        tips: 'Bazaar uniquement, prix très volatils. Topaz en bonus appréciable'
    },
    {
        id: 'mining_emerald',
        title: 'Emerald Mining',
        category: 'mining',
        difficulty: 3,
        baseProfit: 38000000,
        production: {
            item: 'ENCHANTED_EMERALD',
            amount: 36216,
            npcPrice: 696,
            lastBazaarPrice: 1050
        },
        profitRange: '25.2M - 38M',
        description: 'Mine des émeraudes pour produire 36,216 enchanted emerald par heure et 1.85M XP/h.',
        requirements: ['Full Glossy Mineral Armor', 'Blue Cheese Drill', 'Fortune Mining'],
        tips: 'Bon ratio XP/profit. Production élevée compensant le prix moyen'
    },
    {
        id: 'mining_mithril',
        title: 'Mithril Mining',
        category: 'mining',
        difficulty: 4,
        baseProfit: 38000000,
        production: {
            items: [
                { item: 'ENCHANTED_MITHRIL', amount: 13564, npcPrice: 1598, lastBazaarPrice: 1460 },
                { item: 'ENCHANTED_TITANIUM', amount: 1352, npcPrice: 1598, lastBazaarPrice: 1460 }
            ]
        },
        profitRange: '21.68M - 38M',
        description: 'Mine du mithril avec 2,209 Mining Fortune et 125 Dwarven Metal Fortune. Produit 13,564 enchanted mithril + 1,352 enchanted titanium/h et 2.7M XP/h.',
        requirements: ['Full Divan Armor', 'Blue Cheese Drill', 'Équipement dwarven'],
        tips: 'Produit aussi du titanium en bonus. Bon équilibre profit/XP dans les Dwarven Mines'
    },
    {
        id: 'mining_jade',
        title: 'Jade Gemstone Mining',
        category: 'mining',
        difficulty: 5,
        baseProfit: 33400000,
        production: {
            item: 'FINE_JADE_GEMSTONE',
            amount: 1336,
            npcPrice: 19162,
            lastBazaarPrice: 25000
        },
        profitRange: '25.6M - 33.4M',
        description: 'Mine de la jade avec 2,209 Mining Fortune et 315 Gemstone Fortune + 30 Fortune from belt. Produit 1,336 fine jade gemstone/h et 942k XP/h.',
        requirements: ['Full Divan Armor', 'Blue Cheese Drill', 'Belt avec +30 Fortune'],
        tips: 'Prix bazaar TRÈS volatils. Vérifiez toujours avant de farmer!'
    },
    {
        id: 'mining_lapis',
        title: 'Lapis Mining',
        category: 'mining',
        difficulty: 2,
        baseProfit: 32600000,
        production: {
            item: 'ENCHANTED_LAPIS_LAZULI',
            amount: 34375,
            npcPrice: 160,
            lastBazaarPrice: 950
        },
        profitRange: '5.5M - 32.6M',
        description: 'Mine du lapis pour produire 34,375 enchanted lapis par heure et 955k XP/h.',
        requirements: ['Full Glossy Mineral Armor', 'Blue Cheese Drill', 'Mining setup basique'],
        tips: 'Méthode accessible pour débutants. Grande différence NPC/bazaar'
    },
    {
        id: 'mining_obsidian',
        title: 'Obsidian Mining',
        category: 'mining',
        difficulty: 4,
        baseProfit: 32000000,
        production: {
            item: 'ENCHANTED_OBSIDIAN',
            amount: 14865,
            npcPrice: 1440,
            lastBazaarPrice: 2150
        },
        profitRange: '21.4M - 32M',
        description: 'Mine de l\'obsidienne avec 1,578 Mining Fortune et 385 Block Fortune. Produit 14,865 enchanted obsidian/h et 3.75M XP/h.',
        requirements: ['Full Glossy Mineral Armor', 'Dragonfade Cloak', 'Fleet Drill', 'Blue Cheese Drill'],
        tips: 'Excellent pour l\'XP (3.75M/h). Production plus faible mais XP très élevée'
    },
    {
        id: 'mining_sand',
        title: 'Sand Mining',
        category: 'mining',
        difficulty: 2,
        baseProfit: 21900000,
        production: {
            item: 'ENCHANTED_SAND',
            amount: 36492,
            npcPrice: 321,
            lastBazaarPrice: 600
        },
        profitRange: '11.7M - 21.9M',
        description: 'Mine du sable avec 919 Mining Fortune et 310 Block Fortune. Produit 36,492 enchanted sand/h et 1.32M XP/h.',
        requirements: ['Full Glossy Mineral Armor', 'Scatha Pet', 'Promising Shovel', 'Blue Cheese Drill', 'Black Cat Pet'],
        tips: 'Méthode stable et accessible. Bon pour commencer le mining fortune'
    },
    // Méthodes supplémentaires basées sur le CSV
    {
        id: 'mining_coal',
        title: 'Coal Mining (Crystal Hollows)',
        category: 'mining',
        difficulty: 4,
        baseProfit: 25000000,
        production: {
            item: 'ENCHANTED_COAL',
            amount: 35000,
            npcPrice: 480,
            lastBazaarPrice: 714
        },
        profitRange: '16.8M - 25M',
        description: 'Mine du charbon dans les Crystal Hollows avec setup dwarven optimisé.',
        requirements: ['3/4 Divan Armor', '1 Mineral Armor', 'Divan Drill', 'Blue Cheese Drill'],
        tips: 'Excellent dans les Crystal Hollows, fortune dwarven requise'
    },
    {
        id: 'mining_glacite',
        title: 'Glacite Mining',
        category: 'mining',
        difficulty: 4,
        baseProfit: 28000000,
        production: {
            item: 'GLACITE',
            amount: 45000,
            npcPrice: 480,
            lastBazaarPrice: 622
        },
        profitRange: '21.6M - 28M',
        description: 'Mine de la glacite avec setup dwarven complet.',
        requirements: ['Full Divan Armor', 'Blue Cheese Drill', 'Setup dwarven complet'],
        tips: 'Nécessite accès aux zones glacite et setup dwarven optimal'
    },
    {
        id: 'mining_ice',
        title: 'Ice Mining',
        category: 'mining',
        difficulty: 3,
        baseProfit: 22000000,
        production: {
            item: 'ENCHANTED_ICE',
            amount: 40000,
            npcPrice: 480,
            lastBazaarPrice: 550
        },
        profitRange: '19.2M - 22M',
        description: 'Mine de la glace avec pickaxe spécialisée.',
        requirements: ['Full Glossy Mineral Armor', 'Pioneer Pickaxe (Fleet)', 'Blue Cheese Drill'],
        tips: 'Disponible à Jerry Island, nécessite Pioneer Pickaxe avec reforge Fleet'
    },
    {
        id: 'mining_hardstone',
        title: 'Hardstone Mining',
        category: 'mining',
        difficulty: 3,
        baseProfit: 24000000,
        production: {
            item: 'HARDSTONE',
            amount: 50000,
            npcPrice: 400,
            lastBazaarPrice: 480
        },
        profitRange: '20M - 24M',
        description: 'Mine de la hardstone avec pet Armadillo pour bonus.',
        requirements: ['Full Glossy Mineral Armor', 'Armadillo Pet', 'Fleet Drill', 'Blue Cheese Drill'],
        tips: 'Le pet Armadillo donne un bonus significatif pour la hardstone'
    },
    {
        id: 'mining_endstone',
        title: 'Endstone Mining',
        category: 'mining',
        difficulty: 3,
        baseProfit: 26000000,
        production: {
            item: 'ENCHANTED_ENDSTONE',
            amount: 38000,
            npcPrice: 560,
            lastBazaarPrice: 684
        },
        profitRange: '21.3M - 26M',
        description: 'Mine de l\'endstone dans l\'End.',
        requirements: ['Full Glossy Mineral Armor', 'Fleet Drill', 'Blue Cheese Drill'],
        tips: 'Disponible dans Dragon\'s Nest, nécessite accès à l\'End'
    },
    {
        id: 'mining_glowstone',
        title: 'Glowstone Mining',
        category: 'mining',
        difficulty: 3,
        baseProfit: 23000000,
        production: {
            item: 'ENCHANTED_GLOWSTONE',
            amount: 35000,
            npcPrice: 560,
            lastBazaarPrice: 657
        },
        profitRange: '19.6M - 23M',
        description: 'Mine de la glowstone dans le Nether.',
        requirements: ['Full Glossy Mineral Armor', 'Fleet Drill', 'Blue Cheese Drill'],
        tips: 'Disponible au Volcano dans Crimson Isle'
    }
];

// Variables globales
let filteredMethods = [...moneyMethods];
let currentBazaarPrices = {};

// Debug: vérifier que les données sont bien chargées
console.log('Données MMM chargées:', moneyMethods.length, 'méthodes');

// Fonction pour calculer le profit actuel basé sur les prix bazaar
function calculateCurrentProfit(method) {
    if (!method.production) return method.baseProfit;
    
    // Gestion des méthodes avec plusieurs items (tungsten/umber, mithril/titanium, ruby/topaz)
    if (method.production.items) {
        let totalProfit = 0;
        method.production.items.forEach(item => {
            const currentPrice = currentBazaarPrices[item.item] || item.lastBazaarPrice || item.npcPrice;
            totalProfit += item.amount * currentPrice;
        });
        return totalProfit;
    } else {
        // Méthodes avec un seul item
        const prod = method.production;
        const currentPrice = currentBazaarPrices[prod.item] || prod.lastBazaarPrice || prod.npcPrice;
        return prod.amount * currentPrice;
    }
}

// Fonction pour calculer le profit NPC
function calculateNpcProfit(method) {
    if (!method.production) return 0;
    
    // Gestion des méthodes avec plusieurs items
    if (method.production.items) {
        let totalProfit = 0;
        method.production.items.forEach(item => {
            totalProfit += item.amount * item.npcPrice;
        });
        return totalProfit;
    } else {
        // Méthodes avec un seul item
        const prod = method.production;
        return prod.amount * prod.npcPrice;
    }
}

// Fonction pour obtenir les prix par item
function getItemPrices(method) {
    if (!method.production) return { npcPrice: 0, bazaarPrice: 0 };
    
    if (method.production.items) {
        // Pour les méthodes multi-items, calculer un prix moyen pondéré
        let totalAmount = 0;
        let totalNpcValue = 0;
        let totalBazaarValue = 0;
        
        method.production.items.forEach(item => {
            totalAmount += item.amount;
            totalNpcValue += item.amount * item.npcPrice;
            const currentPrice = currentBazaarPrices[item.item] || item.lastBazaarPrice;
            totalBazaarValue += item.amount * currentPrice;
        });
        
        return {
            npcPrice: totalNpcValue / totalAmount,
            bazaarPrice: totalBazaarValue / totalAmount
        };
    } else {
        const prod = method.production;
        const currentPrice = currentBazaarPrices[prod.item] || prod.lastBazaarPrice;
        return {
            npcPrice: prod.npcPrice,
            bazaarPrice: currentPrice
        };
    }
}

// Fonction pour obtenir la production par heure formatée
function getProductionInfo(method) {
    if (!method.production) return 'Production non spécifiée';
    
    if (method.production.items) {
        const totalAmount = method.production.items.reduce((sum, item) => sum + item.amount, 0);
        return `${formatNumber(totalAmount)} items/h`;
    } else {
        const prod = method.production;
        return `${formatNumber(prod.amount)} items/h`;
    }
}

// Fonction pour récupérer les prix du bazaar (avec fallback simple)
async function fetchBazaarPrices() {
    try {
        console.log('Tentative de récupération des prix API...');
        
        const response = await fetch('https://api.hypixel.net/skyblock/bazaar');
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success || !data.products) {
            throw new Error('Réponse API invalide');
        }
        
        const bazaarPrices = {};
        Object.entries(data.products).forEach(([productId, productData]) => {
            if (productData.quick_status && productData.quick_status.sellPrice > 0) {
                bazaarPrices[productId] = productData.quick_status.sellPrice;
            }
        });
        
        console.log(`Prix API récupérés: ${Object.keys(bazaarPrices).length} items`);
        return bazaarPrices;
        
    } catch (error) {
        console.error('Erreur API, utilisation des prix par défaut:', error.message);
        
        // Prix de fallback pour tous les items
        return {
            'ENCHANTED_QUARTZ': 2090,
            'ENCHANTED_REDSTONE': 1200,
            'ENCHANTED_IRON': 1380,
            'ENCHANTED_COBBLESTONE': 1300,
            'ENCHANTED_TUNGSTEN': 13500,
            'ENCHANTED_UMBER': 1460,
            'FINE_AMBER_GEMSTONE': 29000,
            'ENCHANTED_GOLD': 500,
            'ENCHANTED_DIAMOND': 1350,
            'ENCHANTED_FLINT': 6310,
            'ENCHANTED_MYCELIUM': 1300,
            'FINE_RUBY_GEMSTONE': 30000,
            'FINE_TOPAZ_GEMSTONE': 20000,
            'ENCHANTED_EMERALD': 1050,
            'ENCHANTED_MITHRIL': 1460,
            'ENCHANTED_TITANIUM': 1460,
            'FINE_JADE_GEMSTONE': 25000,
            'ENCHANTED_LAPIS_LAZULI': 950,
            'ENCHANTED_OBSIDIAN': 2150,
            'ENCHANTED_SAND': 600,
            'ENCHANTED_COAL': 714,
            'GLACITE': 622,
            'ENCHANTED_ICE': 550,
            'HARDSTONE': 480,
            'ENCHANTED_ENDSTONE': 684,
            'ENCHANTED_GLOWSTONE': 657
        };
    }
}

// Fonction pour mettre à jour les prix et recalculer les profits
async function updatePricesAndProfits() {
    try {
        console.log('Mise à jour des prix...');
        
        currentBazaarPrices = await fetchBazaarPrices();
        
        moneyMethods.forEach(method => {
            method.currentProfit = calculateCurrentProfit(method);
            method.npcProfit = calculateNpcProfit(method);
        });
        
        console.log('Prix mis à jour, application des filtres...');
        applyFilters();
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour des prix:', error);
        
        // En cas d'erreur, utiliser les profits de base
        moneyMethods.forEach(method => {
            method.currentProfit = method.baseProfit;
            method.npcProfit = calculateNpcProfit(method);
        });
        
        applyFilters();
    }
}

// Initialisation des filtres
function initializeFilters() {
    try {
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');
        const minProfitFilter = document.getElementById('minProfit');

        if (!categoryFilter || !sortFilter || !minProfitFilter) {
            console.error('Éléments de filtre non trouvés dans le DOM');
            return false;
        }

        [categoryFilter, sortFilter, minProfitFilter].forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });
        
        console.log('Filtres initialisés avec succès');
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des filtres:', error);
        return false;
    }
}

// Application des filtres
function applyFilters() {
    try {
        console.log('Application des filtres...');
        
        const categoryElement = document.getElementById('categoryFilter');
        const sortElement = document.getElementById('sortFilter');
        const minProfitElement = document.getElementById('minProfit');
        
        const category = categoryElement ? categoryElement.value : 'all';
        const sortBy = sortElement ? sortElement.value : 'bazaar';
        const minProfit = minProfitElement ? (parseInt(minProfitElement.value) || 0) : 0;

        filteredMethods = moneyMethods.filter(method => {
            const currentProfitValue = method.currentProfit || method.baseProfit;
            const categoryMatch = category === 'all' || method.category === category;
            const profitMatch = currentProfitValue >= minProfit;
            
            return categoryMatch && profitMatch;
        });

        // Tri selon le critère sélectionné
        filteredMethods.sort((a, b) => {
            if (sortBy === 'npc') {
                const profitA = a.npcProfit || 0;
                const profitB = b.npcProfit || 0;
                return profitB - profitA;
            } else {
                // Tri par profit bazaar (défaut)
                const profitA = a.currentProfit || a.baseProfit;
                const profitB = b.currentProfit || b.baseProfit;
                return profitB - profitA;
            }
        });

        console.log(`Filtres appliqués: ${filteredMethods.length} méthodes trouvées, triées par ${sortBy === 'npc' ? 'profit NPC' : 'profit Bazaar'}`);
        
        renderMethods();
        updateStats();
    } catch (error) {
        console.error('Erreur lors de l\'application des filtres:', error);
    }
}

// Affichage des méthodes
function renderMethods() {
    try {
        console.log('Rendu des méthodes...');
        
        const container = document.getElementById('methodsContainer');
        
        if (!container) {
            console.error('Container methodsContainer non trouvé');
            return;
        }
        
        if (filteredMethods.length === 0) {
            container.innerHTML = '<div class="loading">Aucune méthode ne correspond aux filtres sélectionnés.</div>';
            console.log('Aucune méthode à afficher');
            return;
        }

        const html = filteredMethods.map(method => {
            const currentProfitValue = method.currentProfit || method.baseProfit;
            const npcProfitValue = method.npcProfit || 0;
            const itemPrices = getItemPrices(method);
            
            // Vérifier si on a des prix réels
            const hasRealPrices = method.production && (
                method.production.items ? 
                method.production.items.some(item => currentBazaarPrices.hasOwnProperty(item.item)) :
                currentBazaarPrices.hasOwnProperty(method.production.item)
            );
            const priceStatus = hasRealPrices ? '🟢 Prix réels' : '🟡 Prix estimés';
            
            return `
            <div class="method-card" data-category="${method.category}">
                <div class="method-header">
                    <div>
                        <div class="method-title">${method.title}</div>
                        <div class="method-category">${getCategoryLabel(method.category)}</div>
                    </div>
                </div>
                
                <div class="profit-info">
                    <div class="profit-main">${formatCoins(currentProfitValue)}/h</div>
                    <div class="profit-details">
                        ${getProductionInfo(method)} • ${priceStatus}
                    </div>
                </div>

                <div class="price-comparison">
                    <div class="price-row">
                        <span class="price-label">💰 Prix par item:</span>
                        <div class="price-values">
                            <span class="npc-price">NPC: ${formatCoins(itemPrices.npcPrice)}</span>
                            <span class="bazaar-price">Bazaar: ${formatCoins(itemPrices.bazaarPrice)}</span>
                        </div>
                    </div>
                    <div class="price-row">
                        <span class="price-label">📊 Profit total:</span>
                        <div class="price-values">
                            <span class="npc-profit">NPC: ${formatCoins(npcProfitValue)}/h</span>
                            <span class="bazaar-profit">Bazaar: ${formatCoins(currentProfitValue)}/h</span>
                        </div>
                    </div>
                </div>

                <div class="description">${method.description}</div>

                <div class="requirements">
                    <h4>Prérequis:</h4>
                    ${method.requirements.map(req => `<span class="req-item">${req}</span>`).join('')}
                </div>
            </div>
        `;
        }).join('');
        
        container.innerHTML = html;
        console.log(`${filteredMethods.length} méthodes affichées avec succès`);
        
    } catch (error) {
        console.error('Erreur lors du rendu des méthodes:', error);
        
        const container = document.getElementById('methodsContainer');
        if (container) {
            container.innerHTML = `
                <div class="error">
                    ❌ Erreur lors de l'affichage des méthodes
                    <br>Détails: ${error.message}
                    <br><button onclick="location.reload()">🔄 Recharger</button>
                </div>
            `;
        }
    }
}

// Mise à jour des statistiques
function updateStats() {
    try {
        const totalElement = document.getElementById('totalMethods');
        const bestProfitElement = document.getElementById('bestProfit');
        const lastUpdateElement = document.getElementById('lastUpdate');
        
        if (totalElement) {
            totalElement.textContent = filteredMethods.length;
        }
        
        if (bestProfitElement) {
            const sortElement = document.getElementById('sortFilter');
            const sortBy = sortElement ? sortElement.value : 'bazaar';
            
            let bestProfitValue = 0;
            if (filteredMethods.length > 0) {
                if (sortBy === 'npc') {
                    bestProfitValue = Math.max(...filteredMethods.map(m => m.npcProfit || 0));
                } else {
                    bestProfitValue = Math.max(...filteredMethods.map(m => m.currentProfit || m.baseProfit));
                }
            }
            bestProfitElement.textContent = bestProfitValue > 0 ? formatCoins(bestProfitValue) : '-';
        }
        
        if (lastUpdateElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('fr-FR');
            lastUpdateElement.textContent = timeString;
        }
        
        console.log('Stats mises à jour');
    } catch (error) {
        console.error('Erreur lors de la mise à jour des stats:', error);
    }
}

// Utilitaires de formatage
function formatCoins(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'K';
    }
    return Math.round(amount).toString();
}

function formatNumber(num) {
    return num.toLocaleString('fr-FR');
}

function formatItemName(name) {
    return name.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function getCategoryLabel(category) {
    const labels = {
        'trading': 'Trading',
        'farming': 'Farming',
        'mining': 'Mining',
        'combat': 'Combat',
        'fishing': 'Fishing',
        'misc': 'Divers'
    };
    return labels[category] || category;
}

// Fonction pour actualiser manuellement
function refreshPrices() {
    console.log('Actualisation manuelle des prix...');
    updatePricesAndProfits();
}

// Initialisation principale
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INITIALISATION DU GUIDE MMM ===');
    
    try {
        // Test basique: vérifier que les éléments existent
        const container = document.getElementById('methodsContainer');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (!container) {
            console.error('❌ Element methodsContainer non trouvé');
            return;
        }
        
        if (!categoryFilter) {
            console.error('❌ Element categoryFilter non trouvé');
            return;
        }
        
        console.log('✅ Éléments DOM trouvés');
        
        // Affichage immédiat pour test
        container.innerHTML = '<div class="loading">Chargement en cours...</div>';
        
        // Initialiser les filtres
        const filtersOk = initializeFilters();
        if (!filtersOk) {
            console.error('❌ Échec de l\'initialisation des filtres');
            return;
        }
        
        // Charger les données
        updatePricesAndProfits();
        
        // Auto-actualisation
        setInterval(updatePricesAndProfits, 120000);
        
        console.log('✅ Guide MMM initialisé avec succès');
        
    } catch (error) {
        console.error('❌ Erreur fatale lors de l\'initialisation:', error);
        
        const container = document.getElementById('methodsContainer');
        if (container) {
            container.innerHTML = `
                <div class="error">
                    ❌ Erreur fatale lors de l'initialisation
                    <br>Détails: ${error.message}
                    <br><button onclick="location.reload()">🔄 Recharger la page</button>
                </div>
            `;
        }
    }
});