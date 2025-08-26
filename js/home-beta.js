const API_URL = 'https://platetraits.com/api';
let allReviews = [];
let aggregatedReviews = {};
let currentPlateReviews = [];
let currentReviewIndex = 0;
let userVotes = {};
let authToken = localStorage.getItem('token');
let currentUsername = localStorage.getItem('username');
let isAuthModalInLoginMode = true;

// --- DATA ---
const vehicleMakes = ["Acura", "Alfa Romeo", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Dodge", "Fiat", "Ford", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", "Land Rover", "Lexus", "Lincoln", "Maserati", "Mazda", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Porsche", "Ram", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo", "Other"];
const vehicleModels = {"Acura": ["CL", "ILX", "Integra", "Legend", "MDX", "NSX", "RDX", "RL", "RLX", "SLX", "TLX", "Vigor", "ZDX"],"Alfa Romeo": ["4C", "8C", "GTV-6", "Giulia", "Milano", "Spider", "Stelvio", "Tonale"],"Audi": ["100", "200", "4000", "5000", "80", "90", "A3", "A4", "A5", "A6", "A7", "A8", "Cabriolet", "Coupe Quattro", "e-tron", "e-tron GT", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "R8", "RS 3", "RS 5", "RS 6", "RS 7", "RS Q8", "S3", "S4", "S5", "S6", "S8", "SQ5", "SQ7", "SQ8", "TT", "TT RS"],"BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "i3", "i4", "i7", "i8", "iX", "M2", "M3", "M4", "M5", "M6", "M8", "X1", "X2", "X3", "X3 M", "X4", "X4 M", "X5", "X5 M", "X6", "X6 M", "X7", "Z3", "Z4", "Z8"],"Buick": ["Allure", "Apollo", "Cascada", "Century", "Electra", "Enclave", "Encore", "Encore GX", "Envision", "Estate", "GS", "Invicta", "LaCrosse", "LeSabre", "Lucerne", "Park Avenue", "Rainier", "Reatta", "Regal", "Rendezvous", "Riviera", "Roadmaster", "Skyhawk", "Skylark", "Somerset", "Special", "Terraza", "Verano", "Wildcat"],"Cadillac": ["Allante", "ATS", "Brougham", "Celestiq", "Cimarron", "CT4", "CT5", "CT6", "CTS", "DeVille", "DTS", "Eldorado", "ELR", "Escalade", "Fleetwood", "Lyriq", "Seville", "SRX", "STS", "XLR", "XT4", "XT5", "XT6", "XTS"],"Chevrolet": ["Astro", "Avalanche", "Aveo", "Bel Air", "Beretta", "Biscayne", "Blazer", "Blazer EV", "Bolt EUV", "Bolt EV", "C/K Pickup", "Camaro", "Caprice", "Caprice Classic", "Captiva Sport", "Cavalier", "Celebrity", "Chevelle", "Chevette", "Chevy II / Nova", "Citation", "City Express", "Classic", "Cobalt", "Colorado", "Corsica", "Corvair", "Corvette", "Cruze", "El Camino", "Equinox", "Equinox EV", "Express", "HHR", "Impala", "Lumina", "LUV", "Malibu", "Metro", "Monte Carlo", "Monza", "Prizm", "S-10", "Silverado 1500", "Silverado 2500HD", "Silverado 3500HD", "Silverado EV", "Sonic", "Spark", "Spectrum", "Sprint", "SSR", "Suburban", "Tahoe", "Tracker", "TrailBlazer", "Traverse", "Trax", "Uplander", "Vega", "Venture", "Volt"],"Chrysler": ["200", "300", "300M", "Aspen", "Cirrus", "Concorde", "Cordoba", "Crossfire", "Dynasty", "E-Class", "Executive", "Fifth Avenue", "Grand Voyager", "Imperial", "Laser", "LeBaron", "LHS", "New Yorker", "Newport", "Pacifica", "Prowler", "PT Cruiser", "Sebring", "TC by Maserati", "Town & Country", "Voyager"],"Dodge": ["400", "600", "Aries", "Aspen", "Attitude", "Avenger", "Caliber", "Caravan", "Challenger", "Challenger SRT Demon / 170", "Challenger SRT Hellcat", "Charger", "Charger Daytona", "Charger SRT Hellcat", "Colt", "Conquest", "Coronet", "Dakota", "Dart", "Daytona", "Diplomat", "Durango", "Durango SRT / Hellcat", "Dynasty", "Grand Caravan", "Hornet", "Intrepid", "Journey", "Lancer", "Magnum", "Mirada", "Monaco", "Neon / SRT-4", "Nitro", "Omni", "Raider", "Rampage", "Shadow", "Spirit", "St. Regis", "Stealth", "Stratus", "Viper"],"Fiat": ["124 Spider", "500", "500L", "500X", "Brava", "Strada", "X1/9"],"Ford": ["Aerostar", "Aspire", "Bronco", "Bronco Sport", "C-Max", "Contour", "Crown Victoria", "E-Series", "E-Transit", "EcoSport", "Edge", "Escape", "Escort", "Escort ZX2", "Excursion", "Expedition", "Explorer", "EXP", "F-150", "F-150 Lightning", "F-250 Super Duty", "F-350 Super Duty", "Fairmont", "Festiva", "Fiesta", "Five Hundred", "Flex", "Focus", "Freestar", "Freestyle", "Fusion", "GT", "Granada", "LTD", "Maverick", "Mustang", "Mustang Mach-E", "Pinto", "Probe", "Ranger", "Taurus", "Taurus X", "Tempo", "Thunderbird", "Transit", "Transit Connect", "Windstar"],"Genesis": ["G70", "G80", "G90", "GV60", "GV70", "GV80"],"GMC": ["Acadia", "Caballero", "Canyon", "Envoy", "Envoy XUV", "Hummer EV", "Jimmy", "Rally", "Safari", "Savana", "Sierra 1500", "Sierra 2500HD", "Sierra 3500HD", "Sonoma", "Syclone", "Terrain", "Typhoon", "Vandura", "Yukon", "Yukon XL"],"Honda": ["600", "Accord", "Accord Crosstour", "Accord Hybrid", "Civic", "Civic Si", "Civic Type R", "Clarity", "CR-V", "CR-V Hybrid", "CR-Z", "CRX", "Crosstour", "Del Sol", "Element", "EV Plus", "Fit", "HR-V", "Insight", "Odyssey", "Passport", "Pilot", "Prelude", "Prologue", "Ridgeline", "S2000"],"Hyundai": ["Accent", "Azera", "Elantra", "Entourage", "Equus", "Excel", "Genesis", "Genesis Coupe", "Ioniq 5", "Ioniq 6", "Kona", "Nexo", "Palisade", "Pony", "Santa Cruz", "Santa Fe", "Scoupe", "Sonata", "Stellar", "Tiburon", "Tucson", "Veloster", "Venue", "Veracruz", "XG300", "XG350"],"Infiniti": ["EX", "FX", "G20", "G35", "G37", "I30", "I35", "J30", "JX", "M", "M30", "Q40", "Q50", "Q60", "Q70", "QX", "QX30", "QX4", "QX50", "QX55", "QX60", "QX70", "QX80"],"Jaguar": ["E-PACE", "F-PACE", "F-TYPE", "I-PACE", "S-Type", "X-Type", "XE", "XF", "XJ", "XJ-S", "XJ6", "XJ8", "XJR", "XK", "XK8", "XKR"],"Jeep": ["Cherokee", "CJ", "Comanche", "Commander", "Compass", "Gladiator", "Grand Cherokee", "Grand Commander", "Grand Wagoneer", "Jeepster", "Liberty", "Patriot", "Renegade", "Wagoneer", "Wrangler", "Wrangler 4xe"],"Kia": ["Amanti", "Borrego", "Cadenza", "Carnival", "EV6", "EV9", "Forte", "K5", "K900", "Magentis", "Niro", "Optima", "Rio", "Rondo", "Sedona", "Seltos", "Sephia", "Sorento", "Soul", "Spectra", "Spectra5", "Sportage", "Stinger", "Telluride"],"Land Rover": ["Defender", "Discovery", "Discovery Sport", "Freelander", "LR2", "LR3", "LR4", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],"Lexus": ["CT", "ES", "GS", "GX", "HS", "IS", "LC", "LFA", "LS", "LX", "NX", "RC", "RX", "RZ", "SC", "TX"],"Lincoln": ["Aviator", "Blackwood", "Continental", "Corsair", "LS", "Mark LT", "Mark VII", "Mark VIII", "MKS", "MKT", "MKX", "MKZ", "Nautilus", "Navigator", "Town Car", "Versailles", "Zephyr"],"Maserati": ["Biturbo", "Coupe", "Ghibli", "GranSport", "GranTurismo", "Grecale", "Levante", "MC20", "Quattroporte", "Spyder"],"Mazda": ["323", "626", "929", "B-Series", "CX-3", "CX-30", "CX-5", "CX-50", "CX-7", "CX-9", "CX-90", "GLC", "Mazda3", "Mazda5", "Mazda6", "Millenia", "MPV", "MX-3", "MX-5 Miata", "MX-6", "Navajo", "Protege", "Protege5", "RX-7", "RX-8", "Tribute"],"Mercedes-Benz": ["190-Class", "300-Class", "400-Class", "500-Class", "600-Class", "A-Class", "AMG GT", "B-Class", "C-Class", "CL-Class", "CLA", "CLK-Class", "CLS", "E-Class", "EQB", "EQE", "EQS", "G-Class", "GL-Class", "GLA", "GLB", "GLC", "GLE", "GLK-Class", "GLS", "M-Class", "Metris", "R-Class", "S-Class", "SL-Class", "SLK-Class", "SLR McLaren", "SLS AMG", "Sprinter"],"Mini": ["Clubman", "Convertible", "Countryman", "Hardtop"],"Mitsubishi": ["3000GT", "Cordia", "Diamante", "Eclipse", "Eclipse Cross", "Endeavor", "Expo", "Galant", "i-MiEV", "Lancer", "Mirage", "Mirage G4", "Montero", "Montero Sport", "Outlander", "Outlander PHEV", "Outlander Sport", "Precis", "Raider", "Sigma", "Starion", "Tredia"],"Nissan": ["200SX", "240SX", "280ZX", "300ZX", "350Z", "370Z", "Altima", "Ariya", "Armada", "Axxess", "Cube", "Frontier", "GT-R", "Juke", "Kicks", "Leaf", "Maxima", "Murano", "NV", "NV200", "NX", "Pathfinder", "Pulsar", "Quest", "Rogue", "Sentra", "Sentra SE-R", "Stanza", "Titan", "Titan XD", "Van", "Versa", "Xterra", "Z"],"Porsche": ["718 Boxster", "718 Cayman", "911", "912", "914", "918 Spyder", "924", "928", "944", "968", "Carrera GT", "Cayenne", "Macan", "Panamera", "Taycan"],"Ram": ["1500", "2500", "3500", "Chassis Cab", "ProMaster", "ProMaster City"],"Subaru": ["Ascent", "B9 Tribeca", "Baja", "BRZ", "Crosstrek", "DL", "Forester", "GL", "GL-10", "Impreza", "Justy", "Legacy", "Loyale", "Outback", "RX", "Solterra", "Standard", "SVX", "Tribeca", "WRX", "XT", "XT6"],"Tesla": ["Cybertruck", "Model 3", "Model S", "Model X", "Model Y", "Roadster"],"Toyota": ["4Runner", "86", "Avalon", "bZ4X", "C-HR", "Camry", "Celica", "Corona", "Corolla", "Corolla Cross", "Corolla Hatchback", "Corolla iM", "Cressida", "Crown", "Echo", "FJ Cruiser", "GR Corolla", "GR Supra", "GR86", "Grand Highlander", "Highlander", "Land Cruiser", "Matrix", "Mirai", "MR2 / MR2 Spyder", "Paseo", "Previa", "Prius", "Prius Prime", "RAV4", "RAV4 Prime", "Sequoia", "Sienna", "Solara", "Starlet", "Supra", "T100", "Tacoma", "Tercel", "Tundra", "Van", "Venza", "Yaris"],"Volkswagen": ["Arteon", "Atlas", "Atlas Cross Sport", "Beetle", "Cabrio", "CC", "Corrado", "Dasher", "Eos", "EuroVan", "Fox", "Golf", "Golf R", "GTI", "ID.4", "Jetta", "Jetta GLI", "New Beetle", "Passat", "Phaeton", "Quantum", "Rabbit", "Routan", "Scirocco", "Taos", "Thing", "Tiguan", "Touareg", "Vanagon"],"Volvo": ["240", "260", "740", "760", "780", "850", "940", "960", "C30", "C40 Recharge", "C70", "S40", "S60", "S70", "S80", "S90", "V40", "V50", "V60", "V70", "V90", "XC40", "XC60", "XC70", "XC90"],"Other": ["Other"]};
const vehicleColors = ["Beige", "Black", "Blue", "Brown", "Burgundy", "Charcoal", "Dark Blue", "Dark Green", "Gold", "Gray", "Green", "Light Blue", "Orange", "Red", "Silver", "Tan", "White", "Yellow"].sort();
const usStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].sort();
const veryGoodTraits = ["Alert & Aware", "Big Dick Energy", "Defensive Driving", "Patient with Pedestrians"];
const goodTraits = ["Allowed Merge", "Excellent Parking", "Followed Signs", "Kept Right to Pass", "Proper Speed", "Respectful Distance", "Smooth Braking", "Stopped Fully", "Used Turn Signals", "Yielded Correctly"];
const badTraits = ["Blocking Traffic", "Driving Too Slow", "Excessive Honking", "Ignoring Signs", "Improper U-Turn", "Lane Weaving", "No Turn Signals", "Poor Parking", "Rolling Stops", "Speeding", "Sudden Braking"];
const veryBadTraits = ["Aggressive Driving", "Brake Checking", "Cut Off Others", "Distracted Driving", "Road Rage", "Running Red Light", "Small Dick Energy", "Tailgating"];
const allTraits = [...new Set([...veryGoodTraits, ...goodTraits, ...badTraits, ...veryBadTraits])].sort();
const commentBuilderData = {
    templates: [
        "_____.", "_____ _____.", "_____ _____ _____.", "_____ _____ _____ _____.",
        "Ignorance of _____.", "If only I had a _____.", "If only I had a _____, then _____.",
        "_____ ahead, therefore _____.", "Could this be a _____?", "Behold, _____!",
        "Offer _____.", "Praise the _____.", "Try _____.", "Beware of _____.", "Time for _____.",
    ]
};

