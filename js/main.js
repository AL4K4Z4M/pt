// =================================================================================
// PlateTraits - main.js
// Description: Core client-side logic for the PlateTraits application.
// This script handles API interactions, DOM manipulation, state management,
// and event handling for the user interface.
// =================================================================================

// --- 1. Global Variables & Constants ---

const API_URL = 'https://platetraits.com/api';

// State variables
let allReviewsData = [];
let aggregatedReviewsData = {};
let currentPlateReviews = [];
let currentReviewIndex = 0;
let userVotes = {}; // Holds the user's vote for each review_id: { [review_id]: 'up' | 'down' }
let lastViewedProfile = null; // To store the username for the "Back to Profile" button functionality

// Authentication state
let authToken = localStorage.getItem('token');
let currentUsername = localStorage.getItem('username');
let isAuthModalInLoginMode = true;

// --- 2. Data Definitions ---
// Static data for form dropdowns, comment construction, and content validation.

const commentBuilderData = {
    templates: [
        "_____.", "_____ _____.", "_____ _____ _____.", "_____ _____ _____ _____.",
        "Ignorance of _____.", "If only I had a _____.", "If only I had a _____, then _____.",
        "_____ ahead, therefore _____.", "Could this be a _____?", "Behold, _____!",
        "Offer _____.", "Praise the _____.", "Try _____.", "Beware of _____.", "Time for _____.",
        "_____ required ahead.", "No _____ here, move along.", "Watch for _____ ahead.",
        "Do not trust _____.", "Unexpected _____ incoming.", "Approach _____ with caution.",
        "Prepare for _____.", "Caution: _____ zone.", "Look out for _____.", "Expect _____ ahead.",
        "Proceed with _____.", "_____ detected, slow down.", "Immediate _____ recommended.",
        "_____ spotted nearby.", "Engage _____ mode.", "_____ is inevitable.", "May the _____ guide you.",
        "You must gather your _____ before venturing forth.", "Visions of _____...", "_____ awaits.",
        "_____, but _____.", "First _____, then _____.", "Look _____, O, look _____.", "Why is it always _____?"
    ],
    words: {
        people_archetypes: ["college kid", "cyclist", "driver", "fool", "hero", "impatient driver", "legend", "lost driver", "pedestrian", "police", "road rager", "slowpoke", "speeder", "student driver", "tailgater", "texter", "tourist", "villain"],
        vehicles: ["beater", "bus", "car", "convertible", "delivery truck", "farm equipment", "garbage truck", "mail truck", "motorcycle", "RV", "semi", "sports car", "SUV", "tractor", "truck"],
        road_features: ["blind spot", "construction", "crosswalk", "deer crossing", "detour", "dirt road", "exit ramp", "fire hydrant", "four-way stop", "gridlock", "merge lane", "oncoming lane", "one-lane bridge", "parking spot", "passing zone", "pothole", "railroad crossing", "road work", "roundabout", "school zone", "sharp curve", "speed bump", "speed trap", "steep hill", "traffic jam"],
        maneuvers_actions: ["accelerating", "braking", "changing lanes", "coasting", "decelerating", "drifting", "merging", "parallel parking", "parking", "passing", "perfect park", "signaling", "slowing down", "speeding", "speeding up", "three-point turn", "turning", "U-turn", "yielding"],
        driver_errors: ["bad parking", "blocking the lane", "brake checking", "cutting off", "distracted driving", "double parking", "erratic steering", "following too closely", "hesitation", "honking", "ignoring signs", "ignoring speed limit", "late braking", "no lights", "road rage", "rolling stop", "running a red light", "tailgating", "wide turn"],
        concepts_states: ["agony", "caution", "confusion", "despair", "doom", "faith", "focus", "frustration", "grace", "haste", "joy", "patience", "relief", "ruin", "skill", "urgency"],
        qualities_adjectives: ["aggressive", "cautious", "courteous", "erratic", "fast", "flawless", "good", "hesitant", "illegal", "inconsiderate", "lawful", "oblivious", "predictable", "questionable", "reckless", "skillful", "sloppy", "slow", "smooth", "steady", "sudden", "terrible", "unexpected", "unlawful", "unpredictable"],
        directions: ["adjacent", "ahead", "behind", "everywhere", "far", "left", "near", "oncoming", "right"],
        phrases: ["breaking the speed limit", "burning rubber", "close call", "dead end", "failure to yield", "fender bender", "heavy traffic", "last minute turn", "left lane camper", "moment of silence", "right-of-way", "sudden stop", "test of patience", "wrong turn"],
        conjunctions: ["all the more", "and", "and then", "but", "eventually", "except for", "if only", "in short", "in the end", "or", "therefore"],
        items_gestures: ["a head nod", "a shrug", "a wave", "angry stare", "brake lights", "hand gestures", "hazard lights", "headlights", "high beams", "horn", "middle finger", "thumbs-up", "turn signal"],
        modes_stances: ["autopilot", "beast mode", "cruise control", "defensive driving", "offensive driving", "stealth mode", "turtle mode", "zen mode"],
        guidance: ["common sense", "GPS", "intuition", "local knowledge", "muscle memory", "road signs", "streetlights", "the dotted line", "the North Star"]
    }
};

