document.addEventListener('DOMContentLoaded', () => {
    // --- DATA DEFINITIONS ---
    const commentBuilderData = {
        templates: ["_____.", "_____ _____.", "_____ _____ _____.", "_____ _____ _____ _____.", "Ignorance of _____.", "If only I had a _____.", "If only I had a _____, then _____.", "_____ ahead, therefore _____.", "Could this be a _____?", "Behold, _____!", "Offer _____.", "Praise the _____.", "Try _____.", "Beware of _____.", "Time for _____.", "_____ required ahead.", "No _____ here, move along.", "Watch for _____ ahead.", "Do not trust _____.", "Unexpected _____ incoming.", "Approach _____ with caution.", "Prepare for _____.", "Caution: _____ zone.", "Look out for _____.", "Expect _____ ahead.", "Proceed with _____.", "_____ detected, slow down.", "Immediate _____ recommended.", "_____ spotted nearby.", "Engage _____ mode.", "_____ is inevitable.", "May the _____ guide you.", "You must gather your _____ before venturing forth.", "Visions of _____...", "_____ awaits.", "_____, but _____.", "First _____, then _____.", "Look _____, O, look _____.", "Why is it always _____?"],
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
    const vehicleMakes = ["Acura", "Alfa Romeo", "Aprilia", "Audi", "BMW", "Buell", "Buick", "Cadillac", "Can-Am", "Chevrolet", "Chrysler", "Dodge", "Ducati", "Fiat", "Ford", "Freightliner", "Genesis", "GMC", "Harley-Davidson", "Hino", "Honda", "Hummer", "Husqvarna", "Hyundai", "Indian", "Infiniti", "International", "Isuzu", "Jaguar", "Jeep", "Kawasaki", "Kenworth", "Kia", "KTM", "Land Rover", "Lexus", "Lincoln", "Lucid", "Mack", "Maserati", "Mazda", "Mercedes-Benz", "Mercury", "Mini", "Mitsubishi", "Mitsubishi Fuso", "Moto Guzzi", "MV Agusta", "Nissan", "Norton", "Peterbilt", "Piaggio", "Polestar", "Pontiac", "Porsche", "Ram", "Rivian", "Royal Enfield", "Saab", "Saturn", "Scion", "Subaru", "Suzuki", "Tesla", "Toyota", "Triumph", "Vespa", "Volkswagen", "Volvo", "Yamaha", "Zero Motorcycles", "Other"];
    const vehicleModels = {"Acura":["CL","ILX","Integra","Legend","MDX","NSX","RDX","RL","RLX","SLX","TLX","Vigor","ZDX"],"Alfa Romeo":["4C","8C","GTV-6","Giulia","Milano","Spider","Stelvio","Tonale"],"Aprilia":["RS 250","RS 660","RSV4","Tuareg 660","Tuono"],"Audi":["100","200","4000","5000","80","90","A3","A4","A5","A6","A7","A8","Cabriolet","Coupe Quattro","e-tron","e-tron GT","Q3","Q4 e-tron","Q5","Q7","Q8","R8","RS 3","RS 5","RS 6","RS 7","RS Q8","S3","S4","S5","S6","S8","SQ5","SQ7","SQ8","TT","TT RS"],"BMW":["1 Series","2 Series","3 Series","4 Series","5 Series","6 Series","7 Series","8 Series","i3","i4","i7","i8","iX","M2","M3","M4","M5","M6","M8","R 1250 GS","S 1000 RR","X1","X2","X3","X3 M","X4","X4 M","X5","X5 M","X6","X6 M","X7","Z3","Z4","Z8"],"Buell":["Blast","Cyclone","Firebolt","Lightning","Thunderbolt","Ulysses"],"Buick":["Allure","Apollo","Cascada","Century","Electra","Enclave","Encore","Encore GX","Envision","Estate","GS","Invicta","LaCrosse","LeSabre","Lucerne","Park Avenue","Rainier","Reatta","Regal","Rendezvous","Riviera","Roadmaster","Skyhawk","Skylark","Somerset","Special","Terraza","Verano","Wildcat"],"Cadillac":["Allante","ATS","Brougham","Celestiq","Cimarron","CT4","CT5","CT6","CTS","DeVille","DTS","Eldorado","ELR","Escalade","Fleetwood","Lyriq","Seville","SRX","STS","XLR","XT4","XT5","XT6","XTS"],"Can-Am":["Defender","Maverick","Ryker","Spyder"],"Chevrolet":["Astro","Avalanche","Aveo","Bel Air","Beretta","Biscayne","Blazer","Blazer EV","Bolt EUV","Bolt EV","C/K Pickup","Camaro","Caprice","Caprice Classic","Captiva Sport","Cavalier","Celebrity","Chevelle","Chevette","Chevy II / Nova","Citation","City Express","Classic","Cobalt","Colorado","Corsica","Corvair","Corvette","Cruze","El Camino","Equinox","Equinox EV","Express","HHR","Impala","Low Cab Forward","Lumina","LUV","Malibu","Metro","Monte Carlo","Monza","Prizm","S-10","Silverado 1500","Silverado 2500HD","Silverado 3500HD","Silverado 4500HD","Silverado 5500HD","Silverado 6500HD","Silverado EV","Sonic","Spark","Spectrum","Sprint","SSR","Suburban","Tahoe","Tracker","TrailBlazer","Traverse","Trax","Uplander","Vega","Venture","Volt"],"Chrysler":["200","300","300M","Aspen","Cirrus","Concorde","Cordoba","Crossfire","Dynasty","E-Class","Executive","Fifth Avenue","Grand Voyager","Imperial","Laser","LeBaron","LHS","New Yorker","Newport","Pacifica","Prowler","PT Cruiser","Sebring","TC by Maserati","Town & Country","Voyager"],"Dodge":["400","600","Aries","Aspen","Attitude","Avenger","Caliber","Caravan","Challenger","Challenger SRT Demon / 170","Challenger SRT Hellcat","Charger","Charger Daytona","Charger SRT Hellcat","Colt","Conquest","Coronet","Dakota","Dart","Daytona","Diplomat","Durango","Durango SRT / Hellcat","Dynasty","Grand Caravan","Hornet","Intrepid","Journey","Lancer","Magnum","Mirada","Monaco","Neon / SRT-4","Nitro","Omni","Raider","Ram Van / B-series","Rampage","Shadow","Spirit","St. Regis","Stealth","Stratus","Viper"],"Ducati":["Diavel","Hypermotard","Monster","Multistrada","Panigale","Scrambler","Streetfighter","SuperSport"],"Fiat":["124 Spider","500","500L","500X","Brava","Strada","X1/9"],"Ford":["Aerostar","Aspire","Bronco","Bronco Sport","C-Max","Contour","Crown Victoria","E-Series","E-Transit","EcoSport","Edge","Escape","Escort","Escort ZX2","Excursion","Expedition","Explorer","EXP","F-150","F-150 Lightning","F-250 Super Duty","F-350 Super Duty","F-450 Super Duty","F-550 Super Duty","F-650","F-750","Fairmont","Festiva","Fiesta","Five Hundred","Flex","Focus","Freestar","Freestyle","Fusion","GT","Granada","LTD","Maverick","Mustang","Mustang Mach-E","Pinto","Probe","Ranger","Taurus","Taurus X","Tempo","Thunderbird","Transit","Transit Connect","Windstar"],"Freightliner":["108SD","114SD","122SD","Cascadia","Columbia","Coronado","EconicSD","M2 106","M2 112"],"Genesis":["G70","G80","G90","GV60","GV70","GV80"],"GMC":["Acadia","C/K Pickup","Caballero","Canyon","Envoy","Envoy XUV","Hummer EV","Jimmy","Rally","Safari","Savana","Sierra 1500","Sierra 2500HD","Sierra 3500HD","Sierra 4500HD","Sierra 5500HD","Sierra 6500HD","Sonoma","Syclone","Terrain","TopKick","Typhoon","Vandura","Yukon","Yukon XL"],"Harley-Davidson":["CVO","Dyna","LiveWire","Pan America","Road Glide","Softail","Sportster","Street Glide","Trike","V-Rod"],"Hino":["155","195","238","258","268","338","L Series","M Series","XL Series"],"Honda":["600","Accord","Accord Crosstour","Accord Hybrid","Africa Twin","CBR Series","Civic","Civic Si","Civic Type R","Clarity","CR-V","CR-V Hybrid","CR-Z","CRF Series","CRX","Crosstour","Del Sol","Element","EV Plus","Fit","Gold Wing","Grom","HR-V","Insight","Odyssey","Passport","Pilot","Prelude","Prologue","Ridgeline","S2000","Shadow"],"Hummer":["H1","H2","H3"],"Husqvarna":["FC 450","Norden 901","Svartpilen","Vitpilen"],"Hyundai":["Accent","Azera","Elantra","Entourage","Equus","Excel","Genesis","Genesis Coupe","Ioniq 5","Ioniq 6","Kona","Nexo","Palisade","Pony","Santa Cruz","Santa Fe","Scoupe","Sonata","Stellar","Tiburon","Tucson","Veloster","Venue","Veracruz","XG300","XG350"],"Indian":["Challenger","Chieftain","Chief","FTR","Pursuit","Roadmaster","Scout","Springfield"],"Infiniti":["EX","FX","G20","G35","G37","I30","I35","J30","JX","M","M30","Q40","Q50","Q60","Q70","QX","QX30","QX4","QX50","QX55","QX60","QX70","QX80"],"International":["CV Series","DuraStar","HV Series","HX Series","LoneStar","LT Series","MV Series","ProStar","RH Series","WorkStar"],"Isuzu":["Amigo","Ascender","Axiom","D-Max","F-Series","Hombre","i-Series","i-Mark","Impulse","N-Series","Oasis","Pickup","Rodeo","Stylus","Trooper","VehiCROSS"],"Jaguar":["E-PACE","F-PACE","F-TYPE","I-PACE","S-Type","X-Type","XE","XF","XJ","XJ-S","XJ6","XJ8","XJR","XK","XK8","XKR"],"Jeep":["Cherokee","CJ","Comanche","Commander","Compass","Gladiator","Grand Cherokee","Grand Commander","Grand Wagoneer","Jeepster","Liberty","Patriot","Renegade","Wagoneer","Wrangler","Wrangler 4xe"],"Kawasaki":["Concours","Eliminator","EX500","GPZ","KLR650","Ninja","Versys","Voyager","Vulcan","Z Series","ZX Series"],"Kenworth":["C500","K270","K370","T280","T380","T480","T680","T800","T880","W900","W990"],"Kia":["Amanti","Borrego","Cadenza","Carnival","EV6","EV9","Forte","K5","K900","Magentis","Niro","Optima","Rio","Rondo","Sedona","Seltos","Sephia","Sorento","Soul","Spectra","Spectra5","Sportage","Stinger","Telluride"],"KTM":["Adventure Series","Duke Series","EXC-F Series","RC Series"],"Land Rover":["Defender","Discovery","Discovery Sport","Freelander","LR2","LR3","LR4","Range Rover","Range Rover Evoque","Range Rover Sport","Range Rover Velar"],"Lexus":["CT","ES","GS","GX","HS","IS","LC","LFA","LS","LX","NX","RC","RX","RZ","SC","TX"],"Lincoln":["Aviator","Blackwood","Continental","Corsair","LS","Mark LT","Mark VII","Mark VIII","MKS","MKT","MKX","MKZ","Nautilus","Navigator","Town Car","Versailles","Zephyr"],"Lucid":["Air"],"Mack":["Anthem","Granite","LR","MD Series","Pinnacle","TerraPro"],"Maserati":["Biturbo","Coupe","Ghibli","GranSport","GranTurismo","Grecale","Levante","MC20","Quattroporte","Spyder"],"Mazda":["323","626","929","B-Series","CX-3","CX-30","CX-5","CX-50","CX-7","CX-9","CX-90","GLC","Mazda3","Mazda5","Mazda6","Millenia","MPV","MX-3","MX-5 Miata","MX-6","Navajo","Protege","Protege5","RX-7","RX-8","Tribute"],"Mercedes-Benz":["190-Class","300-Class","400-Class","500-Class","600-Class","A-Class","AMG GT","B-Class","C-Class","CL-Class","CLA","CLK-Class","CLS","E-Class","eSprinter","EQB","EQE","EQS","G-Class","GL-Class","GLA","GLB","GLC","GLE","GLK-Class","GLS","M-Class","Metris","R-Class","S-Class","SL-Class","SLK-Class","SLR McLaren","SLS AMG","Sprinter"],"Mercury":["Bobcat","Capri","Comet","Cougar","Grand Marquis","Lynx","Marauder","Mariner","Marquis","Milan","Monarch","Montego","Mountaineer","Mystique","Sable","Topaz","Tracer","Villager","Zephyr"],"Mini":["Clubman","Convertible","Countryman","Hardtop"],"Mitsubishi":["3000GT","Cordia","Diamante","Eclipse","Eclipse Cross","Endeavor","Expo","Galant","i-MiEV","Lancer","Mirage","Mirage G4","Montero","Montero Sport","Outlander","Outlander PHEV","Outlander Sport","Precis","Raider","Sigma","Starion","Tredia"],"Mitsubishi Fuso":["Canter","eCanter","FA/FI Series","FE/FG Series"],"Moto Guzzi":["V100 Mandello","V7","V85 TT","V9"],"MV Agusta":["Brutale","Dragster","F3","Turismo Veloce"],"Nissan":["200SX","240SX","280ZX","300ZX","350Z","370Z","Altima","Ariya","Armada","Axxess","Cube","Frontier","GT-R","Juke","Kicks","Leaf","Maxima","Murano","NV","NV200","NX","Pathfinder","Pulsar","Quest","Rogue","Sentra","Sentra SE-R","Stanza","Titan","Titan XD","Van","Versa","Xterra","Z"],"Norton":["Commando 961","V4SV"],"Peterbilt":["220","325","330","337","348","365","367","389","520","536","537","548","567","579","589"],"Piaggio":["Beverly","Liberty","MP3"],"Polestar":["Polestar 1","Polestar 2","Polestar 3"],"Pontiac":["1000","6000","Astre","Aztek","Bonneville","Catalina","Fiero","Firebird","G3","G5","G6","G8","Grand Am","Grand Prix","GTO","J2000 Sunbird","LeMans","Montana","Parisienne","Phoenix","Safari","Solstice","Sunbird","Sunfire","T1000","Tempest","Torrent","Trans Sport","Vibe"],"Porsche":["718 Boxster","718 Cayman","911","912","914","918 Spyder","924","928","944","968","Carrera GT","Cayenne","Macan","Panamera","Taycan"],"Ram":["1500","2500","3500","4500","5500","Chassis Cab","ProMaster","ProMaster City"],"Rivian":["R1S","R1T"],"Royal Enfield":["Classic 350","Continental GT","Himalayan","Interceptor 650"],"Saab":["9-2X","9-3","9-4X","9-5","9-7X","99","900","9000"],"Saturn":["Astra","Aura","Ion","L-Series","Outlook","Relay","S-Series","Sky","Vue"],"Scion":["FR-S","iA","iM","iQ","tC","xA","xB","xD"],"Subaru":["Ascent","B9 Tribeca","Baja","BRZ","Crosstrek","DL","Forester","GL","GL-10","Impreza","Justy","Legacy","Loyale","Outback","RX","Solterra","Standard","SVX","Tribeca","WRX","XT","XT6"],"Suzuki":["Aerio","DR-Z400S","Equator","Esteem","Forenza","Forsa","Grand Vitara","GSX-R Series","Hayabusa","Katana","Kizashi","Reno","Samurai","Sidekick","SJ410","SJ413","SV650","Swift","SX4","V-Strom","Verona","Vitara","X-90","XL7"],"Tesla":["Cybertruck","Model 3","Model S","Model X","Model Y","Roadster","Semi"],"Toyota":["4Runner","86","Avalon","bZ4X","C-HR","Camry","Celica","Corona","Corolla","Corolla Cross","Corolla Hatchback","Corolla iM","Cressida","Crown","Echo","FJ Cruiser","GR Corolla","GR Supra","GR86","Grand Highlander","Highlander","Land Cruiser","Matrix","Mirai","MR2 / MR2 Spyder","Paseo","Previa","Prius","Prius Prime","RAV4","RAV4 Prime","Sequoia","Sienna","Solara","Starlet","Supra","T100","Tacoma","Tercel","Tundra","Van","Venza","Yaris"],"Triumph":["Bonneville","Daytona","Rocket 3","Scrambler","Speed Four","Speed Triple","Sprint","Street Triple","Tiger","Trident","TT600"],"Vespa":["GTS","Primavera","Sprint"],"Volkswagen":["Arteon","Atlas","Atlas Cross Sport","Beetle","Cabrio","CC","Corrado","Dasher","Eos","EuroVan","Fox","Golf","Golf R","GTI","ID.4","Jetta","Jetta GLI","New Beetle","Passat","Phaeton","Quantum","Rabbit","Routan","Scirocco","Taos","Thing","Tiguan","Touareg","Vanagon"],"Volvo":["240","260","740","760","780","850","940","960","C30","C40 Recharge","C70","S40","S60","S70","S80","S90","V40","V50","V60","V70","V90","VHD","VNL","VNR","XC40","XC60","XC70","XC90"],"Yamaha":["Bolt","FZ Series","FZR Series","MT Series","Radian","Razz","Riva","Seca","Super Ténéré","Tracer 9","TW200","Virago","VMAX","V Star","XSR Series","YZF-R Series","Zuma"],"Zero Motorcycles":["DSR/X","FXE","SR/F","SR/S"],"Other":["Other"]};
    const vehicleColors = ["Beige", "Black", "Blue", "Brown", "Burgundy", "Charcoal", "Dark Blue", "Dark Green", "Gold", "Gray", "Green", "Light Blue", "Orange", "Red", "Silver", "Tan", "White", "Yellow"].sort();

    // --- STATE MANAGEMENT ---
    const state = {
        users: [],
        reviews: [],
        badges: [],
        userBadges: [],
        reviewVotes: [],
        get originalData() {
            return {
                users: this.users,
                reviews: this.reviews,
                badges: this.badges,
                userBadges: this.userBadges,
                reviewVotes: this.reviewVotes
            }
        },
        filters: {
            username: ''
        },
        sort: {
            users: { key: 'id', direction: 'asc' },
            reviews: { key: 'created_at', direction: 'desc' },
            badges: { key: 'badge_id', direction: 'asc' },
            userBadges: { key: 'earned_at', direction: 'desc' },
            reviewVotes: { key: 'created_at', direction: 'desc' }
        },
        authToken: localStorage.getItem('token'),
        usernameMap: {} // To map user ID to username
    };

    if (localStorage.getItem('isAdmin') !== 'true' && localStorage.getItem('isAdmin') !== '1') {
        window.location.href = 'home.html';
        return;
    }

    const API_URL = 'https://platetraits.com/api';

    // --- UTILITIES ---
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const sortData = (data, sortKey, direction) => {
        return [...data].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];

            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            let comparison = 0;
            if (typeof valA === 'string' && Date.parse(valA) && !isNaN(Date.parse(valA))) {
                // Date string comparison
                comparison = new Date(valA) - new Date(valB);
            } else if (typeof valA === 'string') {
                // Locale-sensitive string comparison
                comparison = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
            } else {
                // Numeric or other types
                comparison = valA > valB ? 1 : -1;
            }

            return direction === 'asc' ? comparison : -comparison;
        });
    };

    // --- GENERIC RENDER ---
    const render = () => {
        const usernameFilter = state.filters.username.toLowerCase();
        let { users, reviews, badges, userBadges, reviewVotes } = state.originalData;

        if (usernameFilter) {
            const matchedUser = state.users.find(u => u.username.toLowerCase() === usernameFilter);
            if (matchedUser) {
                const userId = matchedUser.id;
                users = users.filter(u => u.id === userId);
                reviews = reviews.filter(r => r.user_id === userId);
                userBadges = userBadges.filter(ub => ub.user_id === userId);
                reviewVotes = reviewVotes.filter(rv => rv.user_id === userId);
            } else {
                users = [];
                reviews = [];
                userBadges = [];
                reviewVotes = [];
            }
        }

        // Apply sorting
        users = sortData(users, state.sort.users.key, state.sort.users.direction);
        reviews = sortData(reviews, state.sort.reviews.key, state.sort.reviews.direction);
        badges = sortData(badges, state.sort.badges.key, state.sort.badges.direction);
        userBadges = sortData(userBadges, state.sort.userBadges.key, state.sort.userBadges.direction);
        reviewVotes = sortData(reviewVotes, state.sort.reviewVotes.key, state.sort.reviewVotes.direction);

        // Render tables with filtered and sorted data
        renderUsersTable(users);
        renderReviewsTable(reviews);
        renderBadgesTable(badges);
        renderUserBadgesTable(userBadges);
        renderReviewVotesTable(reviewVotes);

        updateStats(users, reviews, badges, userBadges, reviewVotes);
        updateSortIndicators();
    };

    // --- TABLE-SPECIFIC RENDERERS ---

    const renderTable = (tableBodyId, data, rowRenderer) => {
        const tableBody = document.getElementById(tableBodyId);
        if (!tableBody) return;

        tableBody.innerHTML = '';
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = rowRenderer(item);
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="100%" class="text-center p-4">No data found.</td></tr>`;
        }
    };

    const renderUsersTable = (users) => {
        const userRowRenderer = (user) => `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.username}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.first_name || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(user.created_at).toLocaleDateString()}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 manage-user-btn" data-user-id="${user.id}">Manage</button>
            </td>
        `;
        renderTable('users-table-body', users, userRowRenderer);
    };

    const renderReviewsTable = (reviews) => {
        const reviewRowRenderer = (review) => `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${review.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.plate_number}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${state.usernameMap[review.user_id] || review.user_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.rating}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${review.status}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(review.created_at).toLocaleString()}</td>
        `;
        renderTable('reviews-table-body', reviews, reviewRowRenderer);
    };

    const renderBadgesTable = (badges) => {
        const badgeRowRenderer = (badge) => `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${badge.badge_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${badge.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${badge.description}</td>
        `;
        renderTable('badges-table-body', badges, badgeRowRenderer);
    };

    const renderUserBadgesTable = (userBadges) => {
        const userBadgeRowRenderer = (userBadge) => `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${userBadge.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${state.usernameMap[userBadge.user_id] || userBadge.user_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${userBadge.badge_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(userBadge.earned_at).toLocaleString()}</td>
        `;
        renderTable('user-badges-table-body', userBadges, userBadgeRowRenderer);
    };

    const renderReviewVotesTable = (reviewVotes) => {
        const reviewVoteRowRenderer = (vote) => `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${vote.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vote.review_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${state.usernameMap[vote.user_id] || vote.user_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vote.vote_type}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(vote.created_at).toLocaleString()}</td>
        `;
        renderTable('review-votes-table-body', reviewVotes, reviewVoteRowRenderer);
    };

    // --- STATS ---
    const updateStats = (users, reviews, badges, userBadges, reviewVotes) => {
        document.getElementById('total-users').textContent = users.length;
        document.getElementById('total-reviews').textContent = reviews.length;
        document.getElementById('total-badges').textContent = badges.length;
        document.getElementById('total-user-badges').textContent = userBadges.length;
        document.getElementById('total-votes').textContent = reviewVotes.length;
    };

    // --- UI UPDATES ---
    const updateSortIndicators = () => {
        document.querySelectorAll('.sortable').forEach(header => {
            const tableKey = header.dataset.table;
            const sortKey = header.dataset.sortKey;
            header.classList.remove('asc', 'desc');
            if (state.sort[tableKey] && state.sort[tableKey].key === sortKey) {
                header.classList.add(state.sort[tableKey].direction);
            }
        });
    };

    // --- DATA FETCHING ---
    const fetchData = async (endpoint, stateKey) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: { 'Authorization': `Bearer ${state.authToken}` }
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || `Failed to fetch ${endpoint}`);
            }
            state[stateKey] = await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            const tableBodyId = `${stateKey}-table-body`;
            const tableBody = document.getElementById(tableBodyId);
            if(tableBody) {
                tableBody.innerHTML = `<tr><td colspan="100%" class="text-center p-4 text-red-600">Error: ${error.message}</td></tr>`;
            }
        }
    };

    // --- MODAL LOGIC ---
    const populateVehicleDropdowns = (user) => {
        const makeSelect = document.getElementById('modal-vehicle-make');
        const modelSelect = document.getElementById('modal-vehicle-model');
        const yearSelect = document.getElementById('modal-vehicle-year');
        const colorSelect = document.getElementById('modal-vehicle-color');

        makeSelect.innerHTML = '<option value="">Select Make</option>' + vehicleMakes.map(make => `<option value="${make}">${make}</option>`).join('');
        colorSelect.innerHTML = '<option value="">Select Color</option>' + vehicleColors.map(color => `<option value="${color}">${color}</option>`).join('');

        const yearOptions = ['<option value="">Select Year</option>'];
        const endYear = new Date().getFullYear() + 1;
        for (let year = endYear; year >= 1900; year--) {
            yearOptions.push(`<option value="${year}">${year}</option>`);
        }
        yearSelect.innerHTML = yearOptions.join('');

        makeSelect.value = user.current_vehicle_make || '';
        colorSelect.value = user.current_vehicle_color || '';
        yearSelect.value = user.current_vehicle_year || '';

        const updateModels = () => {
            const selectedMake = makeSelect.value;
            const models = vehicleModels[selectedMake] || [];
            modelSelect.innerHTML = '<option value="">Select Model</option>' + models.map(model => `<option value="${model}">${model}</option>`).join('');
            modelSelect.disabled = !selectedMake;
            modelSelect.value = user.current_vehicle_model || '';
        };

        makeSelect.addEventListener('change', updateModels);
        updateModels(); // Initial population
    };

    const populateBioBuilder = (user) => {
        const templateSelect = document.getElementById('modal-bio-template');
        const wordsContainer = document.getElementById('modal-bio-words-container');

        templateSelect.innerHTML = commentBuilderData.templates.map((template, index) => `<option value="${index}">${template}</option>`).join('');

        const updateBioWords = () => {
            const templateIndex = templateSelect.value;
            const selectedTemplate = commentBuilderData.templates[templateIndex];
            const placeholders = selectedTemplate.match(/_____/g) || [];
            wordsContainer.innerHTML = '';

            placeholders.forEach((_, i) => {
                const wordSelectHtml = `
                    <select name="bio_word_${i}" class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm">
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
                `;
                wordsContainer.insertAdjacentHTML('beforeend', wordSelectHtml);
            });

            // Set selected words if bio exists
            if (user.bio && user.bio.template == templateIndex && user.bio.words) {
                 const wordSelects = wordsContainer.querySelectorAll('select');
                 wordSelects.forEach((select, index) => {
                    if (user.bio.words[index]) {
                        select.value = user.bio.words[index];
                    }
                 });
            }
        };

        templateSelect.addEventListener('change', updateBioWords);
        if (user.bio && user.bio.template) {
            templateSelect.value = user.bio.template;
        }
        updateBioWords();
    };

    const openManageUserModal = (userId) => {
        const modal = document.getElementById('manage-user-modal');
        const user = state.users.find(u => u.id === userId);
        if (!user) return;

        modal.dataset.userId = userId;

        document.getElementById('modal-username').textContent = user.username;
        document.getElementById('modal-first-name').value = user.first_name || '';
        document.getElementById('modal-email').value = user.email || '';
        document.getElementById('modal-is-admin').checked = user.is_admin;
        document.getElementById('modal-new-password').value = '';

        populateVehicleDropdowns(user);
        populateBioBuilder(user);

        const badgeSelect = document.getElementById('modal-badge-select');
        badgeSelect.innerHTML = '<option value="">Select a badge to award...</option>';
        state.badges.forEach(badge => {
            const option = document.createElement('option');
            option.value = badge.badge_id;
            option.textContent = `${badge.name} (${badge.badge_id})`;
            badgeSelect.appendChild(option);
        });

        const userBadgesContainer = document.getElementById('modal-user-badges');
        userBadgesContainer.innerHTML = '';
        const usersBadges = state.userBadges.filter(ub => ub.user_id === userId);
        if (usersBadges.length > 0) {
            usersBadges.forEach(userBadge => {
                const badgeData = state.badges.find(b => b.badge_id === userBadge.badge_id);
                const badgeEl = document.createElement('div');
                badgeEl.className = 'flex items-center px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-sm';
                badgeEl.innerHTML = `
                    <span>${badgeData ? badgeData.name : userBadge.badge_id}</span>
                    <button class="ml-2 text-red-500 hover:text-red-800 remove-badge-btn" data-user-id="${userId}" data-badge-id="${userBadge.badge_id}">&times;</button>
                `;
                userBadgesContainer.appendChild(badgeEl);
            });
        } else {
            userBadgesContainer.innerHTML = '<p class="text-sm text-gray-500">This user has no badges.</p>';
        }

        document.getElementById('edit-user-message').textContent = '';
        document.getElementById('award-badge-message').textContent = '';

        modal.classList.remove('hidden');
    };

    const closeModal = () => {
        document.getElementById('manage-user-modal').classList.add('hidden');
    };

    const handleSaveUser = async () => {
        const modal = document.getElementById('manage-user-modal');
        const userId = modal.dataset.userId;
        const messageEl = document.getElementById('edit-user-message');

        const bioTemplate = document.getElementById('modal-bio-template').value;
        const bioWordNodes = document.querySelectorAll('#modal-bio-words-container select');
        const bioWords = Array.from(bioWordNodes).map(select => select.value);

        const updatedUser = {
            first_name: document.getElementById('modal-first-name').value,
            email: document.getElementById('modal-email').value,
            is_admin: document.getElementById('modal-is-admin').checked,
            current_vehicle_make: document.getElementById('modal-vehicle-make').value,
            current_vehicle_model: document.getElementById('modal-vehicle-model').value,
            current_vehicle_year: document.getElementById('modal-vehicle-year').value,
            current_vehicle_color: document.getElementById('modal-vehicle-color').value,
            bio: {
                template: bioTemplate,
                words: bioWords
            }
        };

        const newPassword = document.getElementById('modal-new-password').value;
        if (newPassword) {
            updatedUser.password = newPassword;
        }

        messageEl.textContent = 'Saving...';
        messageEl.className = 'text-sm mt-2 text-gray-500';

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.authToken}`
                },
                body: JSON.stringify(updatedUser)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to save user.');
            }

            messageEl.textContent = 'User saved successfully!';
            messageEl.className = 'text-sm mt-2 text-green-600';

            // Re-fetch users data to get the most up-to-date info and re-render everything
            await fetchData('/users', 'users');
            render();

        } catch (error) {
            messageEl.textContent = `Error: ${error.message}`;
            messageEl.className = 'text-sm mt-2 text-red-600';
        }
    };

    const handleRemoveBadge = async (e) => {
        const button = e.target;
        const userId = button.dataset.userId;
        const badgeId = button.dataset.badgeId;
        const messageEl = document.getElementById('award-badge-message');

        if (!confirm(`Are you sure you want to remove badge ${badgeId} from user ${userId}?`)) {
            return;
        }

        messageEl.textContent = 'Removing...';
        messageEl.className = 'text-sm mt-2 text-gray-500';

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/badges/${badgeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${state.authToken}`
                }
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to remove badge.');
            }

            messageEl.textContent = 'Badge removed successfully!';
            messageEl.className = 'text-sm mt-2 text-green-600';

            // Re-fetch user badges and re-render the modal content
            await fetchData('/user_badges', 'userBadges');
            openManageUserModal(parseInt(userId, 10));

        } catch (error) {
            messageEl.textContent = `Error: ${error.message}`;
            messageEl.className = 'text-sm mt-2 text-red-600';
        }
    };

    const handleAwardBadge = async () => {
        const modal = document.getElementById('manage-user-modal');
        const userId = modal.dataset.userId;
        const messageEl = document.getElementById('award-badge-message');
        const badgeSelect = document.getElementById('modal-badge-select');
        const badgeId = badgeSelect.value;

        if (!badgeId) {
            messageEl.textContent = 'Please select a badge.';
            messageEl.className = 'text-sm mt-2 text-red-600';
            return;
        }

        messageEl.textContent = 'Awarding...';
        messageEl.className = 'text-sm mt-2 text-gray-500';

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/badges`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.authToken}`
                },
                body: JSON.stringify({ badge_id: badgeId })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to award badge.');
            }

            messageEl.textContent = 'Badge awarded successfully!';
            messageEl.className = 'text-sm mt-2 text-green-600';

            // Re-fetch user badges and re-render the modal content to show the new badge
            await fetchData('/user_badges', 'userBadges');
            openManageUserModal(parseInt(userId, 10));

        } catch (error) {
            messageEl.textContent = `Error: ${error.message}`;
            messageEl.className = 'text-sm mt-2 text-red-600';
        }
    };

    // --- INITIALIZATION ---
    const init = async () => {
        // Fetch all data in parallel
        await Promise.all([
            fetchData('/users', 'users'),
            fetchData('/admin/reviews', 'reviews'),
            fetchData('/badges', 'badges'),
            fetchData('/user_badges', 'userBadges'),
            fetchData('/review_votes', 'reviewVotes')
        ]);

        // Create a map of user IDs to usernames
        state.users.forEach(user => {
            state.usernameMap[user.id] = user.username;
        });

        // Add event listeners
        const userFilterInput = document.getElementById('user-filter');
        const suggestionsContainer = document.getElementById('autocomplete-suggestions');

        const renderAutocomplete = () => {
            const value = userFilterInput.value.toLowerCase();
            suggestionsContainer.innerHTML = '';
            if (!value) {
                suggestionsContainer.classList.add('hidden');
                return;
            }

            const suggestions = state.users
                .filter(user => user.username.toLowerCase().includes(value))
                .slice(0, 10); // Limit to 10 suggestions

            if (suggestions.length > 0) {
                suggestions.forEach(user => {
                    const item = document.createElement('div');
                    item.className = 'p-2 hover:bg-gray-100 cursor-pointer';
                    item.textContent = user.username;
                    item.addEventListener('click', () => {
                        userFilterInput.value = user.username;
                        state.filters.username = user.username;
                        suggestionsContainer.classList.add('hidden');
                        render();
                    });
                    suggestionsContainer.appendChild(item);
                });
                suggestionsContainer.classList.remove('hidden');
            } else {
                suggestionsContainer.classList.add('hidden');
            }
        };

        userFilterInput.addEventListener('input', debounce(renderAutocomplete, 300));

        userFilterInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                state.filters.username = e.target.value.trim();
                suggestionsContainer.classList.add('hidden');
                render();
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!userFilterInput.contains(e.target)) {
                suggestionsContainer.classList.add('hidden');
            }
        });

        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const tableKey = header.dataset.table;
                const sortKey = header.dataset.sortKey;
                const currentSort = state.sort[tableKey];

                if (currentSort.key === sortKey) {
                    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSort.key = sortKey;
                    currentSort.direction = 'asc';
                }
                render();
            });
        });

        // Modal Listeners
        const showPasswordToggle = document.getElementById('modal-show-password-toggle');
        const newPasswordInput = document.getElementById('modal-new-password');

        if (showPasswordToggle && newPasswordInput) {
            showPasswordToggle.addEventListener('change', () => {
                newPasswordInput.type = showPasswordToggle.checked ? 'text' : 'password';
            });
        }

        document.getElementById('users-table-body').addEventListener('click', (e) => {
            if (e.target.classList.contains('manage-user-btn')) {
                const userId = parseInt(e.target.dataset.userId, 10);
                openManageUserModal(userId);
            }
        });
        document.getElementById('close-modal-btn').addEventListener('click', closeModal);
        document.getElementById('save-user-btn').addEventListener('click', handleSaveUser);
        document.getElementById('award-badge-btn').addEventListener('click', handleAwardBadge);
        document.getElementById('modal-user-badges').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-badge-btn')) {
                handleRemoveBadge(e);
            }
        });

        // Initial render
        render();

        // Handle username from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const usernameFromUrl = urlParams.get('username');
        if (usernameFromUrl) {
            userFilterInput.value = usernameFromUrl;
            state.filters.username = usernameFromUrl;
            render();
        }
    };

    init();
});