// --- MODAL INJECTION ---
const injectAuthModal = () => {
    const modalHtml = `
    <div id="authModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 hidden">
        <div class="bg-[var(--card-background)] text-[var(--text-primary)] rounded-lg shadow-xl w-11/12 max-w-md p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 id="authTitle" class="text-2xl font-bold">Login</h2>
                <button id="closeAuthModalBtn" class="text-2xl">&times;</button>
            </div>
            <form id="authForm" class="space-y-4">
                <div id="first-name-field-container" class="hidden">
                    <label for="first_name" class="block text-sm font-medium">First Name</label>
                    <input type="text" id="first_name" name="first_name" class="w-full mt-1 p-2 rounded-md border border-[var(--border-color)] bg-[var(--card-background)]">
                </div>
                <div>
                    <label for="username" class="block text-sm font-medium">Username</label>
                    <input type="text" id="username" name="username" required class="w-full mt-1 p-2 rounded-md border border-[var(--border-color)] bg-[var(--card-background)]">
                </div>
                <div id="email-field-container" class="hidden">
                    <label for="email" class="block text-sm font-medium">Email</label>
                    <input type="email" id="email" name="email" class="w-full mt-1 p-2 rounded-md border border-[var(--border-color)] bg-[var(--card-background)]">
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium">Password</label>
                    <input type="password" id="password" name="password" required class="w-full mt-1 p-2 rounded-md border border-[var(--border-color)] bg-[var(--card-background)]">
                </div>
                <div id="confirm-password-container" class="hidden">
                    <label for="confirmPassword" class="block text-sm font-medium">Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" class="w-full mt-1 p-2 rounded-md border border-[var(--border-color)] bg-[var(--card-background)]">
                </div>
                <div id="authMessage" class="text-center text-red-500"></div>
                <button type="submit" class="w-full bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90">Submit</button>
            </form>
            <p class="text-center text-sm mt-4">
                <span id="authPrompt">Don't have an account?</span>
                <button id="switchAuthModeBtn" class="text-[var(--primary-color)] hover:underline">Register</button>
            </p>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

const injectReviewModal = () => {
    const makeOptions = ['<option value="">Select Make</option>', ...vehicleMakes.map(make => `<option value="${make}">${make}</option>`)].join('');
    const colorOptions = ['<option value="">Select Color</option>', ...vehicleColors.map(color => `<option value="${color}">${color}</option>`)].join('');
    const stateOptions = ['<option value="">Select State</option>', ...usStates.map(state => `<option value="${state}">${state}</option>`)].join('');

    const modalHtml = `
        <div id="reviewModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 hidden">
            <div class="bg-[var(--card-background)] text-[var(--text-primary)] rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] flex flex-col">
                <div class="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
                    <h2 class="text-xl font-bold">Submit a Review</h2>
                    <button id="closeReviewModalBtn" class="text-2xl">&times;</button>
                </div>
                <div class="p-6 overflow-y-auto">
                    <form id="reviewForm">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div><label for="plate_number" class="block text-sm font-medium">Plate Number *</label><input type="text" id="plate_number" name="plate_number" required maxlength="8" class="w-full mt-1 p-2 rounded-md border border-[var(--border-color)] bg-[var(--card-background)]"></div>
                            <div><label for="incident_location" class="block text-sm font-medium">Incident State</label><select id="incident_location" name="incident_location" class="w-full mt-1 p-2 rounded-md border border-[var(--border-color)] bg-[var(--card-background)]">${stateOptions}</select></div>
                            <div><label for="vehicle_make" class="block text-sm font-medium">Make</label><select id="vehicle_make" name="vehicle_make" class="w-full mt-1 p-2 rounded-md border border-[var(--border-color)] bg-[var(--card-background)]">${makeOptions}</select></div>
                            <div><label for="vehicle_model" class="block text-sm font-medium">Model</label><select id="vehicle_model" name="vehicle_model" class="w-full mt-1 p-2 rounded-md border border-[var(--border-color)] bg-[var(--card-background)]" disabled><option value="">Select Model</option></select></div>
                            <div><label for="vehicle_color" class="block text-sm font-medium">Color</label><select id="vehicle_color" name="vehicle_color" class="w-full mt-1 p-2 rounded-md border border-[var(--border-color)] bg-[var(--card-background)]">${colorOptions}</select></div>
                        </div>
                        <div class="mb-4 text-center">
                            <h3 class="font-semibold mb-2">Overall Rating *</h3>
                            <div class="star-rating flex justify-center items-center flex-row-reverse">
                                <input type="radio" id="star5" name="rating" value="5" class="hidden" required/><label for="star5" title="5 stars" class="text-3xl cursor-pointer text-gray-300 hover:text-yellow-400">★</label>
                                <input type="radio" id="star4" name="rating" value="4" class="hidden"/><label for="star4" title="4 stars" class="text-3xl cursor-pointer text-gray-300 hover:text-yellow-400">★</label>
                                <input type="radio" id="star3" name="rating" value="3" class="hidden"/><label for="star3" title="3 stars" class="text-3xl cursor-pointer text-gray-300 hover:text-yellow-400">★</label>
                                <input type="radio" id="star2" name="rating" value="2" class="hidden"/><label for="star2" title="2 stars" class="text-3xl cursor-pointer text-gray-300 hover:text-yellow-400">★</label>
                                <input type="radio" id="star1" name="rating" value="1" class="hidden"/><label for="star1" title="1 star" class="text-3xl cursor-pointer text-gray-300 hover:text-yellow-400">★</label>
                            </div>
                        </div>
                        <div class="mb-4">
                            <h3 class="font-semibold mb-2">Select Traits</h3>
                            <div class="trait-chips flex flex-wrap gap-2 justify-center">${allTraits.map(trait => `<span class="trait-chip cursor-pointer px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800" data-value="${trait}">${trait}</span>`).join('')}</div>
                        </div>
                        <input type="hidden" id="tags" name="tags">
                        <div id="reviewFormMessage" class="mt-4 text-center text-red-500"></div>
                    </form>
                </div>
                <div class="p-4 border-t border-[var(--border-color)]">
                    <button type="submit" form="reviewForm" class="w-full bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90">Submit Review</button>
                </div>
            </div>
        </div>
        <style>
            .star-rating > input:checked ~ label,
            .star-rating:not(:checked) > label:hover,
            .star-rating:not(:checked) > label:hover ~ label {
                color: #facc15; /* yellow-400 */
            }
            .trait-chip.active {
                background-color: var(--primary-color);
                color: white;
            }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

const injectDetailModal = () => {
    const modalHtml = `
    <div id="reviewDetailModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden">
        <div class="bg-[var(--card-background)] text-[var(--text-primary)] rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
                <h2 id="detailPlateNumber" class="text-2xl font-bold"></h2>
                <button id="closeDetailModalBtn" class="text-2xl">&times;</button>
            </div>
            <div id="detailModalBody" class="p-6 overflow-y-auto">
                <!-- Content will be injected here -->
            </div>
            <div class="p-4 border-t border-[var(--border-color)] flex justify-between items-center">
                <button id="prevReviewBtn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50" disabled>Previous</button>
                <span id="detailReviewCount"></span>
                <button id="nextReviewBtn" class="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md disabled:opacity-50" disabled>Next</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

// --- AUTH LOGIC ---
const updateAuthUI = () => {
    const header = document.querySelector('header');
    const userActionsContainer = header.querySelector('.flex.items-center.gap-4 .flex.gap-2');

    if (authToken && currentUsername) {
        userActionsContainer.innerHTML = `
            <p class="text-sm font-medium">Welcome, ${currentUsername}</p>
            <button id="logoutBtn" class="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md border border-[var(--border-color)] bg-[var(--card-background)] px-4 text-sm font-bold text-[var(--text-primary)] shadow-sm transition-all hover:bg-gray-100">
                <span class="truncate">Log Out</span>
            </button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    } else {
        userActionsContainer.innerHTML = `
            <button id="signUpBtn" class="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md bg-[var(--primary-color)] px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-opacity-90">
                <span class="truncate">Sign Up</span>
            </button>
            <button id="logInBtn" class="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md border border-[var(--border-color)] bg-[var(--card-background)] px-4 text-sm font-bold text-[var(--text-primary)] shadow-sm transition-all hover:bg-gray-100">
                <span class="truncate">Log In</span>
            </button>
        `;
        document.getElementById('signUpBtn').addEventListener('click', () => {
            if (isAuthModalInLoginMode) switchAuthMode();
            document.getElementById('authModal').classList.remove('hidden');
        });
        document.getElementById('logInBtn').addEventListener('click', () => {
            if (!isAuthModalInLoginMode) switchAuthMode();
            document.getElementById('authModal').classList.remove('hidden');
        });
    }
};

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    authToken = null;
    currentUsername = null;
    updateAuthUI();
};