const vehicleMakes = ["Acura", "Alfa Romeo", "Aprilia", "Audi", "BMW", "Buell", "Buick", "Cadillac", "Can-Am", "Chevrolet", "Chrysler", "Dodge", "Ducati", "Fiat", "Ford", "Freightliner", "Genesis", "GMC", "Harley-Davidson", "Hino", "Honda", "Hummer", "Husqvarna", "Hyundai", "Indian", "Infiniti", "International", "Isuzu", "Jaguar", "Jeep", "Kawasaki", "Kenworth", "Kia", "KTM", "Land Rover", "Lexus", "Lincoln", "Lucid", "Mack", "Maserati", "Mazda", "Mercedes-Benz", "Mercury", "Mini", "Mitsubishi", "Mitsubishi Fuso", "Moto Guzzi", "MV Agusta", "Nissan", "Norton", "Peterbilt", "Piaggio", "Polestar", "Pontiac", "Porsche", "Ram", "Rivian", "Royal Enfield", "Saab", "Saturn", "Scion", "Subaru", "Suzuki", "Tesla", "Toyota", "Triumph", "Vespa", "Volkswagen", "Volvo", "Yamaha", "Zero Motorcycles", "Other"].sort();
const vehicleModels = {"Acura":["ILX","Integra","MDX","NSX","RDX","RL","RLX","TLX","ZDX"],"Alfa Romeo":["Giulia","Stelvio","Tonale"],"Aprilia":["RS 660","RSV4","Tuareg 660","Tuono"],"Audi":["A3","A4","A5","A6","A7","A8","e-tron","e-tron GT","Q3","Q4 e-tron","Q5","Q7","Q8","R8","RS 3","RS 5","RS 6","RS 7","S3","S4","S5","TT"],"BMW":["2 Series","3 Series","4 Series","5 Series","7 Series","8 Series","i4","i7","iX","M2","M3","M4","M5","M8","R 1250 GS","S 1000 RR","X1","X2","X3","X4","X5","X6","X7","Z4"],"Buell":["Firebolt","Lightning","Ulysses"],"Buick":["Cascada","Century","Enclave","Encore","Encore GX","Envision","LaCrosse","LeSabre","Lucerne","Park Avenue","Rainier","Regal","Rendezvous","Verano"],"Cadillac":["ATS","Celestiq","CT4","CT5","CT6","CTS","DeVille","DTS","Escalade","Lyriq","Seville","STS","XLR","XT4","XT5","XT6"],"Can-Am":["Defender","Maverick","Ryker","Spyder"],"Chevrolet":["Astro","Avalanche","Aveo","Beretta","Blazer","Blazer EV","Bolt EUV","Bolt EV","Camaro","Caprice","Captiva Sport","Cavalier","Celebrity","Chevelle","Chevy II / Nova","City Express","Cobalt","Colorado","Corsica","Corvette","Cruze","El Camino","Equinox","Equinox EV","Express","HHR","Impala","Low Cab Forward","Lumina","Malibu","Metro","Monte Carlo","Prizm","S-10","Silverado 1500","Silverado 2500HD","Silverado 3500HD","Silverado 4500HD","Silverado 5500HD","Silverado 6500HD","Silverado EV","Sonic","Spark","SSR","Suburban","Tahoe","Tracker","TrailBlazer","Traverse","Trax","Uplander","Venture","Volt"],"Chrysler":["200","300","Aspen","Concorde","Crossfire","Grand Voyager","Imperial","LHS","New Yorker","Pacifica","PT Cruiser","Sebring","Town & Country","Voyager"],"Dodge":["Attitude","Avenger","Caliber","Caravan","Challenger","Challenger SRT Demon / 170","Challenger SRT Hellcat","Charger","Charger Daytona","Charger SRT Hellcat","Dakota","Dart","Durango","Durango SRT / Hellcat","Grand Caravan","Hornet","Intrepid","Journey","Magnum","Neon / SRT-4","Nitro","Ram Van / B-series","Spirit","Stealth","Stratus","Viper"],"Ducati":["Diavel","Hypermotard","Monster","Multistrada","Panigale","Scrambler","Streetfighter"],"Fiat":["124 Spider","500","500L","500X"],"Ford":["Aerostar","Aspire","Bronco","Bronco Sport","C-Max","Contour","Crown Victoria","E-Series","E-Transit","EcoSport","Edge","Escape","Escort","Excursion","Expedition","Explorer","F-150","F-150 Lightning","F-250 Super Duty","F-350 Super Duty","F-450 Super Duty","F-550 Super Duty","F-650","F-750","Festiva","Fiesta","Five Hundred","Flex","Focus","Freestar","Freestyle","Fusion","GT","Maverick","Mustang","Mustang Mach-E","Probe","Ranger","Taurus","Taurus X","Thunderbird","Transit","Transit Connect","Windstar"],"Freightliner":["108SD","114SD","122SD","Cascadia","Columbia","Coronado","EconicSD","M2 106","M2 112"],"Genesis":["G70","G80","G90","GV60","GV70","GV80"],"GMC":["Acadia","Canyon","Envoy","Hummer EV","Jimmy","Safari","Savana","Sierra 1500","Sierra 2500HD","Sierra 3500HD","Sierra 4500HD","Sierra 5500HD","Sierra 6500HD","Sonoma","Syclone","Terrain","TopKick","Typhoon","Yukon","Yukon XL"],"Harley-Davidson":["CVO","LiveWire","Pan America","Road Glide","Softail","Sportster","Street Glide","Trike"],"Hino":["155","195","238","258","268","338","L Series","M Series","XL Series"],"Honda":["Accord","Accord Hybrid","Africa Twin","CBR Series","Civic","Civic Si","Civic Type R","Clarity","CR-V","CR-V Hybrid","CR-Z","CRF Series","CRX","Del Sol","Element","Fit","Gold Wing","Grom","HR-V","Insight","Odyssey","Passport","Pilot","Prelude","Prologue","Ridgeline","S2000","Shadow"],"Hummer":["H1","H2","H3"],"Husqvarna":["FC 450","Norden 901","Svartpilen","Vitpilen"],"Hyundai":["Accent","Azera","Elantra","Entourage","Equus","Genesis","Genesis Coupe","Ioniq 5","Ioniq 6","Kona","Nexo","Palisade","Santa Cruz","Santa Fe","Sonata","Tiburon","Tucson","Veloster","Venue","Veracruz"],"Indian":["Challenger","Chieftain","Chief","FTR","Scout","Springfield"],"Infiniti":["EX","FX","G20","G35","G37","I30","I35","JX","M","Q40","Q50","Q60","Q70","QX30","QX4","QX50","QX55","QX60","QX70","QX80"],"International":["CV Series","DuraStar","HV Series","HX Series","LoneStar","LT Series","MV Series","ProStar","RH Series","WorkStar"],"Isuzu":["Ascender","Axiom","D-Max","F-Series","Hombre","i-Series","N-Series","Oasis","Rodeo","Stylus","Trooper"],"Jaguar":["E-PACE","F-PACE","F-TYPE","I-PACE","S-Type","X-Type","XE","XF","XJ","XK"],"Jeep":["Cherokee","Commander","Compass","Gladiator","Grand Cherokee","Grand Wagoneer","Liberty","Patriot","Renegade","Wagoneer","Wrangler","Wrangler 4xe"],"Kawasaki":["Concours","KLR650","Ninja","Versys","Vulcan","Z Series"],"Kenworth":["C500","K270","K370","T280","T380","T480","T680","T800","T880","W900","W990"],"Kia":["Amanti","Borrego","Cadenza","Carnival","EV6","EV9","Forte","K5","K900","Niro","Optima","Rio","Rondo","Sedona","Seltos","Sephia","Sorento","Soul","Spectra","Sportage","Stinger","Telluride"],"KTM":["Adventure Series","Duke Series","EXC-F Series","RC Series"],"Land Rover":["Defender","Discovery","Discovery Sport","Freelander","LR2","LR3","LR4","Range Rover","Range Rover Evoque","Range Rover Sport","Range Rover Velar"],"Lexus":["CT","ES","GS","GX","HS","IS","LC","LFA","LS","LX","NX","RC","RX","RZ","SC","TX"],"Lincoln":["Aviator","Blackwood","Continental","Corsair","LS","Mark LT","Mark VIII","MKS","MKT","MKX","MKZ","Nautilus","Navigator","Town Car","Zephyr"],"Lucid":["Air"],"Mack":["Anthem","Granite","LR","MD Series","Pinnacle","TerraPro"],"Maserati":["Ghibli","GranTurismo","Grecale","Levante","MC20","Quattroporte"],"Mazda":["2","3","5","6","626","CX-3","CX-30","CX-5","CX-50","CX-7","CX-9","CX-90","Mazda3","Mazda5","Mazda6","Millenia","MPV","MX-3","MX-5 Miata","MX-6","Protege","RX-7","RX-8","Tribute"],"Mercedes-Benz":["A-Class","AMG GT","B-Class","C-Class","CL-Class","CLA","CLK-Class","CLS","E-Class","eSprinter","EQB","EQE","EQS","G-Class","GL-Class","GLA","GLB","GLC","GLE","GLK-Class","GLS","M-Class","Metris","R-Class","S-Class","SL-Class","SLK-Class","Sprinter"],"Mercury":["Capri","Cougar","Grand Marquis","Marauder","Mariner","Milan","Montego","Mountaineer","Mystique","Sable","Topaz","Tracer","Villager"],"Mini":["Clubman","Convertible","Countryman","Hardtop"],"Mitsubishi":["3000GT","Diamante","Eclipse","Eclipse Cross","Endeavor","Galant","i-MiEV","Lancer","Mirage","Mirage G4","Montero","Montero Sport","Outlander","Outlander PHEV","Outlander Sport","Raider"],"Mitsubishi Fuso":["Canter","eCanter","FA/FI Series","FE/FG Series"],"Moto Guzzi":["V100 Mandello","V7","V85 TT","V9"],"MV Agusta":["Brutale","Dragster","F3","Turismo Veloce"],"Nissan":["200SX","240SX","300ZX","350Z","370Z","Altima","Ariya","Armada","Cube","Frontier","GT-R","Juke","Kicks","Leaf","Maxima","Murano","NV","NV200","Pathfinder","Pulsar","Quest","Rogue","Sentra","Stanza","Titan","Titan XD","Versa","Xterra","Z"],"Norton":["Commando 961","V4SV"],"Peterbilt":["220","325","330","337","348","365","367","389","520","536","537","548","567","579","589"],"Piaggio":["Beverly","Liberty","MP3"],"Polestar":["Polestar 1","Polestar 2","Polestar 3"],"Pontiac":["6000","Aztek","Bonneville","Fiero","Firebird","G3","G5","G6","G8","Grand Am","Grand Prix","GTO","LeMans","Montana","Solstice","Sunbird","Sunfire","Torrent","Trans Sport","Vibe"],"Porsche":["718 Boxster","718 Cayman","911","928","944","Carrera GT","Cayenne","Macan","Panamera","Taycan"],"Ram":["1500","2500","3500","4500","5500","Chassis Cab","ProMaster","ProMaster City"],"Rivian":["R1S","R1T"],"Royal Enfield":["Classic 350","Continental GT","Himalayan","Interceptor 650"],"Saab":["9-2X","9-3","9-4X","9-5","9-7X","900","9000"],"Saturn":["Astra","Aura","Ion","L-Series","Outlook","Relay","S-Series","Sky","Vue"],"Scion":["FR-S","iA","iM","iQ","tC","xA","xB","xD"],"Subaru":["Ascent","B9 Tribeca","Baja","BRZ","Crosstrek","Forester","Impreza","Justy","Legacy","Loyale","Outback","Solterra","SVX","Tribeca","WRX","XT"],"Suzuki":["Aerio","DR-Z400S","Equator","Esteem","Forenza","Grand Vitara","GSX-R Series","Hayabusa","Katana","Kizashi","Reno","Samurai","Sidekick","SV650","Swift","SX4","V-Strom","Verona","Vitara","X-90","XL7"],"Tesla":["Cybertruck","Model 3","Model S","Model X","Model Y","Roadster","Semi"],"Toyota":["4Runner","86","Avalon","bZ4X","C-HR","Camry","Celica","Corolla","Corolla Cross","Corolla Hatchback","Corolla iM","Cressida","Crown","Echo","FJ Cruiser","GR Corolla","GR Supra","GR86","Grand Highlander","Highlander","Land Cruiser","Matrix","Mirai","MR2 / MR2 Spyder","Paseo","Previa","Prius","Prius Prime","RAV4","RAV4 Prime","Sequoia","Sienna","Solara","Supra","T100","Tacoma","Tercel","Tundra","Venza","Yaris"],"Triumph":["Bonneville","Rocket 3","Scrambler","Speed Triple","Street Triple","Tiger","Trident"],"Vespa":["GTS","Primavera","Sprint"],"Volkswagen":["Arteon","Atlas","Atlas Cross Sport","Beetle","Cabrio","CC","Corrado","Eos","Fox","Golf","Golf R","GTI","ID.4","Jetta","Jetta GLI","New Beetle","Passat","Phaeton","Rabbit","Routan","Taos","Tiguan","Touareg","Vanagon"],"Volvo":["C30","C40 Recharge","C70","S40","S60","S70","S80","S90","V40","V50","V60","V70","V90","VHD","VNL","VNR","XC40","XC60","XC70","XC90"],"Yamaha":["Bolt","MT Series","Super Ténéré","Tracer 9","TW200","VMAX","V Star","XSR Series","YZF-R Series","Zuma"],"Zero Motorcycles":["DSR/X","FXE","SR/F","SR/S"],"Other":["Other"]};
const vehicleType = {"Sedan":"Car","Coupe":"Car","Hatchback":"Car","Convertible":"Car","Wagon":"Car","Sports Car":"Car","SUV":"SUV","Minivan":"Van","Cargo Van":"Van","Pickup Truck":"Truck","Commercial Truck":"Truck","Sport Bike":"Motorcycle","Cruiser":"Motorcycle","Touring Bike":"Motorcycle","Adventure Bike":"Motorcycle","Dual-Sport":"Motorcycle","Standard Motorcycle":"Motorcycle","Three-Wheeled Motorcycle":"Motorcycle","Scooter":"Motorcycle","Motocross/Off-road":"Motorcycle","UTV/Side-by-Side":"Other","Other":"Other"};
const vehicleSubtype = {"Acura":{"ILX":"Sedan","Integra":"Sedan","MDX":"SUV","NSX":"Sports Car","RDX":"SUV","RL":"Sedan","RLX":"Sedan","TLX":"Sedan","ZDX":"SUV"},"Alfa Romeo":{"Giulia":"Sedan","Stelvio":"SUV","Tonale":"SUV"},"Aprilia":{"RS 660":"Sport Bike","RSV4":"Sport Bike","Tuareg 660":"Adventure Bike","Tuono":"Sport Bike"},"Audi":{"A3":"Sedan","A4":"Sedan","A5":"Coupe","A6":"Sedan","A7":"Sedan","A8":"Sedan","e-tron":"SUV","e-tron GT":"Sedan","Q3":"SUV","Q4 e-tron":"SUV","Q5":"SUV","Q7":"SUV","Q8":"SUV","R8":"Sports Car","RS 3":"Sedan","RS 5":"Coupe","RS 6":"Wagon","RS 7":"Sedan","S3":"Sedan","S4":"Sedan","S5":"Coupe","TT":"Coupe"},"BMW":{"2 Series":"Coupe","3 Series":"Sedan","4 Series":"Coupe","5 Series":"Sedan","7 Series":"Sedan","8 Series":"Coupe","i4":"Sedan","i7":"Sedan","iX":"SUV","M2":"Coupe","M3":"Sedan","M4":"Coupe","M5":"Sedan","M8":"Coupe","R 1250 GS":"Adventure Bike","S 1000 RR":"Sport Bike","X1":"SUV","X2":"SUV","X3":"SUV","X4":"SUV","X5":"SUV","X6":"SUV","X7":"SUV","Z4":"Convertible"},"Buell":{"Firebolt":"Sport Bike","Lightning":"Standard Motorcycle","Ulysses":"Adventure Bike"},"Buick":{"Cascada":"Convertible","Century":"Sedan","Enclave":"SUV","Encore":"SUV","Encore GX":"SUV","Envision":"SUV","LaCrosse":"Sedan","LeSabre":"Sedan","Lucerne":"Sedan","Park Avenue":"Sedan","Rainier":"SUV","Regal":"Sedan","Rendezvous":"SUV","Verano":"Sedan"},"Cadillac":{"ATS":"Sedan","Celestiq":"Sedan","CT4":"Sedan","CT5":"Sedan","CT6":"Sedan","CTS":"Sedan","DeVille":"Sedan","DTS":"Sedan","Escalade":"SUV","Lyriq":"SUV","Seville":"Sedan","STS":"Sedan","XLR":"Convertible","XT4":"SUV","XT5":"SUV","XT6":"SUV"},"Can-Am":{"Defender":"UTV/Side-by-Side","Maverick":"UTV/Side-by-Side","Ryker":"Three-Wheeled Motorcycle","Spyder":"Three-Wheeled Motorcycle"},"Chevrolet":{"Astro":"Minivan","Avalanche":"Pickup Truck","Aveo":"Sedan","Beretta":"Coupe","Blazer":"SUV","Blazer EV":"SUV","Bolt EUV":"SUV","Bolt EV":"Hatchback","Camaro":"Coupe","Caprice":"Sedan","Captiva Sport":"SUV","Cavalier":"Sedan","Celebrity":"Sedan","Chevelle":"Coupe","Chevy II / Nova":"Sedan","City Express":"Cargo Van","Cobalt":"Sedan","Colorado":"Pickup Truck","Corsica":"Sedan","Corvette":"Sports Car","Cruze":"Sedan","El Camino":"Pickup Truck","Equinox":"SUV","Equinox EV":"SUV","Express":"Cargo Van","HHR":"Wagon","Impala":"Sedan","Low Cab Forward":"Commercial Truck","Lumina":"Sedan","Malibu":"Sedan","Metro":"Hatchback","Monte Carlo":"Coupe","Prizm":"Sedan","S-10":"Pickup Truck","Silverado 1500":"Pickup Truck","Silverado 2500HD":"Pickup Truck","Silverado 3500HD":"Pickup Truck","Silverado 4500HD":"Commercial Truck","Silverado 5500HD":"Commercial Truck","Silverado 6500HD":"Commercial Truck","Silverado EV":"Pickup Truck","Sonic":"Sedan","Spark":"Hatchback","SSR":"Pickup Truck","Suburban":"SUV","Tahoe":"SUV","Tracker":"SUV","TrailBlazer":"SUV","Traverse":"SUV","Trax":"SUV","Uplander":"Minivan","Venture":"Minivan","Volt":"Sedan"},"Chrysler":{"200":"Sedan","300":"Sedan","Aspen":"SUV","Concorde":"Sedan","Crossfire":"Coupe","Grand Voyager":"Minivan","Imperial":"Sedan","LHS":"Sedan","New Yorker":"Sedan","Pacifica":"Minivan","PT Cruiser":"Wagon","Sebring":"Sedan","Town & Country":"Minivan","Voyager":"Minivan"},"Dodge":{"Attitude":"Sedan","Avenger":"Sedan","Caliber":"Hatchback","Caravan":"Minivan","Challenger":"Coupe","Challenger SRT Demon / 170":"Coupe","Challenger SRT Hellcat":"Coupe","Charger":"Sedan","Charger Daytona":"Sedan","Charger SRT Hellcat":"Sedan","Dakota":"Pickup Truck","Dart":"Sedan","Durango":"SUV","Durango SRT / Hellcat":"SUV","Grand Caravan":"Minivan","Hornet":"SUV","Intrepid":"Sedan","Journey":"SUV","Magnum":"Wagon","Neon / SRT-4":"Sedan","Nitro":"SUV","Ram Van / B-series":"Cargo Van","Spirit":"Sedan","Stealth":"Coupe","Stratus":"Sedan","Viper":"Sports Car"},"Ducati":{"Diavel":"Cruiser","Hypermotard":"Standard Motorcycle","Monster":"Standard Motorcycle","Multistrada":"Adventure Bike","Panigale":"Sport Bike","Scrambler":"Standard Motorcycle","Streetfighter":"Standard Motorcycle"},"Fiat":{"124 Spider":"Convertible","500":"Hatchback","500L":"Wagon","500X":"SUV"},"Ford":{"Aerostar":"Minivan","Aspire":"Hatchback","Bronco":"SUV","Bronco Sport":"SUV","C-Max":"Wagon","Contour":"Sedan","Crown Victoria":"Sedan","E-Series":"Cargo Van","E-Transit":"Cargo Van","EcoSport":"SUV","Edge":"SUV","Escape":"SUV","Escort":"Sedan","Excursion":"SUV","Expedition":"SUV","Explorer":"SUV","F-150":"Pickup Truck","F-150 Lightning":"Pickup Truck","F-250 Super Duty":"Pickup Truck","F-350 Super Duty":"Pickup Truck","F-450 Super Duty":"Pickup Truck","F-550 Super Duty":"Commercial Truck","F-650":"Commercial Truck","F-750":"Commercial Truck","Festiva":"Hatchback","Fiesta":"Hatchback","Five Hundred":"Sedan","Flex":"SUV","Focus":"Sedan","Freestar":"Minivan","Freestyle":"SUV","Fusion":"Sedan","GT":"Sports Car","Maverick":"Pickup Truck","Mustang":"Coupe","Mustang Mach-E":"SUV","Probe":"Coupe","Ranger":"Pickup Truck","Taurus":"Sedan","Taurus X":"SUV","Thunderbird":"Convertible","Transit":"Cargo Van","Transit Connect":"Cargo Van","Windstar":"Minivan"},"Freightliner":{"108SD":"Commercial Truck","114SD":"Commercial Truck","122SD":"Commercial Truck","Cascadia":"Commercial Truck","Columbia":"Commercial Truck","Coronado":"Commercial Truck","EconicSD":"Commercial Truck","M2 106":"Commercial Truck","M2 112":"Commercial Truck"},"Genesis":{"G70":"Sedan","G80":"Sedan","G90":"Sedan","GV60":"SUV","GV70":"SUV","GV80":"SUV"},"GMC":{"Acadia":"SUV","Canyon":"Pickup Truck","Envoy":"SUV","Hummer EV":"Pickup Truck","Jimmy":"SUV","Safari":"Minivan","Savana":"Cargo Van","Sierra 1500":"Pickup Truck","Sierra 2500HD":"Pickup Truck","Sierra 3500HD":"Pickup Truck","Sierra 4500HD":"Commercial Truck","Sierra 5500HD":"Commercial Truck","Sierra 6500HD":"Commercial Truck","Sonoma":"Pickup Truck","Syclone":"Pickup Truck","Terrain":"SUV","TopKick":"Commercial Truck","Typhoon":"SUV","Yukon":"SUV","Yukon XL":"SUV"},"Harley-Davidson":{"CVO":"Touring Bike","LiveWire":"Standard Motorcycle","Pan America":"Adventure Bike","Road Glide":"Touring Bike","Softail":"Cruiser","Sportster":"Cruiser","Street Glide":"Touring Bike","Trike":"Three-Wheeled Motorcycle"},"Hino":{"155":"Commercial Truck","195":"Commercial Truck","238":"Commercial Truck","258":"Commercial Truck","268":"Commercial Truck","338":"Commercial Truck","L Series":"Commercial Truck","M Series":"Commercial Truck","XL Series":"Commercial Truck"},"Honda":{"Accord":"Sedan","Accord Hybrid":"Sedan","Africa Twin":"Adventure Bike","CBR Series":"Sport Bike","Civic":"Sedan","Civic Si":"Sedan","Civic Type R":"Hatchback","Clarity":"Sedan","CR-V":"SUV","CR-V Hybrid":"SUV","CR-Z":"Hatchback","CRF Series":"Dual-Sport","CRX":"Hatchback","Del Sol":"Convertible","Element":"SUV","Fit":"Hatchback","Gold Wing":"Touring Bike","Grom":"Standard Motorcycle","HR-V":"SUV","Insight":"Sedan","Odyssey":"Minivan","Passport":"SUV","Pilot":"SUV","Prelude":"Coupe","Prologue":"SUV","Ridgeline":"Pickup Truck","S2000":"Convertible","Shadow":"Cruiser"},"Hummer":{"H1":"SUV","H2":"SUV","H3":"SUV"},"Husqvarna":{"FC 450":"Motocross/Off-road","Norden 901":"Adventure Bike","Svartpilen":"Standard Motorcycle","Vitpilen":"Standard Motorcycle"},"Hyundai":{"Accent":"Sedan","Azera":"Sedan","Elantra":"Sedan","Entourage":"Minivan","Equus":"Sedan","Genesis":"Sedan","Genesis Coupe":"Coupe","Ioniq 5":"SUV","Ioniq 6":"Sedan","Kona":"SUV","Nexo":"SUV","Palisade":"SUV","Santa Cruz":"Pickup Truck","Santa Fe":"SUV","Sonata":"Sedan","Tiburon":"Coupe","Tucson":"SUV","Veloster":"Hatchback","Venue":"SUV","Veracruz":"SUV"},"Indian":{"Challenger":"Touring Bike","Chieftain":"Touring Bike","Chief":"Cruiser","FTR":"Standard Motorcycle","Scout":"Cruiser","Springfield":"Touring Bike"},"Infiniti":{"EX":"SUV","FX":"SUV","G20":"Sedan","G35":"Sedan","G37":"Coupe","I30":"Sedan","I35":"Sedan","JX":"SUV","M":"Sedan","Q40":"Sedan","Q50":"Sedan","Q60":"Coupe","Q70":"Sedan","QX30":"SUV","QX4":"SUV","QX50":"SUV","QX55":"SUV","QX60":"SUV","QX70":"SUV","QX80":"SUV"},"International":{"CV Series":"Commercial Truck","DuraStar":"Commercial Truck","HV Series":"Commercial Truck","HX Series":"Commercial Truck","LoneStar":"Commercial Truck","LT Series":"Commercial Truck","MV Series":"Commercial Truck","ProStar":"Commercial Truck","RH Series":"Commercial Truck","WorkStar":"Commercial Truck"},"Isuzu":{"Ascender":"SUV","Axiom":"SUV","D-Max":"Pickup Truck","F-Series":"Commercial Truck","Hombre":"Pickup Truck","i-Series":"Pickup Truck","N-Series":"Commercial Truck","Oasis":"Minivan","Rodeo":"SUV","Stylus":"Sedan","Trooper":"SUV"},"Jaguar":{"E-PACE":"SUV","F-PACE":"SUV","F-TYPE":"Sports Car","I-PACE":"SUV","S-Type":"Sedan","X-Type":"Sedan","XE":"Sedan","XF":"Sedan","XJ":"Sedan","XK":"Coupe"},"Jeep":{"Cherokee":"SUV","Commander":"SUV","Compass":"SUV","Gladiator":"Pickup Truck","Grand Cherokee":"SUV","Grand Wagoneer":"SUV","Liberty":"SUV","Patriot":"SUV","Renegade":"SUV","Wagoneer":"SUV","Wrangler":"SUV","Wrangler 4xe":"SUV"},"Kawasaki":{"Concours":"Touring Bike","KLR650":"Dual-Sport","Ninja":"Sport Bike","Versys":"Adventure Bike","Vulcan":"Cruiser","Z Series":"Standard Motorcycle"},"Kenworth":{"C500":"Commercial Truck","K270":"Commercial Truck","K370":"Commercial Truck","T280":"Commercial Truck","T380":"Commercial Truck","T480":"Commercial Truck","T680":"Commercial Truck","T800":"Commercial Truck","T880":"Commercial Truck","W900":"Commercial Truck","W990":"Commercial Truck"},"Kia":{"Amanti":"Sedan","Borrego":"SUV","Cadenza":"Sedan","Carnival":"Minivan","EV6":"SUV","EV9":"SUV","Forte":"Sedan","K5":"Sedan","K900":"Sedan","Niro":"SUV","Optima":"Sedan","Rio":"Sedan","Rondo":"Wagon","Sedona":"Minivan","Seltos":"SUV","Sephia":"Sedan","Sorento":"SUV","Soul":"Wagon","Spectra":"Sedan","Sportage":"SUV","Stinger":"Sedan","Telluride":"SUV"},"KTM":{"Adventure Series":"Adventure Bike","Duke Series":"Standard Motorcycle","EXC-F Series":"Dual-Sport","RC Series":"Sport Bike"},"Land Rover":{"Defender":"SUV","Discovery":"SUV","Discovery Sport":"SUV","Freelander":"SUV","LR2":"SUV","LR3":"SUV","LR4":"SUV","Range Rover":"SUV","Range Rover Evoque":"SUV","Range Rover Sport":"SUV","Range Rover Velar":"SUV"},"Lexus":{"CT":"Hatchback","ES":"Sedan","GS":"Sedan","GX":"SUV","HS":"Sedan","IS":"Sedan","LC":"Coupe","LFA":"Sports Car","LS":"Sedan","LX":"SUV","NX":"SUV","RC":"Coupe","RX":"SUV","RZ":"SUV","SC":"Convertible","TX":"SUV"},"Lincoln":{"Aviator":"SUV","Blackwood":"Pickup Truck","Continental":"Sedan","Corsair":"SUV","LS":"Sedan","Mark LT":"Pickup Truck","Mark VIII":"Coupe","MKS":"Sedan","MKT":"SUV","MKX":"SUV","MKZ":"Sedan","Nautilus":"SUV","Navigator":"SUV","Town Car":"Sedan","Zephyr":"Sedan"},"Lucid":{"Air":"Sedan"},"Mack":{"Anthem":"Commercial Truck","Granite":"Commercial Truck","LR":"Commercial Truck","MD Series":"Commercial Truck","Pinnacle":"Commercial Truck","TerraPro":"Commercial Truck"},"Maserati":{"Ghibli":"Sedan","GranTurismo":"Coupe","Grecale":"SUV","Levante":"SUV","MC20":"Sports Car","Quattroporte":"Sedan"},"Mazda":{"2":"Hatchback","3":"Sedan","5":"Minivan","6":"Sedan","626":"Sedan","CX-3":"SUV","CX-30":"SUV","CX-5":"SUV","CX-50":"SUV","CX-7":"SUV","CX-9":"SUV","CX-90":"SUV","Mazda3":"Sedan","Mazda5":"Minivan","Mazda6":"Sedan","Millenia":"Sedan","MPV":"Minivan","MX-3":"Coupe","MX-5 Miata":"Convertible","MX-6":"Coupe","Protege":"Sedan","RX-7":"Sports Car","RX-8":"Coupe","Tribute":"SUV"},"Mercedes-Benz":{"A-Class":"Sedan","AMG GT":"Sports Car","B-Class":"Hatchback","C-Class":"Sedan","CL-Class":"Coupe","CLA":"Sedan","CLK-Class":"Coupe","CLS":"Sedan","E-Class":"Sedan","eSprinter":"Cargo Van","EQB":"SUV","EQE":"Sedan","EQS":"Sedan","G-Class":"SUV","GL-Class":"SUV","GLA":"SUV","GLB":"SUV","GLC":"SUV","GLE":"SUV","GLK-Class":"SUV","GLS":"SUV","M-Class":"SUV","Metris":"Cargo Van","R-Class":"Minivan","S-Class":"Sedan","SL-Class":"Convertible","SLK-Class":"Convertible","Sprinter":"Cargo Van"},"Mercury":{"Capri":"Convertible","Cougar":"Coupe","Grand Marquis":"Sedan","Marauder":"Sedan","Mariner":"SUV","Milan":"Sedan","Montego":"Sedan","Mountaineer":"SUV","Mystique":"Sedan","Sable":"Sedan","Topaz":"Sedan","Tracer":"Sedan","Villager":"Minivan"},"Mini":{"Clubman":"Wagon","Convertible":"Convertible","Countryman":"SUV","Hardtop":"Hatchback"},"Mitsubishi":{"3000GT":"Sports Car","Diamante":"Sedan","Eclipse":"Coupe","Eclipse Cross":"SUV","Endeavor":"SUV","Galant":"Sedan","i-MiEV":"Hatchback","Lancer":"Sedan","Mirage":"Hatchback","Mirage G4":"Sedan","Montero":"SUV","Montero Sport":"SUV","Outlander":"SUV","Outlander PHEV":"SUV","Outlander Sport":"SUV","Raider":"Pickup Truck"},"Mitsubishi Fuso":{"Canter":"Commercial Truck","eCanter":"Commercial Truck","FA/FI Series":"Commercial Truck","FE/FG Series":"Commercial Truck"},"Moto Guzzi":{"V100 Mandello":"Touring Bike","V7":"Standard Motorcycle","V85 TT":"Adventure Bike","V9":"Cruiser"},"MV Agusta":{"Brutale":"Standard Motorcycle","Dragster":"Standard Motorcycle","F3":"Sport Bike","Turismo Veloce":"Touring Bike"},"Nissan":{"200SX":"Coupe","240SX":"Coupe","300ZX":"Sports Car","350Z":"Sports Car","370Z":"Sports Car","Altima":"Sedan","Ariya":"SUV","Armada":"SUV","Cube":"Wagon","Frontier":"Pickup Truck","GT-R":"Sports Car","Juke":"SUV","Kicks":"SUV","Leaf":"Hatchback","Maxima":"Sedan","Murano":"SUV","NV":"Cargo Van","NV200":"Cargo Van","Pathfinder":"SUV","Pulsar":"Hatchback","Quest":"Minivan","Rogue":"SUV","Sentra":"Sedan","Stanza":"Sedan","Titan":"Pickup Truck","Titan XD":"Pickup Truck","Versa":"Sedan","Xterra":"SUV","Z":"Sports Car"},"Norton":{"Commando 961":"Standard Motorcycle","V4SV":"Sport Bike"},"Peterbilt":{"220":"Commercial Truck","325":"Commercial Truck","330":"Commercial Truck","337":"Commercial Truck","348":"Commercial Truck","365":"Commercial Truck","367":"Commercial Truck","389":"Commercial Truck","520":"Commercial Truck","536":"Commercial Truck","537":"Commercial Truck","548":"Commercial Truck","567":"Commercial Truck","579":"Commercial Truck","589":"Commercial Truck"},"Piaggio":{"Beverly":"Scooter","Liberty":"Scooter","MP3":"Scooter"},"Polestar":{"Polestar 1":"Coupe","Polestar 2":"Sedan","Polestar 3":"SUV"},"Pontiac":{"6000":"Sedan","Aztek":"SUV","Bonneville":"Sedan","Fiero":"Sports Car","Firebird":"Coupe","G3":"Hatchback","G5":"Coupe","G6":"Sedan","G8":"Sedan","Grand Am":"Sedan","Grand Prix":"Sedan","GTO":"Coupe","LeMans":"Hatchback","Montana":"Minivan","Solstice":"Convertible","Sunbird":"Sedan","Sunfire":"Sedan","Torrent":"SUV","Trans Sport":"Minivan","Vibe":"Wagon"},"Porsche":{"718 Boxster":"Convertible","718 Cayman":"Coupe","911":"Sports Car","928":"Sports Car","944":"Sports Car","Carrera GT":"Sports Car","Cayenne":"SUV","Macan":"SUV","Panamera":"Sedan","Taycan":"Sedan"},"Ram":{"1500":"Pickup Truck","2500":"Pickup Truck","3500":"Pickup Truck","4500":"Commercial Truck","5500":"Commercial Truck","Chassis Cab":"Commercial Truck","ProMaster":"Cargo Van","ProMaster City":"Cargo Van"},"Rivian":{"R1S":"SUV","R1T":"Pickup Truck"},"Royal Enfield":{"Classic 350":"Standard Motorcycle","Continental GT":"Standard Motorcycle","Himalayan":"Adventure Bike","Interceptor 650":"Standard Motorcycle"},"Saab":{"9-2X":"Wagon","9-3":"Sedan","9-4X":"SUV","9-5":"Sedan","9-7X":"SUV","900":"Sedan","9000":"Sedan"},"Saturn":{"Astra":"Hatchback","Aura":"Sedan","Ion":"Sedan","L-Series":"Sedan","Outlook":"SUV","Relay":"Minivan","S-Series":"Sedan","Sky":"Convertible","Vue":"SUV"},"Scion":{"FR-S":"Coupe","iA":"Sedan","iM":"Hatchback","iQ":"Hatchback","tC":"Coupe","xA":"Hatchback","xB":"Wagon","xD":"Hatchback"},"Subaru":{"Ascent":"SUV","B9 Tribeca":"SUV","Baja":"Pickup Truck","BRZ":"Coupe","Crosstrek":"SUV","Forester":"SUV","Impreza":"Sedan","Justy":"Hatchback","Legacy":"Sedan","Loyale":"Wagon","Outback":"Wagon","Solterra":"SUV","SVX":"Coupe","Tribeca":"SUV","WRX":"Sedan","XT":"Coupe"},"Suzuki":{"Aerio":"Sedan","DR-Z400S":"Dual-Sport","Equator":"Pickup Truck","Esteem":"Sedan","Forenza":"Sedan","Grand Vitara":"SUV","GSX-R Series":"Sport Bike","Hayabusa":"Sport Bike","Katana":"Sport Bike","Kizashi":"Sedan","Reno":"Hatchback","Samurai":"SUV","Sidekick":"SUV","SV650":"Standard Motorcycle","Swift":"Hatchback","SX4":"Hatchback","V-Strom":"Adventure Bike","Verona":"Sedan","Vitara":"SUV","X-90":"SUV","XL7":"SUV"},"Tesla":{"Cybertruck":"Pickup Truck","Model 3":"Sedan","Model S":"Sedan","Model X":"SUV","Model Y":"SUV","Roadster":"Sports Car","Semi":"Commercial Truck"},"Toyota":{"4Runner":"SUV","86":"Coupe","Avalon":"Sedan","bZ4X":"SUV","C-HR":"SUV","Camry":"Sedan","Celica":"Coupe","Corolla":"Sedan","Corolla Cross":"SUV","Corolla Hatchback":"Hatchback","Corolla iM":"Hatchback","Cressida":"Sedan","Crown":"Sedan","Echo":"Sedan","FJ Cruiser":"SUV","GR Corolla":"Hatchback","GR Supra":"Sports Car","GR86":"Coupe","Grand Highlander":"SUV","Highlander":"SUV","Land Cruiser":"SUV","Matrix":"Wagon","Mirai":"Sedan","MR2 / MR2 Spyder":"Sports Car","Paseo":"Coupe","Previa":"Minivan","Prius":"Hatchback","Prius Prime":"Hatchback","RAV4":"SUV","RAV4 Prime":"SUV","Sequoia":"SUV","Sienna":"Minivan","Solara":"Coupe","Supra":"Sports Car","T100":"Pickup Truck","Tacoma":"Pickup Truck","Tercel":"Sedan","Tundra":"Pickup Truck","Venza":"SUV","Yaris":"Hatchback"},"Triumph":{"Bonneville":"Standard Motorcycle","Rocket 3":"Cruiser","Scrambler":"Standard Motorcycle","Speed Triple":"Standard Motorcycle","Street Triple":"Standard Motorcycle","Tiger":"Adventure Bike","Trident":"Standard Motorcycle"},"Vespa":{"GTS":"Scooter","Primavera":"Scooter","Sprint":"Scooter"},"Volkswagen":{"Arteon":"Sedan","Atlas":"SUV","Atlas Cross Sport":"SUV","Beetle":"Hatchback","Cabrio":"Convertible","CC":"Sedan","Corrado":"Coupe","Eos":"Convertible","Fox":"Sedan","Golf":"Hatchback","Golf R":"Hatchback","GTI":"Hatchback","ID.4":"SUV","Jetta":"Sedan","Jetta GLI":"Sedan","New Beetle":"Hatchback","Passat":"Sedan","Phaeton":"Sedan","Rabbit":"Hatchback","Routan":"Minivan","Taos":"SUV","Tiguan":"SUV","Touareg":"SUV","Vanagon":"Minivan"},"Volvo":{"C30":"Hatchback","C40 Recharge":"SUV","C70":"Convertible","S40":"Sedan","S60":"Sedan","S70":"Sedan","S80":"Sedan","S90":"Sedan","V40":"Wagon","V50":"Wagon","V60":"Wagon","V70":"Wagon","V90":"Wagon","VHD":"Commercial Truck","VNL":"Commercial Truck","VNR":"Commercial Truck","XC40":"SUV","XC60":"SUV","XC70":"Wagon","XC90":"SUV"},"Yamaha":{"Bolt":"Cruiser","MT Series":"Standard Motorcycle","Super Ténéré":"Adventure Bike","Tracer 9":"Touring Bike","TW200":"Dual-Sport","VMAX":"Cruiser","V Star":"Cruiser","XSR Series":"Standard Motorcycle","YZF-R Series":"Sport Bike","Zuma":"Scooter"},"Zero Motorcycles":{"DSR/X":"Adventure Bike","FXE":"Standard Motorcycle","SR/F":"Standard Motorcycle","SR/S":"Sport Bike"},"Other":{"Other":"Other"}};
const vehicleColors = ["Beige", "Black", "Blue", "Brown", "Burgundy", "Charcoal", "Dark Blue", "Dark Green", "Gold", "Gray", "Green", "Light Blue", "Orange", "Red", "Silver", "Tan", "White", "Yellow"].sort();
const usStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].sort();
const positiveTraits = ["Used Turn Signals", "Proper Speed", "Yielded Correctly", "Allowed Merge", "Smooth Braking", "Excellent Parking", "Stopped Fully", "Respectful Distance", "Followed Signs", "Big Dick Energy"];

