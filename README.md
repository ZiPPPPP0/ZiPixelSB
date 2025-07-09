# Hypixel Skyblock Money Guide

## 📋 Description
This website uses Hypixel's API to provide a comprehensive money making guide for Hypixel Skyblock players. The project was created to compare and calculate various money making methods depending on actual market prices.

## 🚀 Features

### 🏆 Main Guide (MMM Guide)
- **25+ Mining Methods** with detailed equipment requirements
- **Real-time Bazaar prices** integration
- **Profit comparison** between NPC sales and Bazaar trading
- **Filtering system** by category, minimum profit, and sort options
- **Detailed equipment requirements** for each method
- **Production rates** and efficiency calculations

### 📊 Bazaar Flips
- **Real-time flip opportunities** detection
- **Profit percentage** calculations
- **Volume filtering** for safer investments
- **Capital limits** to match your budget
- **Flip history** tracking
- **Auto-refresh** every 2 minutes

### 🧮 Personal Calculator
- **Custom profit calculations** based on your own farming tests
- **Efficiency comparison** with optimal setups
- **Historical tracking** of your calculations
- **Real-time price updates** from Hypixel API
- **Export functionality** for your data

## 📂 Project Structure

```
Projet_site_hypixel/
├── index.html                 # Main page (MMM Guide)
├── css/
│   ├── style.css             # Global styles
│   ├── bazaar.css            # Bazaar-specific styles
│   └── calculator.css        # Calculator-specific styles
├── js/
│   ├── main.js               # Main guide logic
│   ├── bazaar.js             # Bazaar flip detection
│   └── calculator.js         # Personal calculator
├── pages/
│   ├── bazaar.html           # Bazaar flips page
│   └── calculator.html       # Calculator page
└── README.md                 # This file
```

## 💰 Money Making Methods Included

### Mining Methods (25+)
- **Quartz Mining** - 28,635 items/h → 59.6M/h
- **Redstone Mining** - 42,966 items/h → 51.5M/h
- **Iron Mining** - 32,091 items/h → 44.3M/h
- **Cobblestone Mining** - 38,280 items/h → 49.8M/h
- **Tungsten Mining** - 2,435 items/h → 32.9M/h
- **Amber Gemstone** - 1,610 items/h → 46.7M/h
- **Ruby Gemstone** - 1,335 items/h → 40.3M/h
- **Jade Gemstone** - 1,336 items/h → 33.4M/h
- **Mithril Mining** - 13,564 items/h → 38M/h
- **Obsidian Mining** - 14,865 items/h → 32M/h
- And many more...

### Detailed Equipment Requirements
Each method includes specific gear needed:
- **Armor sets** (Full Divan, Full Glossy Mineral, etc.)
- **Drilling tools** (Blue Cheese Drill, Divan Drill, Fleet Drill)
- **Specialized pets** (Scatha Pet, Black Cat Pet, Bell Pet, Armadillo Pet)
- **Special items** (Dragonfade Cloak, Heated Reforge, Haste Rings)

## 🛠️ Setup Instructions

### 1. Basic Setup
1. Download all files maintaining the folder structure
2. Open `index.html` in a web browser
3. The site will work with fallback prices

### 2. API Integration (Optional)
To get real-time prices, you need to:
1. Get a Hypixel API key from [Hypixel Developer Portal](https://developer.hypixel.net/)
2. The API endpoints used:
   - `https://api.hypixel.net/skyblock/bazaar` (No API key required)
   - Note: The bazaar endpoint doesn't require authentication

### 3. Local Development
- No build process required
- Pure HTML/CSS/JavaScript
- Can be served with any web server
- Works offline with fallback data

## 🎯 Usage

### Main Guide
1. Visit the main page to see all money making methods
2. Use filters to find methods matching your criteria
3. Compare NPC vs Bazaar profits
4. Check equipment requirements for each method

### Bazaar Flips
1. Navigate to the Bazaar page
2. Set your minimum profit percentage
3. Filter by volume and capital requirements
4. Click on items to add to history

### Personal Calculator
1. Go to the Calculator page
2. Select the item you're farming
3. Enter your test results (items collected + time)
4. Get personalized profit calculations
5. Compare with optimal setups

## 📊 Data Sources

- **Hypixel API** for real-time bazaar prices
- **Community data** for optimal production rates
- **Equipment requirements** from experienced players
- **NPC prices** from game data

## 🔧 Technical Details

### Technologies Used
- **HTML5** for structure
- **CSS3** with modern features (Grid, Flexbox, Animations)
- **Vanilla JavaScript** (ES6+)
- **Fetch API** for HTTP requests
- **LocalStorage** for data persistence

### Key Features
- **Responsive design** for all devices
- **Real-time updates** every 2 minutes
- **Error handling** with fallback data
- **Progressive enhancement** - works without API
- **Accessibility** considerations

## 🔮 Future Enhancements

The project may evolve with more features:
- **Additional categories** (Farming, Combat, Fishing methods)
- **Price history charts** and trends
- **Profit optimization suggestions**
- **User accounts** and saved configurations
- **Mobile app** version
- **Discord bot** integration

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Test your changes
4. Submit a pull request

## 📧 Contact

For questions or suggestions, please open an issue on the repository.

---

**Note:** This tool is for educational purposes. Always verify current market conditions before making investment decisions in Hypixel Skyblock.