const switchAuthMode = () => {
    isAuthModalInLoginMode = !isAuthModalInLoginMode;
    const authModal = document.getElementById('authModal');
    const authTitle = authModal.querySelector('#authTitle');
    const authPrompt = authModal.querySelector('#authPrompt');
    const switchBtn = authModal.querySelector('#switchAuthModeBtn');
    const firstNameField = authModal.querySelector('#first-name-field-container');
    const emailField = authModal.querySelector('#email-field-container');
    const confirmPassField = authModal.querySelector('#confirm-password-container');

    if (isAuthModalInLoginMode) {
        authTitle.textContent = 'Login';
        authPrompt.textContent = "Don't have an account?";
        switchBtn.textContent = 'Register';
        firstNameField.classList.add('hidden');
        emailField.classList.add('hidden');
        confirmPassField.classList.add('hidden');
    } else {
        authTitle.textContent = 'Register';
        authPrompt.textContent = 'Already have an account?';
        switchBtn.textContent = 'Login';
        firstNameField.classList.remove('hidden');
        emailField.classList.remove('hidden');
        confirmPassField.classList.remove('hidden');
    }
    authModal.querySelector('#authMessage').textContent = '';
    authModal.querySelector('#authForm').reset();
};

// --- RENDER FUNCTIONS ---
const renderStructuredComment = (commentData) => {
    try {
        const parsedComment = typeof commentData === 'string' ? JSON.parse(commentData) : commentData;

        if (!parsedComment || !Array.isArray(parsedComment.words) || parsedComment.words.length === 0) {
            return "No comment provided.";
        }

        const template = commentBuilderData.templates[parsedComment.template];

        if (!template) {
            return parsedComment.words.map(word => `<strong>${word}</strong>`).join(' ');
        }

        let message = template;
        parsedComment.words.forEach(word => {
            message = message.replace('_____', `<strong>${word}</strong>`);
        });

        return message;
    } catch (e) {
        return commentData || "No comment provided.";
    }
};