// Text normalization and profanity filtering
const normalizeText = (text) => text.toLowerCase().replace(/@/g,'a').replace(/0/g,'o').replace(/1/g,'i').replace(/3/g,'e').replace(/4/g,'a').replace(/5/g,'s').replace(/7/g,'t').replace(/8/g,'b').replace(/9/g,'g').replace(/\$/g,'s').replace(/!/g,'i').replace(/\|/g,'l').replace(/\+/g,'t').replace(/\(/g,'c').replace(/</g,'c').replace(/\./g,'').replace(/,/g,'').replace(/_/g,'').replace(/-/g,'').replace(/\s/g,'').replace(/c/g,'k').replace(/ph/g,'f').replace(/ck/g,'k').replace(/x/g,'ks').replace(/z/g,'s').replace(/uu/g,'u').replace(/ee/g,'e').replace(/oo/g,'o').replace(/y/g,'i').replace(/ie/g,'i').replace(/ss/g,'s').replace(/zz/g,'z').replace(/ll/g,'l').replace(/rr/g,'r');
const forbiddenWords = ['fuck','fuk','fck','fcuk','fuxk','phuck','phuk','shit','shyt','sht','sh1t','sh!t','asshole','azzhole','asshol','azzhol','ass','azz','bitch','btch','b!tch','b1tch','bich','b!ch','cunt','kunt','cnt','c_nt','dick','dik','d!ck','d1ck','pussy','pssy','pussi','puzsy','pusy','nigger','nigga','nigg','nig','n!gger','n1gger','niga','n!ga','faggot','fagot','fag','f@g','f@ggot','retard','rtrd','ret@rd','r3tard','tard','whore','hor','wh0re','whor3','anal','an@l','arse','ar$e','bastard','basstard','bollocks','bollox','boner','clit','cl!t','cock','kok','kock','damn','dam','douche','douch','dyke','dike','felch','gook','handjob','hj','jizz','j!zz','kike','lesbo','lezbo','masturbate','masturb8','motherfucker','mf','mthrfckr','pedo','p3do','penis','pen!s','porn','prn','rape','r@pe','scrotum','slut','slutt','sl_t','smegma','sperm','tits','titt','t!ts','twat','tw@t','vagina','vag!na','wank','w@nk','wetback','nazi','naz!','n@zi','heil','h3il','hitler','h!tler','kkk','whitepower','whtpowr','whitepwr','supremacy','suprem@cy','islamist','jihadist','j!hadist','terrorist','terr0rist','communist','socialist','fascist','anarchist','antifa','zionist','racist','r@cist','sexist','s3xist','homophobe','homophob','transphobe','transphob','bigot','feminazi','mra','incel','sjw','pc','politicallycorrect','wokeism','cancelculture','triggered','triggred','safespace','microaggression','mansplain','manspread','whitesplaining','privilege','toxic','fragile','cis','hetero','cisgender','heteronormative','patriarchy','misogyny','misandry','bomb','bom','b0mb','kill','k!ll','k1ll','murder','murd3r','gang','g@ng','mafia','m@fia','crip','cr!p','blood','bl00d','terror','terr0r','explode','expl0de','shoot','sh00t','stab','st@b','gun','gn','knife','kn!fe','assault','ass@ult','execution','electricchair','gaschamber','lethalinjection','firingsquad','guillotine','lynch','hang','burn','brn','acid','ac!d','poison','p0ison','torture','t0rture','mutilate','mut!late','dismember','decapitate','drug','drg','coke','cok','heroin','her0in','meth','m3th','weed','w33d','we3d','drunk','drnk','dui','pot','high','stoned','alcoholic','junkie','junky','crackhead','stolen','st0len','illegal','ill3gal','contraband','smuggle','bribe','corrupt','criminal','felon','convict','prisoner','jail','prison','cop','police','pol!ce','pig','acab','idiot','id!ot','moron','m0ron','dumb','dum','stupid','stup!d','loser','l0ser','failure','useless','worthless','ugly','ugli','fat','f@t','skinny','short','tall','bald','hairy','smelly','dirty','gross','disgusting','filthy','nasty','sick','disease','cancer','aids','hiv','covid','c0vid','virus','v!rus','plague','epidemic','quarantine','mask','vaccine','v@ccine','jab','antivax','ant!vax','sheeple','normie','npc','boomer','zoomer','millennial','genz','okboomer','karen','chad','stacy','becky','brad','thot','simp','incel','virgin','cuck','soyboy','69','420','sex','s3x','s_x','naked','nak3d','nude','nud3','cult','sect','conspiracy','qanon','plandemic','hoax','fake','false','liar','cheat','fraud','scam','rip-off','ripoff','master','dom','sub','bdsm','fetish','kink','hentai','lolicon','shotacon','necrophilia','suicide','suic!de','selfharm','selfh@rm','cutting','cutt!ng','starve','anorexia','bulimia','proana','promia','thinspo'].map(word => normalizeText(word)).sort();


// --- 3. DOM Manipulation & Rendering ---

/**
 * Injects the 'Add Review' modal HTML into the DOM.
 * This is done dynamically to keep the initial HTML file cleaner.
 */
const injectReviewModal = () => {
    const makeOptions = ['<option value="">Select Make</option>', ...vehicleMakes.map(make => `<option value="${make}">${make}</option>`)].join('');
    const colorOptions = ['<option value="">Select Color</option>', ...vehicleColors.map(color => `<option value="${color}">${color}</option>`)].join('');
    const stateOptions = ['<option value="">Select State</option>', ...usStates.map(state => `<option value="${state}">${state}</option>`)].join('');
    
    const templateOptions = commentBuilderData.templates.map((template, index) => `<option value="${index}" ${index === 0 ? 'selected' : ''}>${template}</option>`).join('');

    const modalHtml = `
        <div id="reviewModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden">
            <div class="bg-dark-secondary text-light-primary rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div class="flex justify-between items-center p-4 border-b border-dark">
                    <h2 class="text-xl font-bold font-license-plate">Submit a Review</h2>
                    <button id="closeModalBtn" class="text-light-secondary text-2xl hover:text-white">&times;</button>
                </div>
                <div class="p-6 overflow-y-auto no-scrollbar">
                    <form id="reviewForm">
                        <div class="bg-dark-tertiary p-4 rounded-lg mb-6">
                            <h3 class="font-semibold mb-3 text-light-primary">License Plate Details</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label for="plate_number" class="text-sm font-medium text-light-secondary">Plate Number *</label><input type="text" id="plate_number" name="plate_number" required maxlength="8" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary placeholder-light-tertiary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500"></div>
                                <div><label for="vehicle_make" class="text-sm font-medium text-light-secondary">Make</label><select id="vehicle_make" name="vehicle_make" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500">${makeOptions}</select></div>
                                <div><label for="vehicle_model" class="text-sm font-medium text-light-secondary">Model</label><select id="vehicle_model" name="vehicle_model" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500" disabled><option value="">Select Model</option></select></div>
                                <div><label for="vehicle_color" class="text-sm font-medium text-light-secondary">Color</label><select id="vehicle_color" name="vehicle_color" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500">${colorOptions}</select></div>
                                <div class="col-span-2"><label for="incident_location" class="text-sm font-medium text-light-secondary">Incident State</label><select id="incident_location" name="incident_location" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500">${stateOptions}</select></div>
                            </div>
                        </div>
                        <div class="mb-6 text-center">
                            <h3 class="font-semibold mb-2 text-light-primary">Overall Rating *</h3>
                            <div class="modal-star-rating">
                                <input type="radio" id="star5" name="rating" value="5" required/><label for="star5" title="5 stars" class="text-light-tertiary">★</label>
                                <input type="radio" id="star4" name="rating" value="4"/><label for="star4" title="4 stars" class="text-light-tertiary">★</label>
                                <input type="radio" id="star3" name="rating" value="3"/><label for="star3" title="3 stars" class="text-light-tertiary">★</label>
                                <input type="radio" id="star2" name="rating" value="2"/><label for="star2" title="2 stars" class="text-light-tertiary">★</label>
                                <input type="radio" id="star1" name="rating" value="1"/><label for="star1" title="1 star" class="text-light-tertiary">★</label>
                            </div>
                        <div class="bg-dark-tertiary p-4 rounded-lg mb-6">
                            <div class="flex justify-between items-center mb-3">
                                <h3 class="font-semibold text-light-primary">Construct a Comment</h3>
                                <div class="flex items-center">
                                    <input type="checkbox" id="no-comment-checkbox" class="h-4 w-4 rounded border-dark bg-dark-tertiary text-blue-600 focus:ring-blue-500">
                                    <label for="no-comment-checkbox" class="ml-2 block text-sm text-light-secondary">No Comment</label>
                                </div>
                            </div>
                            <div id="comment-builder-body" class="space-y-3">
                                <div>
                                    <label for="comment-template" class="text-sm font-medium text-light-secondary">Template</label>
                                    <select id="comment-template" name="comment_template" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500">${templateOptions}</select>
                                </div>
                                <div id="comment-words-container" class="space-y-3"></div>
                            </div>
                        </div>
                        
                        <div class="mb-6">
                            <h3 class="font-semibold mb-2 text-light-primary">Select Traits</h3>
                            <div class="flex flex-wrap gap-2">
                                <span class="trait-chip positive" data-value="Used Turn Signals">Used Turn Signals</span>
                                <span class="trait-chip positive" data-value="Proper Speed">Proper Speed</span>
                                <span class="trait-chip positive" data-value="Yielded Correctly">Yielded Correctly</span>
                                <span class="trait-chip positive" data-value="Allowed Merge">Allowed Merge</span>
                                <span class="trait-chip positive" data-value="Smooth Braking">Smooth Braking</span>
                                <span class="trait-chip positive" data-value="Excellent Parking">Excellent Parking</span>
                                <span class="trait-chip positive" data-value="Stopped Fully">Stopped Fully</span>
                                <span class="trait-chip positive" data-value="Big Dick Energy">Big Dick Energy</span>
                                <span class="trait-chip positive" data-value="Respectful Distance">Respectful Distance</span>
                                <span class="trait-chip positive" data-value="Followed Signs">Followed Signs</span>
                                <span class="trait-chip negative" data-value="No Turn Signals">No Turn Signals</span>
                                <span class="trait-chip negative" data-value="Speeding">Speeding</span>
                                <span class="trait-chip negative" data-value="Tailgating">Tailgating</span>
                                <span class="trait-chip negative" data-value="Small Dick Energy">Small Dick Energy</span>
                                <span class="trait-chip negative" data-value="Cut Off Others">Cut Off Others</span>
                                <span class="trait-chip negative" data-value="Sudden Braking">Sudden Braking</span>
                                <span class="trait-chip negative" data-value="Poor Parking">Poor Parking</span>
                                <span class="trait-chip negative" data-value="Rolling Stops">Rolling Stops</span>
                                <span class="trait-chip negative" data-value="Distracted Driving">Distracted Driving</span>
                                <span class="trait-chip negative" data-value="Ignoring Signs">Ignoring Signs</span>
                                <span class="trait-chip negative" data-value="Lane Weaving">Lane Weaving</span>
                                <span class="trait-chip negative" data-value="Blocking Traffic">Blocking Traffic</span>
                            </div>
                        </div>
                        <input type="hidden" id="tags" name="tags">
                        <div id="formMessage" class="mt-4 text-center"></div>
                    </form>
                </div>
                <div class="p-4 bg-dark-tertiary border-t border-dark rounded-b-2xl">
                    <button type="submit" form="reviewForm" class="w-full bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">Submit Review</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

/**
 * Renders a structured comment from JSON data into a readable HTML string.
 * @param {string|object} commentData - The comment data, either as a JSON string or an object.
 * @returns {string} The formatted HTML string for the comment.
 */
const renderStructuredComment = (commentData) => {
    try {
        const parsedComment = typeof commentData === 'string' ? JSON.parse(commentData) : commentData;
        
        if (!parsedComment || !Array.isArray(parsedComment.words) || parsedComment.words.length === 0) {
            return "No comment provided.";
        }

        const template = commentBuilderData.templates[parsedComment.template];
        
        if (!template) {
            // Fallback for old comments or data mismatch
            return parsedComment.words.map(word => `<strong class="text-blue-600 font-semibold">${word}</strong>`).join(' ');
        }

        let message = template;
        parsedComment.words.forEach(word => {
            message = message.replace('_____', `<strong class="text-blue-600 font-semibold">${word}</strong>`);
        });
        
        return message;
    } catch (e) {
        // Fallback for non-JSON comments
        return commentData || "No comment provided.";
    }
};

/**
 * Updates the content of the review detail modal with a specific review's data.
 * @param {object} review - The review object to display.
 */
const updateReviewDetailModalContent = (review) => {
    // Plate and vehicle info
    const plateImage = document.getElementById('detailPlateImage');
    plateImage.src = API_URL.replace('/api', '') + '/images/blankplate.png';
    document.getElementById('detailPlateNumberOverlay').textContent = review.plate_number.toUpperCase();
    document.getElementById('detailVehicleMake').textContent = review.vehicle_make || 'N/A';
    document.getElementById('detailVehicleModel').textContent = review.vehicle_model || 'N/A';
    document.getElementById('detailVehicleColor').textContent = review.vehicle_color || 'N/A';
    document.getElementById('detailComment').innerHTML = renderStructuredComment(review.comment);
    let subtype = 'N/A';
    if (review.vehicle_make && review.vehicle_model) {
        subtype = vehicleSubtype[review.vehicle_make]?.[review.vehicle_model] || 'N/A';
    }
    document.getElementById('detailVehicleType').textContent = subtype;

    // Reviewer info with profile link
    const detailUserIdSpan = document.getElementById('detailUserId');
    const username = review.user_id || 'Anonymous';
    detailUserIdSpan.innerHTML = ''; 
    if (username !== 'Anonymous') {
        const userProfileButton = document.createElement('button');
        userProfileButton.className = 'text-blue-400 hover:underline font-semibold';
        userProfileButton.textContent = username;
        userProfileButton.addEventListener('click', () => {
            document.getElementById('reviewDetailModal').classList.add('hidden');
            if (username === currentUsername) {
                showProfileModal();
            } else {
                showUserProfile(username);
            }
        });
        detailUserIdSpan.appendChild(userProfileButton);
    } else {
        detailUserIdSpan.textContent = username;
    }
    
    // Incident location and votes
    document.getElementById('detailIncidentLocation').textContent = review.incident_location || 'N/A';
    document.getElementById('upvotesCount').textContent = review.upvotes || 0;
    document.getElementById('downvotesCount').textContent = review.downvotes || 0;
    
    // Set active state for vote buttons
    const upvoteBtn = document.getElementById('upvoteBtn');
    const downvoteBtn = document.getElementById('downvoteBtn');
    const currentUserVote = userVotes[review.id];
    upvoteBtn.classList.toggle('active-up', currentUserVote === 'up');
    downvoteBtn.classList.toggle('active-down', currentUserVote === 'down');

    // Render rating stars
    const ratingStarsContainer = document.getElementById('detailRatingStars');
    ratingStarsContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const starSpan = document.createElement('span');
        starSpan.classList.add('star');
        if (i <= review.rating) starSpan.classList.add('filled');
        starSpan.textContent = '\u2605';
        ratingStarsContainer.prepend(starSpan);
    }

    // Render traits
    const detailTraitsContainer = document.getElementById('detailTraits');
    detailTraitsContainer.innerHTML = '';
    if (review.tags) {
        const tagsArray = review.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        tagsArray.forEach(tag => {
            const traitSpan = document.createElement('span');
            traitSpan.className = 'px-3 py-1 rounded-full text-sm font-medium text-white';
            traitSpan.style.backgroundColor = positiveTraits.includes(tag) ? '#10b981' : '#ef4444';
            traitSpan.textContent = tag;
            detailTraitsContainer.appendChild(traitSpan);
        });
    } else {
        detailTraitsContainer.innerHTML = '<span class="text-light-secondary text-sm">No traits.</span>';
    }

    // Update navigation controls
    document.getElementById('detailReviewCount').textContent = `Review ${currentReviewIndex + 1} of ${currentPlateReviews.length}`;
    document.getElementById('prevReviewBtn').disabled = currentReviewIndex === 0;
    document.getElementById('nextReviewBtn').disabled = currentReviewIndex >= currentPlateReviews.length - 1;
};

/**
 * Sets the navigation mode of the review detail modal.
 * 'feed' mode shows next/previous buttons.
 * 'profile' mode shows a 'Back to Profile' button.
 * @param {'feed' | 'profile'} mode - The mode to set.
 * @param {string|null} username - The username associated with the profile, if in 'profile' mode.
 */
const setDetailModalMode = (mode, username = null) => {
    const feedNav = document.getElementById('detailNavFeed');
    const profileNav = document.getElementById('detailNavProfile');

    if (mode === 'profile') {
        feedNav.classList.add('hidden');
        profileNav.classList.remove('hidden');
        lastViewedProfile = username;
    } else { // Default to 'feed' mode
        feedNav.classList.remove('hidden');
        profileNav.classList.add('hidden');
        lastViewedProfile = null;
    }
};

/**
 * Displays the review detail modal for a given license plate.
 * @param {string} plateNumber - The license plate number to show reviews for.
 */
const showReviewDetail = (plateNumber) => {
    setDetailModalMode('feed'); // Reset to default feed navigation mode
    currentPlateReviews = aggregatedReviewsData[plateNumber].allReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    currentReviewIndex = 0;
    document.getElementById('reviewDetailModal').classList.remove('hidden');
    updateReviewDetailModalContent(currentPlateReviews[currentReviewIndex]);
};

/**
 * Navigates to the previous review in the detail modal.
 */
const showPreviousReview = () => {
    if (currentReviewIndex > 0) {
        currentReviewIndex--;
        updateReviewDetailModalContent(currentPlateReviews[currentReviewIndex]);
    }
};

/**
 * Navigates to the next review in the detail modal.
 */
const showNextReview = () => {
    if (currentReviewIndex < currentPlateReviews.length - 1) {
        currentReviewIndex++;
        updateReviewDetailModalContent(currentPlateReviews[currentReviewIndex]);
    }
};

/**
 * Renders the main review feed based on current filters.
 */
const renderReviews = () => {
    const reviewsContainer = document.getElementById('reviewsContainer');
    const normalizePlate = (plate) => plate.replace(/[\s-]/g, '').toLowerCase();
    const searchTerm = normalizePlate(document.getElementById('searchPlate').value.trim());
    const selectedState = document.getElementById('filterState').value;
    const selectedMake = document.getElementById('filterMake').value;
    const selectedType = document.getElementById('filterType').value;
    const selectedSubtype = document.getElementById('filterSubtype').value;

    const filteredData = Object.values(aggregatedReviewsData).filter(data => {
        const plateMatch = normalizePlate(data.plate_number).includes(searchTerm);
        const stateMatch = !selectedState || data.allReviews.some(review => review.incident_location === selectedState);
        const makeMatch = !selectedMake || data.allReviews.some(review => review.vehicle_make === selectedMake);
        
        const typeMatch = !selectedType || data.allReviews.some(review => {
            if (!review.vehicle_make || !review.vehicle_model) return false;
            const subtype = vehicleSubtype[review.vehicle_make]?.[review.vehicle_model];
            const type = vehicleType[subtype];
            return type === selectedType;
        });

        const subtypeMatch = !selectedSubtype || data.allReviews.some(review => {
            if (!review.vehicle_make || !review.vehicle_model) return false;
            const subtype = vehicleSubtype[review.vehicle_make]?.[review.vehicle_model];
            return subtype === selectedSubtype;
        });

        return plateMatch && stateMatch && makeMatch && typeMatch && subtypeMatch;
    });

    reviewsContainer.innerHTML = '';
    if (filteredData.length === 0) {
        reviewsContainer.innerHTML = `<div class="text-center py-10"><p class="text-light-secondary">No reviews match the current filters.</p></div>`;
        return;
    }
    filteredData.forEach(data => {
        const ratingColor = data.averageRating >= 4 ? 'text-green-400' : data.averageRating >= 2 ? 'text-yellow-400' : 'text-red-400';
        const firstReview = data.allReviews[0];
        const commentHtml = firstReview.comment ? renderStructuredComment(firstReview.comment).replace(/<[^>]*>/g, '') : 'No comment';
        const reviewCardHtml = `
            <div class="bg-dark-tertiary p-4 rounded-xl shadow-md flex items-center space-x-4 cursor-pointer review-card" data-plate-number="${data.plate_number}">
                <div class="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center font-bold text-xl text-light-primary">${data.plate_number.charAt(0)}</div>
                <div class="flex-grow">
                    <h3 class="font-bold text-light-primary">${data.plate_number.toUpperCase()}</h3>
                    <p class="text-sm text-light-secondary">${firstReview.vehicle_make || 'Unknown'} • ${commentHtml.substring(0, 30)}...</p>
                </div>
                <div class="flex items-center font-bold text-lg ${ratingColor}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="mr-1"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    <span>${parseFloat(data.averageRating).toFixed(1)}</span>
                </div>
            </div>`;
        reviewsContainer.insertAdjacentHTML('beforeend', reviewCardHtml);
    });
    document.querySelectorAll('.review-card').forEach(card => {
        card.addEventListener('click', (event) => showReviewDetail(event.currentTarget.dataset.plateNumber));
    });
};

/**
 * Renders badges in a given container, showing locked/unlocked state.
 * @param {Array} userBadges - Array of badge objects the user has earned.
 * @param {Array} allBadges - Array of all possible badge objects.
 * @param {HTMLElement} container - The container element to render badges into.
 * @param {number} [limit=0] - The maximum number of badges to display (0 for all).
 */
const renderProfileBadges = (userBadges, allBadges, container, limit = 0) => {
    if (!container) return;
    container.innerHTML = '';

    if (!allBadges || allBadges.length === 0) {
        container.innerHTML = '<p class="text-light-secondary text-sm">Could not load achievements.</p>';
        return;
    }

    const userBadgeIds = new Set(userBadges.map(b => b.badge_id));
    let badgesToDisplay;

    if (limit > 0) {
        // Sort for the preview: unlocked first, then by ID
        const sortedBadges = [...allBadges].sort((a, b) => {
            const aUnlocked = userBadgeIds.has(a.badge_id);
            const bUnlocked = userBadgeIds.has(b.badge_id);
            if (aUnlocked !== bUnlocked) {
                return aUnlocked ? -1 : 1;
            }
            return a.badge_id - b.badge_id;
        });
        badgesToDisplay = sortedBadges.slice(0, limit);
    } else {
        badgesToDisplay = allBadges; // For the "Show All" modal
    }

    badgesToDisplay.forEach(badge => {
        const isUnlocked = userBadgeIds.has(badge.badge_id);
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge-container cursor-pointer';

        const imgClass = isUnlocked ? '' : 'badge-locked';
        const lockIconHtml = isUnlocked ? '' : `
            <svg class="lock-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
        `;

        badgeElement.innerHTML = `
            <img src="${badge.image_url || '/images/badges/default.png'}" alt="${badge.name}" class="w-16 h-16 transition-transform hover:scale-110 ${imgClass}">
            ${lockIconHtml}
        `;

        badgeElement.addEventListener('click', () => {
            if (container.id === 'allBadgesContainer') {
                document.getElementById('allBadgesModal').classList.add('hidden');
            }
            
            const detailImage = document.getElementById('badgeDetailImage');
            detailImage.src = badge.image_url || '/images/badges/default.png';
            detailImage.classList.toggle('badge-locked', !isUnlocked);
            document.getElementById('badgeDetailName').textContent = badge.name;
            document.getElementById('badgeDetailDescription').textContent = isUnlocked ? badge.description : 'This badge is locked. Keep using PlateTraits to discover how to unlock it!';
            document.getElementById('badgeDetailModal').classList.remove('hidden');
        });

        container.appendChild(badgeElement);
    });
};

/**
 * Renders a user's submitted reviews into their profile modal.
 * @param {HTMLElement} container - The container element to render reviews into.
 * @param {Array} reviews - An array of the user's review objects.
 * @param {string} profileUsername - The username of the profile being viewed.
 */
const renderProfileReviews = (container, reviews, profileUsername) => {
    container.innerHTML = '';
    if (reviews && reviews.length > 0) {
        reviews.forEach(review => {
            const ratingColor = review.rating >= 4 ? 'text-green-400' : review.rating >= 2 ? 'text-yellow-400' : 'text-red-400';
            const reviewCard = document.createElement('div');
            reviewCard.className = 'bg-dark-tertiary p-3 rounded-lg cursor-pointer hover:bg-gray-700';
            reviewCard.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-bold text-light-primary">${review.plate_number.toUpperCase()}</p>
                        <p class="text-xs text-light-secondary">${new Date(review.created_at).toLocaleString()}</p>
                    </div>
                    <div class="flex items-center font-bold text-md ${ratingColor}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="mr-1"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <span>${review.rating}.0</span>
                    </div>
                </div>
                <p class="text-sm italic mt-2 text-light-secondary">"${renderStructuredComment(review.comment).replace(/<[^>]*>/g, '')}"</p>
            `;
            
            reviewCard.addEventListener('click', () => {
                const fullReviewData = allReviewsData.find(r => r.id === review.id);
                if (fullReviewData) {
                    document.getElementById('profileModal').classList.add('hidden');
                    setDetailModalMode('profile', profileUsername);
                    document.getElementById('reviewDetailModal').classList.remove('hidden');
                    updateReviewDetailModalContent(fullReviewData);
                } else {
                    console.error("Could not find full review data for ID:", review.id);
                }
            });
            
            container.appendChild(reviewCard);
        });
    } else {
        const message = (profileUsername === currentUsername) 
            ? 'You have not submitted any reviews yet.' 
            : 'This user has not submitted any reviews yet.';
        container.innerHTML = `<p class="text-light-secondary">${message}</p>`;
    }
};

// --- 4. API & Data Fetching ---

/**
 * Fetches all reviews from the API and processes them.
 */
const fetchReviews = async () => {
    const loadingIndicator = document.getElementById('loadingReviews');
    try {
        const response = await fetch(`${API_URL}/reviews`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        allReviewsData = await response.json();
        aggregatedReviewsData = {};
        allReviewsData.forEach(review => {
            const plate = review.plate_number.toUpperCase();
            if (!aggregatedReviewsData[plate]) {
                aggregatedReviewsData[plate] = { plate_number: plate, totalRating: 0, reviewCount: 0, averageRating: 0, allReviews: [] };
            }
            aggregatedReviewsData[plate].totalRating += review.rating;
            aggregatedReviewsData[plate].reviewCount++;
            aggregatedReviewsData[plate].averageRating = aggregatedReviewsData[plate].totalRating / aggregatedReviewsData[plate].reviewCount;
            aggregatedReviewsData[plate].allReviews.push(review);
        });
        renderReviews();
    } catch (error) {
        if(loadingIndicator) loadingIndicator.innerHTML = `<p class="text-red-500 col-span-full">Error: ${error.message}.</p>`;
    }
};

/**
 * Fetches the current user's votes on reviews.
 */
const fetchUserVotes = async () => {
    if (!authToken) {
        userVotes = {};
        return;
    }
    try {
        const response = await fetch(`${API_URL}/user/votes`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!response.ok) throw new Error('Could not fetch user votes.');
        const result = await response.json();
        userVotes = result.votes.reduce((acc, vote) => {
            acc[vote.review_id] = vote.vote_type;
            return acc;
        }, {});
    } catch (error) {
        console.error("Failed to fetch user votes:", error);
        userVotes = {};
    }
};

/**
 * Fetches all available badges from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of all badge objects.
 */
const fetchAllBadges = async () => {
    try {
        const response = await fetch(`${API_URL}/badges`);
        if (!response.ok) {
            throw new Error('Could not fetch all badges.');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch all badges:", error);
        return []; // Return empty array on error
    }
};

/**
 * Fetches and displays the profile for a given username.
 * @param {string} username - The username of the profile to display.
 */
const showUserProfile = async (username) => {
    const profileModal = document.getElementById('profileModal');
    const profileTitle = profileModal.querySelector('h2');
    const profileFirstNameEl = document.getElementById('profileFirstName');
    const profileUsernameEl = document.getElementById('profileUsername');
    const profileEmailContainer = document.getElementById('profileEmail').parentElement;
    const profileJoinDateContainer = document.getElementById('profileJoinDate').parentElement;
    const profileJoinDateEl = document.getElementById('profileJoinDate');
    const profileReviewsContainer = document.getElementById('profileReviewsContainer');
    const reviewsHeading = document.getElementById('profileReviewsHeading');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const profileVehicle = document.getElementById('profileVehicle');
    const profileBio = document.getElementById('profileBio');
    const profileBadgesContainer = document.getElementById('profileBadgesContainer');
    const allBadgesContainer = document.getElementById('allBadgesContainer');

    profileReviewsContainer.innerHTML = '<p class="text-light-secondary">Loading profile...</p>';
    profileModal.classList.remove('hidden');

    try {
        const response = await fetch(`${API_URL}/users/profile/${username}`);
        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.message || 'Could not fetch user profile.');
        }
        const { user, reviews, badges: userBadges } = await response.json();
        const allBadges = await fetchAllBadges();

        // Populate public profile view
        profileTitle.textContent = `${user.username}'s Profile`;
        reviewsHeading.textContent = `${user.username}'s Submitted Reviews`;
        profileFirstNameEl.textContent = user.first_name || 'N/A';
        profileUsernameEl.textContent = user.username;
        profileJoinDateEl.textContent = new Date(user.created_at).toLocaleDateString();
        profileEmailContainer.style.display = 'none';
        profileJoinDateContainer.style.display = 'block';
        editProfileBtn.classList.add('hidden');
        profileVehicle.textContent = (user.current_vehicle_make && user.current_vehicle_model)
            ? `${user.current_vehicle_color || ''} ${user.current_vehicle_year || ''} ${user.current_vehicle_make} ${user.current_vehicle_model}`.trim()
            : 'Not specified';
        
        profileBio.innerHTML = user.bio ? renderStructuredComment(user.bio) : 'No bio provided.';

        renderProfileBadges(userBadges, allBadges, profileBadgesContainer, 4);
        renderProfileBadges(userBadges, allBadges, allBadgesContainer);
        renderProfileReviews(profileReviewsContainer, reviews, user.username);

    } catch (error) {
        profileReviewsContainer.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        console.error(`Failed to fetch profile for ${username}:`, error);
    }
};