const renderReviews = (plates) => {
    const reviewsContainer = document.querySelector('.lg\\:col-span-2.space-y-8');
    if (!reviewsContainer) { return; }
    reviewsContainer.innerHTML = '';

    const platesToRender = Object.values(plates);

    if (platesToRender.length === 0) {
        reviewsContainer.innerHTML = '<p class="text-lg text-[var(--text-secondary)]">No reviews found.</p>';
        return;
    }

    platesToRender.forEach(plate => {
        const reviewCard = document.createElement('div');
        reviewCard.setAttribute('data-plate-number', plate.plate_number);
        reviewCard.className = 'rounded-lg border border-[var(--border-color)] bg-[var(--card-background)] p-6 shadow-sm cursor-pointer hover:shadow-lg transition-shadow';

        const firstReview = plate.allReviews[0];
        const commentHtml = firstReview.comment ? renderStructuredComment(firstReview.comment).replace(/<[^>]*>/g, '') : 'No comment';
        const vehicleTitle = firstReview.vehicle_make || 'Unknown Make';

        const ratingStars = Array(5).fill(0).map((_, i) => `
            <svg class="h-5 w-5 ${i < plate.averageRating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
        `).join('');

        reviewCard.innerHTML = `
            <div class="flex items-start gap-4">
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-semibold text-2xl text-[var(--text-primary)]">${plate.plate_number.toUpperCase()}</p>
                            <p class="text-sm text-[var(--text-secondary)]">${vehicleTitle}</p>
                        </div>
                        <div class="flex items-center gap-1">
                            ${ratingStars}
                            <span class="font-bold text-[var(--text-primary)]">${plate.averageRating.toFixed(1)}</span>
                        </div>
                    </div>
                    <p class="mt-4 text-[var(--text-secondary)] italic">"${commentHtml.substring(0, 80)}..."</p>
                    <p class="text-xs text-right mt-2 text-[var(--text-secondary)]">${plate.reviewCount} review(s)</p>
                </div>
            </div>
        `;
        reviewCard.addEventListener('click', () => showReviewDetail(plate.plate_number));
        reviewsContainer.appendChild(reviewCard);
    });
};