/**
 * Fetches and displays the currently logged-in user's profile.
 */
const showProfileModal = async () => {
    if (!authToken) return;

    const profileModal = document.getElementById('profileModal');
    const profileTitle = profileModal.querySelector('h2');
    const profileEmailContainer = document.getElementById('profileEmail').parentElement;
    const profileJoinDateContainer = document.getElementById('profileJoinDate').parentElement;
    const profileReviewsContainer = document.getElementById('profileReviewsContainer');
    const reviewsHeading = document.getElementById('profileReviewsHeading');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const profileVehicle = document.getElementById('profileVehicle');
    const profileBio = document.getElementById('profileBio');
    const profileBadgesContainer = document.getElementById('profileBadgesContainer');
    const allBadgesContainer = document.getElementById('allBadgesContainer');
    
    // Configure for "My Profile" view
    profileTitle.textContent = 'My Profile';
    reviewsHeading.textContent = 'My Submitted Reviews';
    profileEmailContainer.style.display = 'block';
    profileJoinDateContainer.style.display = 'block';
    editProfileBtn.classList.remove('hidden');

    profileReviewsContainer.innerHTML = '<p class="text-light-secondary">Loading your profile...</p>';
    profileModal.classList.remove('hidden');

    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
            throw new Error('Could not fetch profile data.');
        }

        const { user, reviews, badges: userBadges } = await response.json();
        const allBadges = await fetchAllBadges();

        // Populate display view
        document.getElementById('profileFirstName').textContent = user.first_name || 'N/A';
        document.getElementById('profileUsername').textContent = user.username;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileJoinDate').textContent = new Date(user.created_at).toLocaleDateString();
        profileVehicle.textContent = (user.current_vehicle_make && user.current_vehicle_model)
            ? `A${user.current_vehicle_color || ''} ${user.current_vehicle_year || ''} ${user.current_vehicle_make} ${user.current_vehicle_model}`.trim()
            : 'Not specified';
        
        profileBio.innerHTML = user.bio ? renderStructuredComment(user.bio) : 'No bio provided.';
        
        // Populate the edit form fields
        document.getElementById('profile_first_name').value = user.first_name || '';
        document.getElementById('profile_vehicle_year').value = user.current_vehicle_year || '';
        document.getElementById('profile_vehicle_make').value = user.current_vehicle_make || '';
        document.getElementById('profile_vehicle_make').dispatchEvent(new Event('change'));
        setTimeout(() => {
            document.getElementById('profile_vehicle_model').value = user.current_vehicle_model || '';
            document.getElementById('profile_vehicle_color').value = user.current_vehicle_color || '';
        }, 100);

        // Populate the bio edit form
        const bioTemplateSelect = document.getElementById('bio-template');
        if (user.bio && user.bio.template) {
            bioTemplateSelect.value = user.bio.template;
        }
        bioTemplateSelect.dispatchEvent(new Event('change'));
        setTimeout(() => {
            if (user.bio && user.bio.words) {
                const wordSelects = document.querySelectorAll('#bio-words-container select');
                wordSelects.forEach((select, index) => {
                    if (user.bio.words[index]) {
                        select.value = user.bio.words[index];
                    }
                });
            }
        }, 100);

        // Render dynamic content
        renderProfileBadges(userBadges, allBadges, profileBadgesContainer, 4);
        renderProfileBadges(userBadges, allBadges, allBadgesContainer);
        renderProfileReviews(profileReviewsContainer, reviews, user.username);

    } catch (error) {
        profileReviewsContainer.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        console.error("Failed to fetch profile:", error);
    }
};


// --- 5. Authentication & User Actions ---

/**
 * Updates the UI based on the user's authentication status.
 */
const updateAuthUI = () => {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const addReviewBtn = document.getElementById('addReviewBtn');
    if (authToken) {
        loginBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        usernameDisplay.textContent = currentUsername;
        addReviewBtn.disabled = false;
    } else {
        loginBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
        addReviewBtn.disabled = true;
    }
};

/**
 * Handles user logout.
 */
const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    authToken = null;
    currentUsername = null;
    userVotes = {};
    updateAuthUI();
    document.getElementById('profileModal').classList.add('hidden');
};

/**
 * Toggles the authentication modal between 'Login' and 'Register' modes.
 */
const switchAuthMode = () => {
    isAuthModalInLoginMode = !isAuthModalInLoginMode;
    const authTitle = document.getElementById('authTitle');
    const authPrompt = document.getElementById('authPrompt');
    const switchAuthModeBtn = document.getElementById('switchAuthModeBtn');
    const emailField = document.getElementById('email-field-container');
    const confirmPasswordField = document.getElementById('confirm-password-container');
    const firstNameField = document.getElementById('first-name-field-container');
    const emailInput = document.getElementById('email');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const firstNameInput = document.getElementById('first_name');

    if (isAuthModalInLoginMode) {
        authTitle.textContent = 'Login';
        authPrompt.textContent = "Don't have an account?";
        switchAuthModeBtn.textContent = 'Register';
        emailField.classList.add('hidden');
        confirmPasswordField.classList.add('hidden');
        firstNameField.classList.add('hidden');
        emailInput.required = false;
        confirmPasswordInput.required = false;
        firstNameInput.required = false;
    } else {
        authTitle.textContent = 'Register';
        authPrompt.textContent = "Already have an account?";
        switchAuthModeBtn.textContent = 'Login';
        emailField.classList.remove('hidden');
        confirmPasswordField.classList.remove('hidden');
        firstNameField.classList.remove('hidden');
        emailInput.required = true;
        confirmPasswordInput.required = true;
        firstNameInput.required = true;
    }
    document.getElementById('authMessage').textContent = '';
    document.getElementById('authForm').reset();
};