const renderTopContributors = (reviews) => {
    const contributorsContainer = document.querySelector('aside .rounded-lg:nth-child(2) ul');
    if (!contributorsContainer) { return; }

    const contributorCounts = reviews.reduce((acc, review) => {
        const username = review.user_id || 'Anonymous';
        if (username !== 'Anonymous') {
            acc[username] = (acc[username] || 0) + 1;
        }
        return acc;
    }, {});

    const sortedContributors = Object.entries(contributorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    contributorsContainer.innerHTML = '';

    if (sortedContributors.length === 0) {
        contributorsContainer.innerHTML = '<p class="text-sm text-[var(--text-secondary)]">No contributors yet.</p>';
        return;
    }

    sortedContributors.forEach(([username, count]) => {
        const contributorItem = document.createElement('li');
        contributorItem.className = 'flex items-center gap-4';
        contributorItem.innerHTML = `
            <img alt="${username}" class="h-10 w-10 rounded-full object-cover" src="https://ui-avatars.com/api/?name=${username}&background=random" />
            <div>
                <p class="font-semibold text-[var(--text-primary)]">${username}</p>
                <p class="text-sm text-[var(--text-secondary)]">${count} Reviews</p>
            </div>
        `;
        contributorsContainer.appendChild(contributorItem);
    });
};

// --- DETAIL MODAL LOGIC ---
const showReviewDetail = (plateNumber) => {
    currentPlateReviews = aggregatedReviews[plateNumber.toUpperCase()].allReviews;
    currentReviewIndex = 0;
    updateReviewDetailModalContent();
    document.getElementById('reviewDetailModal').classList.remove('hidden');
};

const updateReviewDetailModalContent = () => {
    const modal = document.getElementById('reviewDetailModal');
    if (!modal || currentPlateReviews.length === 0) return;

    const review = currentPlateReviews[currentReviewIndex];

    modal.querySelector('#detailPlateNumber').textContent = review.plate_number.toUpperCase();
    modal.querySelector('#detailReviewCount').textContent = `Review ${currentReviewIndex + 1} of ${currentPlateReviews.length}`;

    const ratingStars = Array(5).fill(0).map((_, i) => `
        <svg class="h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
    `).join('');

    const body = modal.querySelector('#detailModalBody');
    body.innerHTML = `
        <div class="flex items-start gap-4">
            <img alt="${review.user_id || 'Anonymous'}" class="h-12 w-12 rounded-full object-cover" src="https://ui-avatars.com/api/?name=${review.user_id || 'A'}&background=random" />
            <div class="flex-1">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-semibold text-[var(--text-primary)]">${review.user_id || 'Anonymous'}</p>
                        <p class="text-sm text-[var(--text-secondary)]">${new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div class="flex items-center gap-1">${ratingStars}</div>
                </div>
                <p class="mt-4 text-[var(--text-secondary)]">${review.comment ? renderStructuredComment(review.comment) : 'No comment provided.'}</p>
                <div class="mt-4 flex items-center gap-6 text-[var(--text-secondary)]">
                    <button class="flex items-center gap-2 transition-colors hover:text-green-500">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21H9V11l3.329-3.329a1 1 0 011.414 0l.353.353a1 1 0 010 1.414L14 10zM5 11v10H4a1 1 0 01-1-1v-8a1 1 0 011-1h1z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                        <span>${review.upvotes}</span>
                    </button>
                    <button class="flex items-center gap-2 transition-colors hover:text-red-500">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3H15v10l-3.329 3.329a1 1 0 01-1.414 0l-.353-.353a1 1 0 010-1.414L10 14zm10-3v10h1a1 1 0 001-1v-8a1 1 0 00-1-1h-1z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                        <span>${review.downvotes}</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.querySelector('#prevReviewBtn').disabled = currentReviewIndex === 0;
    modal.querySelector('#nextReviewBtn').disabled = currentReviewIndex >= currentPlateReviews.length - 1;
};


// --- API & DATA FETCHING ---
const fetchAndRenderData = async () => {
    try {
        const response = await fetch(`${API_URL}/reviews`);
        if (!response.ok) {
            console.error('Failed to fetch reviews');
            return;
        }
        allReviews = await response.json();

        aggregatedReviews = {};
        allReviews.forEach(review => {
            const plate = review.plate_number.toUpperCase();
            if (!aggregatedReviews[plate]) {
                aggregatedReviews[plate] = { plate_number: plate, totalRating: 0, reviewCount: 0, averageRating: 0, allReviews: [] };
            }
            aggregatedReviews[plate].totalRating += review.rating;
            aggregatedReviews[plate].reviewCount++;
            aggregatedReviews[plate].averageRating = aggregatedReviews[plate].totalRating / aggregatedReviews[plate].reviewCount;
            aggregatedReviews[plate].allReviews.push(review);
        });

        renderReviews(aggregatedReviews);
        renderTopContributors(allReviews);
    } catch (error) {
        console.error('An error occurred while fetching data:', error);
    }
};

const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredPlates = {};
    for (const plate in aggregatedReviews) {
        if (plate.toLowerCase().includes(searchTerm)) {
            filteredPlates[plate] = aggregatedReviews[plate];
        }
    }
    renderReviews(filteredPlates);
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    injectAuthModal();
    injectReviewModal();
    injectDetailModal();

    updateAuthUI();
    fetchAndRenderData();

    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) { searchInput.addEventListener('input', handleSearch); }

    document.getElementById('closeAuthModalBtn').addEventListener('click', () => document.getElementById('authModal').classList.add('hidden'));
    document.getElementById('switchAuthModeBtn').addEventListener('click', switchAuthMode);
    document.getElementById('authForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const authMessage = document.getElementById('authMessage');
        authMessage.textContent = 'Processing...';
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (!isAuthModalInLoginMode && data.password !== data.confirmPassword) {
            authMessage.textContent = 'Passwords do not match.';
            return;
        }

        const endpoint = isAuthModalInLoginMode ? '/users/login' : '/users/register';
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) {
                authMessage.textContent = result.message || result.details || 'An error occurred.';
                return;
            }

            if (isAuthModalInLoginMode) {
                localStorage.setItem('token', result.accessToken);
                localStorage.setItem('username', result.username);
                authToken = result.accessToken;
                currentUsername = result.username;
                authMessage.textContent = 'Login successful!';
                setTimeout(() => {
                    document.getElementById('authModal').classList.add('hidden');
                    updateAuthUI();
                }, 1000);
            } else {
                authMessage.textContent = 'Registration successful! Please log in.';
                switchAuthMode();
            }
        } catch (error) {
            authMessage.textContent = 'A network error occurred.';
        }
    });

    const reviewModal = document.getElementById('reviewModal');
    document.getElementById('closeReviewModalBtn').addEventListener('click', () => reviewModal.classList.add('hidden'));
    document.querySelector('aside button.mt-4').addEventListener('click', () => {
        if(authToken) { reviewModal.classList.remove('hidden'); }
        else { document.getElementById('authModal').classList.remove('hidden'); }
    });

    const reviewForm = document.getElementById('reviewForm');
    reviewForm.querySelector('#vehicle_make').addEventListener('change', (e) => {
        const models = vehicleModels[e.target.value] || [];
        const modelSelect = reviewForm.querySelector('#vehicle_model');
        modelSelect.innerHTML = '<option value="">Select Model</option>' + models.map(m => `<option value="${m}">${m}</option>`).join('');
        modelSelect.disabled = models.length === 0;
    });

    const traitChipsContainer = reviewModal.querySelector('.trait-chips');
    traitChipsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('trait-chip')) {
            e.target.classList.toggle('active');
            const selectedTraits = Array.from(traitChipsContainer.querySelectorAll('.trait-chip.active')).map(c => c.dataset.value);
            reviewForm.querySelector('#tags').value = selectedTraits.join(', ');
        }
    });

    reviewForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        const formMessage = document.getElementById('reviewFormMessage');
        formMessage.textContent = 'Submitting...';
        const formData = new FormData(reviewForm);
        const data = Object.fromEntries(formData.entries());
        data.comment = null;

        if (!data.plate_number || !data.rating) {
            formMessage.textContent = 'Plate number and rating are required.';
            formMessage.style.color = 'red';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const result = await response.json();
                formMessage.textContent = result.details || 'Failed to submit review.';
                formMessage.style.color = 'red';
                return;
            }
            formMessage.textContent = 'Review submitted successfully!';
            formMessage.style.color = 'green';
            setTimeout(() => {
                reviewModal.classList.add('hidden');
                formMessage.textContent = '';
                reviewForm.reset();
                traitChipsContainer.querySelectorAll('.trait-chip.active').forEach(c => c.classList.remove('active'));
                fetchAndRenderData();
            }, 1500);
        } catch (error) {
            formMessage.textContent = 'A network error occurred.';
            formMessage.style.color = 'red';
        }
    });

    const detailModal = document.getElementById('reviewDetailModal');
    detailModal.querySelector('#closeDetailModalBtn').addEventListener('click', () => detailModal.classList.add('hidden'));
    detailModal.querySelector('#prevReviewBtn').addEventListener('click', () => {
        if (currentReviewIndex > 0) {
            currentReviewIndex--;
            updateReviewDetailModalContent();
        }
    });
    detailModal.querySelector('#nextReviewBtn').addEventListener('click', () => {
        if (currentReviewIndex < currentPlateReviews.length - 1) {
            currentReviewIndex++;
            updateReviewDetailModalContent();
        }
    });
});