/**
 * Handles a user's vote action (upvote or downvote).
 * @param {'up' | 'down'} clickedVoteType - The type of vote being cast.
 */
const handleVote = async (clickedVoteType) => {
    if (!authToken) {
        alert('You must be logged in to vote.');
        return;
    }
    
    const review = currentPlateReviews[currentReviewIndex];
    const currentVote = userVotes[review.id];
    let newVoteType = (clickedVoteType === currentVote) ? 'none' : clickedVoteType;

    // Optimistic UI Update
    if (currentVote === 'up') review.upvotes--;
    if (currentVote === 'down') review.downvotes--;
    if (newVoteType === 'up') review.upvotes++;
    if (newVoteType === 'down') review.downvotes++;
    if (newVoteType === 'none') delete userVotes[review.id];
    else userVotes[review.id] = newVoteType;
    
    updateReviewDetailModalContent(review);

    try {
        const response = await fetch(`${API_URL}/reviews/${review.id}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ voteType: newVoteType }),
        });
         if (!response.ok) throw new Error('Vote failed on server');
    } catch (error) {
        console.error('Vote failed:', error);
        alert('There was an error submitting your vote.');
        fetchReviews(); // Re-fetch to get the correct state from the server
    }
};

// --- 6. Event Listeners & Initialization ---

/**
 * Attaches event listeners to the 'Add Review' modal elements after it's injected.
 */
const reassignModalElements = () => {
    const closeModalBtn = document.getElementById('closeModalBtn');
    const reviewForm = document.getElementById('reviewForm');
    const formMessage = document.getElementById('formMessage');
    const tagsInput = document.getElementById('tags');
    const traitChips = document.querySelectorAll('.trait-chip');
    const addReviewBtn = document.getElementById('addReviewBtn');
    const reviewModal = document.getElementById('reviewModal');
    const authModal = document.getElementById('authModal');
    const plateNumberInput = document.getElementById('plate_number');
    const vehicleMakeSelect = document.getElementById('vehicle_make');
    const vehicleModelSelect = document.getElementById('vehicle_model');
    const commentTemplateSelect = document.getElementById('comment-template');
    const commentWordsContainer = document.getElementById('comment-words-container');
    const noCommentCheckbox = document.getElementById('no-comment-checkbox');
    const commentBuilderBody = document.getElementById('comment-builder-body');

    plateNumberInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\s/g, '-').toUpperCase();
    });

    noCommentCheckbox.addEventListener('change', () => {
        commentBuilderBody.style.display = noCommentCheckbox.checked ? 'none' : 'block';
    });

    const updateCommentBuilder = () => {
        const templateIndex = commentTemplateSelect.value;
        const selectedTemplate = commentBuilderData.templates[templateIndex];
        const placeholders = selectedTemplate.match(/_____/g) || [];
        
        commentWordsContainer.innerHTML = '';
        placeholders.forEach((_, i) => {
            const wordSelectHtml = `
    <div>
        <label class="text-sm font-medium text-light-secondary">Word ${i + 1}</label>
        <select name="comment_word_${i}" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500">
            <optgroup label="People">${commentBuilderData.words.people_archetypes.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Vehicles">${commentBuilderData.words.vehicles.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Road Features">${commentBuilderData.words.road_features.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Maneuvers & Actions">${commentBuilderData.words.maneuvers_actions.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Driver Errors">${commentBuilderData.words.driver_errors.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Items & Gestures">${commentBuilderData.words.items_gestures.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Concepts & States">${commentBuilderData.words.concepts_states.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Modes & Stances">${commentBuilderData.words.modes_stances.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Guidance">${commentBuilderData.words.guidance.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Qualities & Adjectives">${commentBuilderData.words.qualities_adjectives.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Directions">${commentBuilderData.words.directions.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Phrases">${commentBuilderData.words.phrases.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Conjunctions">${commentBuilderData.words.conjunctions.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
        </select>
    </div>
`;
            commentWordsContainer.insertAdjacentHTML('beforeend', wordSelectHtml);
        });
    };
    commentTemplateSelect.addEventListener('change', updateCommentBuilder);
    updateCommentBuilder();

    if (vehicleMakeSelect) {
        vehicleMakeSelect.addEventListener('change', () => {
            const selectedMake = vehicleMakeSelect.value;
            const models = vehicleModels[selectedMake] || vehicleModels['Other'];
            vehicleModelSelect.innerHTML = '<option value="">Select Model</option>' + models.map(model => `<option value="${model}">${model}</option>`).join('');
            vehicleModelSelect.disabled = !selectedMake;
        });
    }

    addReviewBtn.addEventListener('click', () => {
        if (authToken) reviewModal.classList.remove('hidden');
        else authModal.classList.remove('hidden');
    });
    closeModalBtn.addEventListener('click', () => reviewModal.classList.add('hidden'));

    let selectedTraits = new Set();
    traitChips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            const traitValue = chip.dataset.value;
            if (selectedTraits.has(traitValue)) selectedTraits.delete(traitValue);
            else selectedTraits.add(traitValue);
            tagsInput.value = Array.from(selectedTraits).join(', ');
        });
    });

    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.textContent = '';
        
        const formData = new FormData(reviewForm);
        const data = Object.fromEntries(formData.entries());
        
        const errors = [];
        if (!data.plate_number.trim()) errors.push("Plate number is required.");
        if (!data.rating) errors.push("A star rating is required.");
        
        if (errors.length > 0) {
            formMessage.innerHTML = errors.join('<br>');
            formMessage.className = 'mt-4 text-center text-red-600';
            return;
        }

        formMessage.textContent = 'Submitting...';
        formMessage.className = 'mt-4 text-center text-gray-500';

        if (noCommentCheckbox.checked) {
            data.comment = null;
        } else {
            const selectedWords = Array.from(formData.keys()).filter(k => k.startsWith('comment_word_')).map(k => formData.get(k));
            data.comment = { template: formData.get('comment_template'), words: selectedWords };
        }
        
        data.rating = Number(data.rating);

        if (forbiddenWords.some(word => normalizeText(data.plate_number).includes(word))) {
            formMessage.textContent = 'Error: Plate number contains forbidden words.';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(data),
            });

            if (response.status === 401 || response.status === 403) {
                throw new Error('Authentication failed. Your session has expired.');
            }

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.details || result.message || 'Failed to submit.');
            }
            
            formMessage.textContent = 'Review submitted successfully!';
            setTimeout(() => {
                reviewModal.classList.add('hidden');
                reviewForm.reset();
                updateCommentBuilder();
                traitChips.forEach(c => c.classList.remove('active'));
                selectedTraits.clear();
                formMessage.textContent = '';
            }, 1500);
            fetchReviews();

        } catch (error) {
            formMessage.textContent = `Error: ${error.message}`;
            formMessage.className = 'mt-4 text-center text-red-600';

            if (error.message.includes('Authentication failed')) {
                setTimeout(() => {
                    reviewModal.classList.add('hidden');
                    handleLogout();
                    document.getElementById('authModal').classList.remove('hidden');
                }, 2500);
            }
        }
    });
};

/**
 * Main application initialization function.
 */
function initApp() {
    // --- Element Selectors ---
    const reviewDetailModal = document.getElementById('reviewDetailModal');
    const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
    const prevReviewBtn = document.getElementById('prevReviewBtn');
    const nextReviewBtn = document.getElementById('nextReviewBtn');
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
    const switchAuthModeBtn = document.getElementById('switchAuthModeBtn');
    const authForm = document.getElementById('authForm');
    const showPasswordToggle = document.getElementById('showPasswordToggle');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const upvoteBtn = document.getElementById('upvoteBtn');
    const downvoteBtn = document.getElementById('downvoteBtn');
    const filterStateSelect = document.getElementById('filterState');
    const filterMakeSelect = document.getElementById('filterMake');
    const filterTypeSelect = document.getElementById('filterType');
    const filterSubtypeSelect = document.getElementById('filterSubtype');
    const profileBtn = document.getElementById('profileBtn');
    const profileModal = document.getElementById('profileModal');
    const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
    const backToProfileBtn = document.getElementById('backToProfileBtn');
    const badgeDetailModal = document.getElementById('badgeDetailModal');
    const closeBadgeDetailModalBtn = document.getElementById('closeBadgeDetailModalBtn');
    const allBadgesModal = document.getElementById('allBadgesModal');
    const showAllBadgesBtn = document.getElementById('showAllBadgesBtn');
    const closeAllBadgesModalBtn = document.getElementById('closeAllBadgesModalBtn');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const profileDisplayView = document.getElementById('profile-display-view');
    const profileEditView = document.getElementById('profile-edit-view');
    const cancelEditProfileBtn = document.getElementById('cancelEditProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const profileMakeSelect = document.getElementById('profile_vehicle_make');
    const profileModelSelect = document.getElementById('profile_vehicle_model');
    const profileColorSelect = document.getElementById('profile_vehicle_color');
    const profileYearSelect = document.getElementById('profile_vehicle_year');
    const profileEditMessage = document.getElementById('profileEditMessage');
    const bioTemplateSelect = document.getElementById('bio-template');
    const bioWordsContainer = document.getElementById('bio-words-container');

    // --- Initial Setup ---
    injectReviewModal();
    updateAuthUI();
    if (authToken) {
        fetchUserVotes();
    }
    reassignModalElements();

    // --- Populate Filter Dropdowns ---
    const stateOptions = ['<option value="">All States</option>', ...usStates.map(state => `<option value="${state}">${state}</option>`)].join('');
    filterStateSelect.innerHTML = stateOptions;
    const makeOptions = ['<option value="">All Makes</option>', ...vehicleMakes.map(make => `<option value="${make}">${make}</option>`)].join('');
    filterMakeSelect.innerHTML = makeOptions;
    profileMakeSelect.innerHTML = makeOptions;
    const uniqueVehicleTypes = [...new Set(Object.values(vehicleType))].sort();
    const typeOptions = ['<option value="">All Types</option>', ...uniqueVehicleTypes.map(type => `<option value="${type}">${type}</option>`)].join('');
    filterTypeSelect.innerHTML = typeOptions;
    const allSubtypes = Object.values(vehicleSubtype).flatMap(models => Object.values(models));
    const uniqueVehicleSubtypes = [...new Set(allSubtypes)].sort();
    const subtypeOptions = ['<option value="">All Subtypes</option>', ...uniqueVehicleSubtypes.map(subtype => `<option value="${subtype}">${subtype}</option>`)].join('');
    filterSubtypeSelect.innerHTML = subtypeOptions;
    const colorOptions = ['<option value="">Select Color</option>', ...vehicleColors.map(color => `<option value="${color}">${color}</option>`)].join('');
    profileColorSelect.innerHTML = colorOptions;
    const yearOptions = ['<option value="">Select Year</option>'];
    const endYear = new Date().getFullYear() + 1;
    for (let year = endYear; year >= 1900; year--) {
        yearOptions.push(`<option value="${year}">${year}</option>`);
    }
    profileYearSelect.innerHTML = yearOptions.join('');
    const bioTemplateOptions = commentBuilderData.templates.map((template, index) => `<option value="${index}">${template}</option>`).join('');
    bioTemplateSelect.innerHTML = bioTemplateOptions;

    // --- Event Listeners ---

    // Auth Modal
    loginBtn.addEventListener('click', () => authModal.classList.remove('hidden'));
    logoutBtn.addEventListener('click', handleLogout);
    closeAuthModalBtn.addEventListener('click', () => authModal.classList.add('hidden'));
    switchAuthModeBtn.addEventListener('click', switchAuthMode);
    showPasswordToggle.addEventListener('change', () => {
        const isChecked = showPasswordToggle.checked;
        passwordInput.type = isChecked ? 'text' : 'password';
        confirmPasswordInput.type = isChecked ? 'text' : 'password';
    });
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const authMessage = document.getElementById('authMessage');
        authMessage.textContent = 'Processing...';
        const formData = new FormData(authForm);
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
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'An error occurred.');
            }
            const result = await response.json();
            if (isAuthModalInLoginMode) {
                authToken = result.accessToken;
                currentUsername = result.username;
                localStorage.setItem('token', authToken);
                localStorage.setItem('username', currentUsername);
                authMessage.textContent = 'Login successful!';
                await fetchUserVotes();
                setTimeout(() => { authModal.classList.add('hidden'); updateAuthUI(); }, 500);
            } else {
                authMessage.textContent = 'Registration successful! Please log in.';
                switchAuthMode();
            }
        } catch (error) {
            authMessage.textContent = `Error: ${error.message}`;
        }
    });

    // Review Detail Modal
    const goBackToProfile = () => {
        if (lastViewedProfile) {
            reviewDetailModal.classList.add('hidden');
            if (lastViewedProfile === currentUsername) {
                showProfileModal();
            } else {
                showUserProfile(lastViewedProfile);
            }
            setDetailModalMode('feed'); // Reset mode
        }
    };
    closeDetailModalBtn.addEventListener('click', () => {
        if (lastViewedProfile) {
            goBackToProfile();
        } else {
            reviewDetailModal.classList.add('hidden');
            setDetailModalMode('feed');
        }
    });
    prevReviewBtn.addEventListener('click', showPreviousReview);
    nextReviewBtn.addEventListener('click', showNextReview);
    upvoteBtn.addEventListener('click', () => handleVote('up'));
    downvoteBtn.addEventListener('click', () => handleVote('down'));

    // Profile Modal
    profileBtn.addEventListener('click', showProfileModal);
    closeProfileModalBtn.addEventListener('click', () => profileModal.classList.add('hidden'));
    backToProfileBtn.addEventListener('click', goBackToProfile);

    // Badge Modals
    closeBadgeDetailModalBtn.addEventListener('click', () => badgeDetailModal.classList.add('hidden'));
    showAllBadgesBtn.addEventListener('click', () => allBadgesModal.classList.remove('hidden'));
    closeAllBadgesModalBtn.addEventListener('click', () => allBadgesModal.classList.add('hidden'));

    // Filters
    document.getElementById('searchPlate').addEventListener('input', renderReviews);
    filterStateSelect.addEventListener('change', renderReviews);
    filterMakeSelect.addEventListener('change', renderReviews);
    filterTypeSelect.addEventListener('change', renderReviews);
    filterSubtypeSelect.addEventListener('change', renderReviews);

    // Profile Edit
    editProfileBtn.addEventListener('click', () => {
        profileDisplayView.classList.add('hidden');
        profileEditView.classList.remove('hidden');
        editProfileBtn.classList.add('hidden');
    });
    cancelEditProfileBtn.addEventListener('click', () => {
        profileDisplayView.classList.remove('hidden');
        profileEditView.classList.add('hidden');
        editProfileBtn.classList.remove('hidden');
        profileEditMessage.textContent = '';
    });
    profileMakeSelect.addEventListener('change', () => {
        const selectedMake = profileMakeSelect.value;
        const models = vehicleModels[selectedMake] || vehicleModels['Other'];
        profileModelSelect.innerHTML = '<option value="">Select Model</option>' + models.map(model => `<option value="${model}">${model}</option>`).join('');
        profileModelSelect.disabled = !selectedMake;
    });
    const updateBioBuilder = () => {
        const templateIndex = bioTemplateSelect.value;
        const selectedTemplate = commentBuilderData.templates[templateIndex];
        const placeholders = selectedTemplate.match(/_____/g) || [];
        
        bioWordsContainer.innerHTML = '';
        placeholders.forEach((_, i) => {
            const wordSelectHtml = `
    <div>
        <label class="text-sm font-medium text-light-secondary">Word ${i + 1}</label>
        <select name="bio_word_${i}" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500">
            <optgroup label="People">${commentBuilderData.words.people_archetypes.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Vehicles">${commentBuilderData.words.vehicles.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Road Features">${commentBuilderData.words.road_features.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Maneuvers & Actions">${commentBuilderData.words.maneuvers_actions.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Driver Errors">${commentBuilderData.words.driver_errors.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Items & Gestures">${commentBuilderData.words.items_gestures.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Concepts & States">${commentBuilderData.words.concepts_states.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Modes & Stances">${commentBuilderData.words.modes_stances.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Guidance">${commentBuilderData.words.guidance.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Qualities & Adjectives">${commentBuilderData.words.qualities_adjectives.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Directions">${commentBuilderData.words.directions.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Phrases">${commentBuilderData.words.phrases.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Conjunctions">${commentBuilderData.words.conjunctions.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
        </select>
    </div>
`;
            bioWordsContainer.insertAdjacentHTML('beforeend', wordSelectHtml);
        });
    };
    bioTemplateSelect.addEventListener('change', updateBioBuilder);
    updateBioBuilder(); // Initial population
    saveProfileBtn.addEventListener('click', async () => {
        const firstName = document.getElementById('profile_first_name').value;
        const vehicleData = {
            make: profileMakeSelect.value,
            model: profileModelSelect.value,
            color: profileColorSelect.value,
            year: profileYearSelect.value
        };
        const bioWords = Array.from(document.querySelectorAll('#bio-words-container select')).map(select => select.value);
        const bioData = {
            template: bioTemplateSelect.value,
            words: bioWords
        };

        profileEditMessage.textContent = 'Saving...';
        profileEditMessage.className = 'text-center text-sm mt-4 text-gray-500';

        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ first_name: firstName, vehicle: vehicleData, bio: bioData })
            });

            if (!response.ok) {
                 const result = await response.json().catch(() => ({ message: 'Failed to save profile. Server returned a non-JSON error.' }));
                 throw new Error(result.message || 'Failed to save profile.');
            }

            profileEditMessage.textContent = 'Saved successfully!';
            profileEditMessage.className = 'text-center text-sm mt-4 text-green-500';

            // Update the display view with new data
            document.getElementById('profileFirstName').textContent = firstName || 'N/A';
            document.getElementById('profileVehicle').textContent = (vehicleData.make && vehicleData.model)
                ? `${vehicleData.year || ''} ${vehicleData.color || ''} ${vehicleData.make} ${vehicleData.model}`.trim()
                : 'Not specified';
            document.getElementById('profileBio').innerHTML = renderStructuredComment(bioData);

            setTimeout(() => {
                profileDisplayView.classList.remove('hidden');
                profileEditView.classList.add('hidden');
                editProfileBtn.classList.remove('hidden');
                profileEditMessage.textContent = '';
            }, 1500);

        } catch (error) {
            profileEditMessage.textContent = `Error: ${error.message}`;
            profileEditMessage.className = 'text-center text-sm mt-4 text-red-500';
        }
    });

    // --- Initial Data Fetch ---
    fetchReviews();
}

// --- App Entry Point ---
document.addEventListener('DOMContentLoaded', initApp);