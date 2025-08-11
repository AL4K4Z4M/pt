require('dotenv').config(); // Uses symlinked .env in same folder

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in your .env file.");
    process.exit(1);
}

const saltRounds = 10;

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Vehicle data required for badge logic
const vehicleSubtype = {"Acura":{"ILX":"Sedan","Integra":"Sedan","MDX":"SUV","NSX":"Sports Car","RDX":"SUV","RL":"Sedan","RLX":"Sedan","TLX":"Sedan","ZDX":"SUV"},"Alfa Romeo":{"Giulia":"Sedan","Stelvio":"SUV","Tonale":"SUV"},"Aprilia":{"RS 660":"Sport Bike","RSV4":"Sport Bike","Tuareg 660":"Adventure Bike","Tuono":"Sport Bike"},"Audi":{"A3":"Sedan","A4":"Sedan","A5":"Coupe","A6":"Sedan","A7":"Sedan","A8":"Sedan","e-tron":"SUV","e-tron GT":"Sedan","Q3":"SUV","Q4 e-tron":"SUV","Q5":"SUV","Q7":"SUV","Q8":"SUV","R8":"Sports Car","RS 3":"Sedan","RS 5":"Coupe","RS 6":"Wagon","RS 7":"Sedan","S3":"Sedan","S4":"Sedan","S5":"Coupe","TT":"Coupe"},"BMW":{"2 Series":"Coupe","3 Series":"Sedan","4 Series":"Coupe","5 Series":"Sedan","7 Series":"Sedan","8 Series":"Coupe","i4":"Sedan","i7":"Sedan","iX":"SUV","M2":"Coupe","M3":"Sedan","M4":"Coupe","M5":"Sedan","M8":"Coupe","R 1250 GS":"Adventure Bike","S 1000 RR":"Sport Bike","X1":"SUV","X2":"SUV","X3":"SUV","X4":"SUV","X5":"SUV","X6":"SUV","X7":"SUV","Z4":"Convertible"},"Buell":{"Firebolt":"Sport Bike","Lightning":"Standard Motorcycle","Ulysses":"Adventure Bike"},"Buick":{"Cascada":"Convertible","Century":"Sedan","Enclave":"SUV","Encore":"SUV","Encore GX":"SUV","Envision":"SUV","LaCrosse":"Sedan","LeSabre":"Sedan","Lucerne":"Sedan","Park Avenue":"Sedan","Rainier":"SUV","Regal":"Sedan","Rendezvous":"SUV","Verano":"Sedan"},"Cadillac":{"ATS":"Sedan","Celestiq":"Sedan","CT4":"Sedan","CT5":"Sedan","CT6":"Sedan","CTS":"Sedan","DeVille":"Sedan","DTS":"Sedan","Escalade":"SUV","Lyriq":"SUV","Seville":"Sedan","STS":"Sedan","XLR":"Convertible","XT4":"SUV","XT5":"SUV","XT6":"SUV"},"Can-Am":{"Defender":"UTV/Side-by-Side","Maverick":"UTV/Side-by-Side","Ryker":"Three-Wheeled Motorcycle","Spyder":"Three-Wheeled Motorcycle"},"Chevrolet":{"Astro":"Minivan","Avalanche":"Pickup Truck","Aveo":"Sedan","Beretta":"Coupe","Blazer":"SUV","Blazer EV":"SUV","Bolt EUV":"SUV","Bolt EV":"Hatchback","Camaro":"Coupe","Caprice":"Sedan","Captiva Sport":"SUV","Cavalier":"Sedan","Celebrity":"Sedan","Chevelle":"Coupe","Chevy II / Nova":"Sedan","City Express":"Cargo Van","Cobalt":"Sedan","Colorado":"Pickup Truck","Corsica":"Sedan","Corvette":"Sports Car","Cruze":"Sedan","El Camino":"Pickup Truck","Equinox":"SUV","Equinox EV":"SUV","Express":"Cargo Van","HHR":"Wagon","Impala":"Sedan","Low Cab Forward":"Commercial Truck","Lumina":"Sedan","Malibu":"Sedan","Metro":"Hatchback","Monte Carlo":"Coupe","Prizm":"Sedan","S-10":"Pickup Truck","Silverado 1500":"Pickup Truck","Silverado 2500HD":"Pickup Truck","Silverado 3500HD":"Pickup Truck","Silverado 4500HD":"Commercial Truck","Silverado 5500HD":"Commercial Truck","Silverado 6500HD":"Commercial Truck","Silverado EV":"Pickup Truck","Sonic":"Sedan","Spark":"Hatchback","SSR":"Pickup Truck","Suburban":"SUV","Tahoe":"SUV","Tracker":"SUV","TrailBlazer":"SUV","Traverse":"SUV","Trax":"SUV","Uplander":"Minivan","Venture":"Minivan","Volt":"Sedan"},"Chrysler":{"200":"Sedan","300":"Sedan","Aspen":"SUV","Concorde":"Sedan","Crossfire":"Coupe","Grand Voyager":"Minivan","Imperial":"Sedan","LHS":"Sedan","New Yorker":"Sedan","Pacifica":"Minivan","PT Cruiser":"Wagon","Sebring":"Sedan","Town & Country":"Minivan","Voyager":"Minivan"},"Dodge":{"Attitude":"Sedan","Avenger":"Sedan","Caliber":"Hatchback","Caravan":"Minivan","Challenger":"Coupe","Challenger SRT Demon / 170":"Coupe","Challenger SRT Hellcat":"Coupe","Charger":"Sedan","Charger Daytona":"Sedan","Charger SRT Hellcat":"Sedan","Dakota":"Pickup Truck","Dart":"Sedan","Durango":"SUV","Durango SRT / Hellcat":"SUV","Grand Caravan":"Minivan","Hornet":"SUV","Intrepid":"Sedan","Journey":"SUV","Magnum":"Wagon","Neon / SRT-4":"Sedan","Nitro":"SUV","Ram Van / B-series":"Cargo Van","Spirit":"Sedan","Stealth":"Coupe","Stratus":"Sedan","Viper":"Sports Car"},"Ducati":{"Diavel":"Cruiser","Hypermotard":"Standard Motorcycle","Monster":"Standard Motorcycle","Multistrada":"Adventure Bike","Panigale":"Sport Bike","Scrambler":"Standard Motorcycle","Streetfighter":"Standard Motorcycle"},"Fiat":{"124 Spider":"Convertible","500":"Hatchback","500L":"Wagon","500X":"SUV"},"Ford":{"Aerostar":"Minivan","Aspire":"Hatchback","Bronco":"SUV","Bronco Sport":"SUV","C-Max":"Wagon","Contour":"Sedan","Crown Victoria":"Sedan","E-Series":"Cargo Van","E-Transit":"Cargo Van","EcoSport":"SUV","Edge":"SUV","Escape":"SUV","Escort":"Sedan","Excursion":"SUV","Expedition":"SUV","Explorer":"SUV","F-150":"Pickup Truck","F-150 Lightning":"Pickup Truck","F-250 Super Duty":"Pickup Truck","F-350 Super Duty":"Pickup Truck","F-450 Super Duty":"Pickup Truck","F-550 Super Duty":"Commercial Truck","F-650":"Commercial Truck","F-750":"Commercial Truck","Festiva":"Hatchback","Fiesta":"Hatchback","Five Hundred":"Sedan","Flex":"SUV","Focus":"Sedan","Freestar":"Minivan","Freestyle":"SUV","Fusion":"Sedan","GT":"Sports Car","Maverick":"Pickup Truck","Mustang":"Coupe","Mustang Mach-E":"SUV","Probe":"Coupe","Ranger":"Pickup Truck","Taurus":"Sedan","Taurus X":"SUV","Thunderbird":"Convertible","Transit":"Cargo Van","Transit Connect":"Cargo Van","Windstar":"Minivan"},"Freightliner":{"108SD":"Commercial Truck","114SD":"Commercial Truck","122SD":"Commercial Truck","Cascadia":"Commercial Truck","Columbia":"Commercial Truck","Coronado":"Commercial Truck","EconicSD":"Commercial Truck","M2 106":"Commercial Truck","M2 112":"Commercial Truck"},"Genesis":{"G70":"Sedan","G80":"Sedan","G90":"Sedan","GV60":"SUV","GV70":"SUV","GV80":"SUV"},"GMC":{"Acadia":"SUV","Canyon":"Pickup Truck","Envoy":"SUV","Hummer EV":"Pickup Truck","Jimmy":"SUV","Safari":"Minivan","Savana":"Cargo Van","Sierra 1500":"Pickup Truck","Sierra 2500HD":"Pickup Truck","Sierra 3500HD":"Pickup Truck","Sierra 4500HD":"Commercial Truck","Sierra 5500HD":"Commercial Truck","Sierra 6500HD":"Commercial Truck","Sonoma":"Pickup Truck","Syclone":"Pickup Truck","Terrain":"SUV","TopKick":"Commercial Truck","Typhoon":"SUV","Yukon":"SUV","Yukon XL":"SUV"},"Harley-Davidson":{"CVO":"Touring Bike","LiveWire":"Standard Motorcycle","Pan America":"Adventure Bike","Road Glide":"Touring Bike","Softail":"Cruiser","Sportster":"Cruiser","Street Glide":"Touring Bike","Trike":"Three-Wheeled Motorcycle"},"Hino":{"155":"Commercial Truck","195":"Commercial Truck","238":"Commercial Truck","258":"Commercial Truck","268":"Commercial Truck","338":"Commercial Truck","L Series":"Commercial Truck","M Series":"Commercial Truck","XL Series":"Commercial Truck"},"Honda":{"Accord":"Sedan","Accord Hybrid":"Sedan","Africa Twin":"Adventure Bike","CBR Series":"Sport Bike","Civic":"Sedan","Civic Si":"Sedan","Civic Type R":"Hatchback","Clarity":"Sedan","CR-V":"SUV","CR-V Hybrid":"SUV","CR-Z":"Hatchback","CRF Series":"Dual-Sport","CRX":"Hatchback","Del Sol":"Convertible","Element":"SUV","Fit":"Hatchback","Gold Wing":"Touring Bike","Grom":"Standard Motorcycle","HR-V":"SUV","Insight":"Sedan","Odyssey":"Minivan","Passport":"SUV","Pilot":"SUV","Prelude":"Coupe","Prologue":"SUV","Ridgeline":"Pickup Truck","S2000":"Convertible","Shadow":"Cruiser"},"Hummer":{"H1":"SUV","H2":"SUV","H3":"SUV"},"Husqvarna":{"FC 450":"Motocross/Off-road","Norden 901":"Adventure Bike","Svartpilen":"Standard Motorcycle","Vitpilen":"Standard Motorcycle"},"Hyundai":{"Accent":"Sedan","Azera":"Sedan","Elantra":"Sedan","Entourage":"Minivan","Equus":"Sedan","Genesis":"Sedan","Genesis Coupe":"Coupe","Ioniq 5":"SUV","Ioniq 6":"Sedan","Kona":"SUV","Nexo":"SUV","Palisade":"SUV","Santa Cruz":"Pickup Truck","Santa Fe":"SUV","Sonata":"Sedan","Tiburon":"Coupe","Tucson":"SUV","Veloster":"Hatchback","Venue":"SUV","Veracruz":"SUV"},"Indian":{"Challenger":"Touring Bike","Chieftain":"Touring Bike","Chief":"Cruiser","FTR":"Standard Motorcycle","Scout":"Cruiser","Springfield":"Touring Bike"},"Infiniti":{"EX":"SUV","FX":"SUV","G20":"Sedan","G35":"Sedan","G37":"Coupe","I30":"Sedan","I35":"Sedan","JX":"SUV","M":"Sedan","Q40":"Sedan","Q50":"Sedan","Q60":"Coupe","Q70":"Sedan","QX30":"SUV","QX4":"SUV","QX50":"SUV","QX55":"SUV","QX60":"SUV","QX70":"SUV","QX80":"SUV"},"International":{"CV Series":"Commercial Truck","DuraStar":"Commercial Truck","HV Series":"Commercial Truck","HX Series":"Commercial Truck","LoneStar":"Commercial Truck","LT Series":"Commercial Truck","MV Series":"Commercial Truck","ProStar":"Commercial Truck","RH Series":"Commercial Truck","WorkStar":"Commercial Truck"},"Isuzu":{"Ascender":"SUV","Axiom":"SUV","D-Max":"Pickup Truck","F-Series":"Commercial Truck","Hombre":"Pickup Truck","i-Series":"Pickup Truck","N-Series":"Commercial Truck","Oasis":"Minivan","Rodeo":"SUV","Stylus":"Sedan","Trooper":"SUV"},"Jaguar":{"E-PACE":"SUV","F-PACE":"SUV","F-TYPE":"Sports Car","I-PACE":"SUV","S-Type":"Sedan","X-Type":"Sedan","XE":"Sedan","XF":"Sedan","XJ":"Sedan","XK":"Coupe"},"Jeep":{"Cherokee":"SUV","Commander":"SUV","Compass":"SUV","Gladiator":"Pickup Truck","Grand Cherokee":"SUV","Grand Wagoneer":"SUV","Liberty":"SUV","Patriot":"SUV","Renegade":"SUV","Wagoneer":"SUV","Wrangler":"SUV","Wrangler 4xe":"SUV"},"Kawasaki":{"Concours":"Touring Bike","KLR650":"Dual-Sport","Ninja":"Sport Bike","Versys":"Adventure Bike","Vulcan":"Cruiser","Z Series":"Standard Motorcycle"},"Kenworth":{"C500":"Commercial Truck","K270":"Commercial Truck","K370":"Commercial Truck","T280":"Commercial Truck","T380":"Commercial Truck","T480":"Commercial Truck","T680":"Commercial Truck","T800":"Commercial Truck","T880":"Commercial Truck","W900":"Commercial Truck","W990":"Commercial Truck"},"Kia":{"Amanti":"Sedan","Borrego":"SUV","Cadenza":"Sedan","Carnival":"Minivan","EV6":"SUV","EV9":"SUV","Forte":"Sedan","K5":"Sedan","K900":"Sedan","Niro":"SUV","Optima":"Sedan","Rio":"Sedan","Rondo":"Wagon","Sedona":"Minivan","Seltos":"SUV","Sephia":"Sedan","Sorento":"SUV","Soul":"Wagon","Spectra":"Sedan","Sportage":"SUV","Stinger":"Sedan","Telluride":"SUV"},"KTM":{"Adventure Series":"Adventure Bike","Duke Series":"Standard Motorcycle","EXC-F Series":"Dual-Sport","RC Series":"Sport Bike"},"Land Rover":{"Defender":"SUV","Discovery":"SUV","Discovery Sport":"SUV","Freelander":"SUV","LR2":"SUV","LR3":"SUV","LR4":"SUV","Range Rover":"SUV","Range Rover Evoque":"SUV","Range Rover Sport":"SUV","Range Rover Velar":"SUV"},"Lexus":{"CT":"Hatchback","ES":"Sedan","GS":"Sedan","GX":"SUV","HS":"Sedan","IS":"Sedan","LC":"Coupe","LFA":"Sports Car","LS":"Sedan","LX":"SUV","NX":"SUV","RC":"Coupe","RX":"SUV","RZ":"SUV","SC":"Convertible","TX":"SUV"},"Lincoln":{"Aviator":"SUV","Blackwood":"Pickup Truck","Continental":"Sedan","Corsair":"SUV","LS":"Sedan","Mark LT":"Pickup Truck","Mark VIII":"Coupe","MKS":"Sedan","MKT":"SUV","MKX":"SUV","MKZ":"Sedan","Nautilus":"SUV","Navigator":"SUV","Town Car":"Sedan","Zephyr":"Sedan"},"Lucid":{"Air":"Sedan"},"Mack":{"Anthem":"Commercial Truck","Granite":"Commercial Truck","LR":"Commercial Truck","MD Series":"Commercial Truck","Pinnacle":"Commercial Truck","TerraPro":"Commercial Truck"},"Maserati":{"Ghibli":"Sedan","GranTurismo":"Coupe","Grecale":"SUV","Levante":"SUV","MC20":"Sports Car","Quattroporte":"Sedan"},"Mazda":{"2":"Hatchback","3":"Sedan","5":"Minivan","6":"Sedan","626":"Sedan","CX-3":"SUV","CX-30":"SUV","CX-5":"SUV","CX-50":"SUV","CX-7":"SUV","CX-9":"SUV","CX-90":"SUV","Mazda3":"Sedan","Mazda5":"Minivan","Mazda6":"Sedan","Millenia":"Sedan","MPV":"Minivan","MX-3":"Coupe","MX-5 Miata":"Convertible","MX-6":"Coupe","Protege":"Sedan","RX-7":"Sports Car","RX-8":"Coupe","Tribute":"SUV"},"Mercedes-Benz":{"A-Class":"Sedan","AMG GT":"Sports Car","B-Class":"Hatchback","C-Class":"Sedan","CL-Class":"Coupe","CLA":"Sedan","CLK-Class":"Coupe","CLS":"Sedan","E-Class":"Sedan","eSprinter":"Cargo Van","EQB":"SUV","EQE":"Sedan","EQS":"Sedan","G-Class":"SUV","GL-Class":"SUV","GLA":"SUV","GLB":"SUV","GLC":"SUV","GLE":"SUV","GLK-Class":"SUV","GLS":"SUV","M-Class":"SUV","Metris":"Cargo Van","R-Class":"Minivan","S-Class":"Sedan","SL-Class":"Convertible","SLK-Class":"Convertible","Sprinter":"Cargo Van"},"Mercury":{"Capri":"Convertible","Cougar":"Coupe","Grand Marquis":"Sedan","Marauder":"Sedan","Mariner":"SUV","Milan":"Sedan","Montego":"Sedan","Mountaineer":"SUV","Mystique":"Sedan","Sable":"Sedan","Topaz":"Sedan","Tracer":"Sedan","Villager":"Minivan"},"Mini":{"Clubman":"Wagon","Convertible":"Convertible","Countryman":"SUV","Hardtop":"Hatchback"},"Mitsubishi":{"3000GT":"Sports Car","Diamante":"Sedan","Eclipse":"Coupe","Eclipse Cross":"SUV","Endeavor":"SUV","Galant":"Sedan","i-MiEV":"Hatchback","Lancer":"Sedan","Mirage":"Hatchback","Mirage G4":"Sedan","Montero":"SUV","Montero Sport":"SUV","Outlander":"SUV","Outlander PHEV":"SUV","Outlander Sport":"SUV","Raider":"Pickup Truck"},"Mitsubishi Fuso":{"Canter":"Commercial Truck","eCanter":"Commercial Truck","FA/FI Series":"Commercial Truck","FE/FG Series":"Commercial Truck"},"Moto Guzzi":{"V100 Mandello":"Touring Bike","V7":"Standard Motorcycle","V85 TT":"Adventure Bike","V9":"Cruiser"},"MV Agusta":{"Brutale":"Standard Motorcycle","Dragster":"Standard Motorcycle","F3":"Sport Bike","Turismo Veloce":"Touring Bike"},"Nissan":{"200SX":"Coupe","240SX":"Coupe","300ZX":"Sports Car","350Z":"Sports Car","370Z":"Sports Car","Altima":"Sedan","Ariya":"SUV","Armada":"SUV","Cube":"Wagon","Frontier":"Pickup Truck","GT-R":"Sports Car","Juke":"SUV","Kicks":"SUV","Leaf":"Hatchback","Maxima":"Sedan","Murano":"SUV","NV":"Cargo Van","NV200":"Cargo Van","Pathfinder":"SUV","Pulsar":"Hatchback","Quest":"Minivan","Rogue":"SUV","Sentra":"Sedan","Stanza":"Sedan","Titan":"Pickup Truck","Titan XD":"Pickup Truck","Versa":"Sedan","Xterra":"SUV","Z":"Sports Car"},"Norton":{"Commando 961":"Standard Motorcycle","V4SV":"Sport Bike"},"Peterbilt":{"220":"Commercial Truck","325":"Commercial Truck","330":"Commercial Truck","337":"Commercial Truck","348":"Commercial Truck","365":"Commercial Truck","367":"Commercial Truck","389":"Commercial Truck","520":"Commercial Truck","536":"Commercial Truck","537":"Commercial Truck","548":"Commercial Truck","567":"Commercial Truck","579":"Commercial Truck","589":"Commercial Truck"},"Piaggio":{"Beverly":"Scooter","Liberty":"Scooter","MP3":"Scooter"},"Polestar":{"Polestar 1":"Coupe","Polestar 2":"Sedan","Polestar 3":"SUV"},"Pontiac":{"6000":"Sedan","Aztek":"SUV","Bonneville":"Sedan","Fiero":"Sports Car","Firebird":"Coupe","G3":"Hatchback","G5":"Coupe","G6":"Sedan","G8":"Sedan","Grand Am":"Sedan","Grand Prix":"Sedan","GTO":"Coupe","LeMans":"Hatchback","Montana":"Minivan","Solstice":"Convertible","Sunbird":"Sedan","Sunfire":"Sedan","Torrent":"SUV","Trans Sport":"Minivan","Vibe":"Wagon"},"Porsche":{"718 Boxster":"Convertible","718 Cayman":"Coupe","911":"Sports Car","928":"Sports Car","944":"Sports Car","Carrera GT":"Sports Car","Cayenne":"SUV","Macan":"SUV","Panamera":"Sedan","Taycan":"Sedan"},"Ram":{"1500":"Pickup Truck","2500":"Pickup Truck","3500":"Pickup Truck","4500":"Commercial Truck","5500":"Commercial Truck","Chassis Cab":"Commercial Truck","ProMaster":"Cargo Van","ProMaster City":"Cargo Van"},"Rivian":{"R1S":"SUV","R1T":"Pickup Truck"},"Royal Enfield":{"Classic 350":"Standard Motorcycle","Continental GT":"Standard Motorcycle","Himalayan":"Adventure Bike","Interceptor 650":"Standard Motorcycle"},"Saab":{"9-2X":"Wagon","9-3":"Sedan","9-4X":"SUV","9-5":"Sedan","9-7X":"SUV","900":"Sedan","9000":"Sedan"},"Saturn":{"Astra":"Hatchback","Aura":"Sedan","Ion":"Sedan","L-Series":"Sedan","Outlook":"SUV","Relay":"Minivan","S-Series":"Sedan","Sky":"Convertible","Vue":"SUV"},"Scion":{"FR-S":"Coupe","iA":"Sedan","iM":"Hatchback","iQ":"Hatchback","tC":"Coupe","xA":"Hatchback","xB":"Wagon","xD":"Hatchback"},"Subaru":{"Ascent":"SUV","B9 Tribeca":"SUV","Baja":"Pickup Truck","BRZ":"Coupe","Crosstrek":"SUV","Forester":"SUV","Impreza":"Sedan","Justy":"Hatchback","Legacy":"Sedan","Loyale":"Wagon","Outback":"Wagon","Solterra":"SUV","SVX":"Coupe","Tribeca":"SUV","WRX":"Sedan","XT":"Coupe"},"Suzuki":{"Aerio":"Sedan","DR-Z400S":"Dual-Sport","Equator":"Pickup Truck","Esteem":"Sedan","Forenza":"Sedan","Grand Vitara":"SUV","GSX-R Series":"Sport Bike","Hayabusa":"Sport Bike","Katana":"Sport Bike","Kizashi":"Sedan","Reno":"Hatchback","Samurai":"SUV","Sidekick":"SUV","SV650":"Standard Motorcycle","Swift":"Hatchback","SX4":"Hatchback","V-Strom":"Adventure Bike","Verona":"Sedan","Vitara":"SUV","X-90":"SUV","XL7":"SUV"},"Tesla":{"Cybertruck":"Pickup Truck","Model 3":"Sedan","Model S":"Sedan","Model X":"SUV","Model Y":"SUV","Roadster":"Sports Car","Semi":"Commercial Truck"},"Toyota":{"4Runner":"SUV","86":"Coupe","Avalon":"Sedan","bZ4X":"SUV","C-HR":"SUV","Camry":"Sedan","Celica":"Coupe","Corolla":"Sedan","Corolla Cross":"SUV","Corolla Hatchback":"Hatchback","Corolla iM":"Hatchback","Cressida":"Sedan","Crown":"Sedan","Echo":"Sedan","FJ Cruiser":"SUV","GR Corolla":"Hatchback","GR Supra":"Sports Car","GR86":"Coupe","Grand Highlander":"SUV","Highlander":"SUV","Land Cruiser":"SUV","Matrix":"Wagon","Mirai":"Sedan","MR2 / MR2 Spyder":"Sports Car","Paseo":"Coupe","Previa":"Minivan","Prius":"Hatchback","Prius Prime":"Hatchback","RAV4":"SUV","RAV4 Prime":"SUV","Sequoia":"SUV","Sienna":"Minivan","Solara":"Coupe","Supra":"Sports Car","T100":"Pickup Truck","Tacoma":"Pickup Truck","Tercel":"Sedan","Tundra":"Pickup Truck","Venza":"SUV","Yaris":"Hatchback"},"Triumph":{"Bonneville":"Standard Motorcycle","Rocket 3":"Cruiser","Scrambler":"Standard Motorcycle","Speed Triple":"Standard Motorcycle","Street Triple":"Standard Motorcycle","Tiger":"Adventure Bike","Trident":"Standard Motorcycle"},"Vespa":{"GTS":"Scooter","Primavera":"Scooter","Sprint":"Scooter"},"Volkswagen":{"Arteon":"Sedan","Atlas":"SUV","Atlas Cross Sport":"SUV","Beetle":"Hatchback","Cabrio":"Convertible","CC":"Sedan","Corrado":"Coupe","Eos":"Convertible","Fox":"Sedan","Golf":"Hatchback","Golf R":"Hatchback","GTI":"Hatchback","ID.4":"SUV","Jetta":"Sedan","Jetta GLI":"Sedan","New Beetle":"Hatchback","Passat":"Sedan","Phaeton":"Sedan","Rabbit":"Hatchback","Routan":"Minivan","Taos":"SUV","Tiguan":"SUV","Touareg":"SUV","Vanagon":"Minivan"},"Volvo":{"C30":"Hatchback","C40 Recharge":"SUV","C70":"Convertible","S40":"Sedan","S60":"Sedan","S70":"Sedan","S80":"Sedan","S90":"Sedan","V40":"Wagon","V50":"Wagon","V60":"Wagon","V70":"Wagon","V90":"Wagon","VHD":"Commercial Truck","VNL":"Commercial Truck","VNR":"Commercial Truck","XC40":"SUV","XC60":"SUV","XC70":"Wagon","XC90":"SUV"},"Yamaha":{"Bolt":"Cruiser","MT Series":"Standard Motorcycle","Super Ténéré":"Adventure Bike","Tracer 9":"Touring Bike","TW200":"Dual-Sport","VMAX":"Cruiser","V Star":"Cruiser","XSR Series":"Standard Motorcycle","YZF-R Series":"Sport Bike","Zuma":"Scooter"},"Zero Motorcycles":{"DSR/X":"Adventure Bike","FXE":"Standard Motorcycle","SR/F":"Standard Motorcycle","SR/S":"Sport Bike"},"Other":{"Other":"Other"}};

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join('/var', 'www', 'platetraits', 'images')));

// Middleware to authenticate JWT tokens and check admin status
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ success: false, message: 'Authentication token required.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
        req.user = user;
        next();
    });
};

// Middleware to check for admin status
const requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ success: false, message: 'Forbidden. Admin privileges required.' });
    }
    next();
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Endpoint for user registration
app.post('/api/users/register', async (req, res) => {
    const { username, first_name, email, password } = req.body;
    if (!username || !email || !password || !first_name) {
        return res.status(400).json({ success: false, message: 'Username, first name, email, and password are required.' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [countRows] = await connection.query('SELECT COUNT(*) as userCount FROM users');
        const userCount = countRows[0].userCount;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await connection.query('INSERT INTO users (username, first_name, email, password) VALUES (?, ?, ?, ?)', [username, first_name, email, hashedPassword]);
        const newUserId = result.insertId;

        if (userCount < 10) {
            await connection.query('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', [newUserId, '0002']);
        }
        if (userCount < 50) {
            await connection.query('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', [newUserId, '0003']);
        }
        if (userCount < 100) {
            await connection.query('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', [newUserId, '0004']);
        }

        await connection.commit();

        res.status(201).json({ success: true, message: 'User registered successfully!', userId: newUserId });

    } catch (err) {
        await connection.rollback();
        console.error('❌ Registration failed:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            if (err.message.includes('username')) return res.status(409).json({ success: false, message: 'Username already exists.' });
            if (err.message.includes('email')) return res.status(409).json({ success: false, message: 'Email address is already registered.' });
        }
        res.status(500).json({ error: 'Server error during registration.', details: err.message });
    } finally {
        connection.release();
    }
});

// Endpoint for user login
app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required.' });
    try {
        // UPDATED: Added `is_admin` to the SELECT query
        const [rows] = await db.query('SELECT id, username, password, is_admin FROM users WHERE username = ?', [username]);
        const user = rows[0];
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            // UPDATED: Added `isAdmin` to the JWT payload
            const accessToken = jwt.sign({ userId: user.id, username: user.username, isAdmin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // NEW: Return the `is_admin` status to the frontend
            res.json({ success: true, accessToken: accessToken, username: user.username, isAdmin: user.is_admin });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
    } catch (err) {
        console.error('❌ Login failed:', err);
        res.status(500).json({ error: 'Server error during login.', details: err.message });
    }
});

// Endpoint to get the logged-in user's profile and their reviews
app.get('/api/users/profile', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const [userRows] = await db.query('SELECT id, username, first_name, email, created_at, current_vehicle_make, current_vehicle_model, current_vehicle_color, current_vehicle_year, bio FROM users WHERE id = ?', [userId]);
        const user = userRows[0];

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const accountAgeInDays = (new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24);
        const membershipBadges = [
            { days: 30, id: '0300' }, { days: 182, id: '0301' }, { days: 365, id: '0302' },
            { days: 730, id: '0303' }, { days: 1095, id: '0304' }, { days: 1460, id: '0305' },
            { days: 1825, id: '0306' }
        ];
        for (const badge of membershipBadges) {
            if (accountAgeInDays >= badge.days) {
                await db.query('INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)', [user.id, badge.id]);
            }
        }

        const [reviewRows] = await db.query('SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC', [userId]);

        const [badgeRows] = await db.query(`
            SELECT b.badge_id, b.name, b.description, b.image_url
            FROM user_badges ub
            JOIN badges b ON ub.badge_id = b.badge_id
            WHERE ub.user_id = ?
        `, [userId]);

        res.json({ success: true, user, reviews: reviewRows, badges: badgeRows });

    } catch (err) {
        console.error('❌ Failed to fetch user profile:', err);
        res.status(500).json({ error: 'Database error while fetching user profile.', details: err.message });
    }
});

// Endpoint to update user's profile (first name, vehicle, and bio)
app.put('/api/users/profile', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { first_name, vehicle, bio } = req.body;

    if (!vehicle || !bio) {
        return res.status(400).json({ success: false, message: 'Vehicle and bio information are required.' });
    }

    try {
        const bioJSON = bio ? JSON.stringify(bio) : null;
        await db.query(
            'UPDATE users SET first_name = ?, current_vehicle_make = ?, current_vehicle_model = ?, current_vehicle_color = ?, current_vehicle_year = ?, bio = ? WHERE id = ?',
            [
                first_name || null,
                vehicle.make || null,
                vehicle.model || null,
                vehicle.color || null,
                vehicle.year || null,
                bioJSON,
                userId
            ]
        );
        res.json({ success: true, message: 'Profile updated successfully.' });
    } catch (err) {
        console.error('❌ Failed to update profile:', err);
        res.status(500).json({ success: false, message: 'Database error while updating profile.', details: err.message });
    }
});


// Endpoint to get a public user profile by username
app.get('/api/users/profile/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const [userRows] = await db.query('SELECT id, username, first_name, created_at, current_vehicle_make, current_vehicle_model, current_vehicle_color, current_vehicle_year, bio FROM users WHERE username = ?', [username]);
        const user = userRows[0];

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const accountAgeInDays = (new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24);
        const membershipBadges = [
            { days: 30, id: '0300' }, { days: 182, id: '0301' }, { days: 365, id: '0302' },
            { days: 730, id: '0303' }, { days: 1095, id: '0304' }, { days: 1460, id: '0305' },
            { days: 1825, id: '0306' }
        ];
        for (const badge of membershipBadges) {
            if (accountAgeInDays >= badge.days) {
                await db.query('INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)', [user.id, badge.id]);
            }
        }

        const [reviewRows] = await db.query('SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC', [user.id]);

        const reviewsWithUsername = reviewRows.map(review => ({
            ...review,
            user_id: user.username
        }));

        const [badgeRows] = await db.query(`
            SELECT b.badge_id, b.name, b.description, b.image_url
            FROM user_badges ub
            JOIN badges b ON ub.badge_id = b.badge_id
            WHERE ub.user_id = ?
        `, [user.id]);

        res.json({ success: true, user, reviews: reviewsWithUsername, badges: badgeRows });

    } catch (err) {
        console.error(`❌ Failed to fetch public profile for ${username}:`, err);
        res.status(500).json({ error: 'Database error while fetching user profile.', details: err.message });
    }
});

// NEW: Endpoint to get a list of all users for the admin dashboard
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        res.json(users);
    } catch (err) {
        console.error('❌ Failed to fetch users for admin dashboard:', err);
        res.status(500).json({ success: false, message: 'Database error while fetching users.' });
    }
});

// NEW: Public-facing endpoint to get a list of all users
app.get('/api/users/list', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (err) {
        console.error('❌ Failed to fetch public user list:', err);
        res.status(500).json({ success: false, message: 'Database error while fetching user list.' });
    }
});

// NEW: Endpoint for an admin to update a user's information
app.put('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { first_name, email, password, is_admin, current_vehicle_make, current_vehicle_model, current_vehicle_year, current_vehicle_color, bio } = req.body;

    let updateFields = [];
    let queryParams = [];

    // Use `!== undefined` to allow clearing the field by sending an empty string
    if (first_name !== undefined) {
        updateFields.push('first_name = ?');
        queryParams.push(first_name || null); // Use null if string is empty
    }
    if (email) {
        updateFields.push('email = ?');
        queryParams.push(email);
    }
    if (is_admin !== undefined) {
        updateFields.push('is_admin = ?');
        queryParams.push(is_admin ? 1 : 0);
    }
    if (password) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updateFields.push('password = ?');
        queryParams.push(hashedPassword);
    }
    // Allow setting vehicle info to null/empty by converting empty strings to null
    if (current_vehicle_make !== undefined) {
        updateFields.push('current_vehicle_make = ?');
        queryParams.push(current_vehicle_make || null);
    }
    if (current_vehicle_model !== undefined) {
        updateFields.push('current_vehicle_model = ?');
        queryParams.push(current_vehicle_model || null);
    }
    if (current_vehicle_year !== undefined) {
        updateFields.push('current_vehicle_year = ?');
        queryParams.push(current_vehicle_year || null);
    }
    if (current_vehicle_color !== undefined) {
        updateFields.push('current_vehicle_color = ?');
        queryParams.push(current_vehicle_color || null);
    }
    if (bio !== undefined) {
        const bioJSON = bio ? JSON.stringify(bio) : null;
        updateFields.push('bio = ?');
        queryParams.push(bioJSON);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields to update.' });
    }

    queryParams.push(id);
    const queryString = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

    try {
        await db.query(queryString, queryParams);
        res.json({ success: true, message: 'User updated successfully.' });
    } catch (err) {
        console.error(`❌ Failed to update user ${id}:`, err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'Email address is already registered.' });
        }
        res.status(500).json({ success: false, message: 'Database error while updating user.', details: err.message });
    }
});

// NEW: Endpoint for an admin to award a badge to a user
app.post('/api/admin/users/:id/badges', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { badge_id } = req.body;

    if (!badge_id) {
        return res.status(400).json({ success: false, message: 'Badge ID is required.' });
    }

    try {
        await db.query(
            'INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)',
            [id, badge_id]
        );
        res.status(201).json({ success: true, message: 'Badge awarded successfully.' });
    } catch (err) {
        console.error(`❌ Failed to award badge ${badge_id} to user ${id}:`, err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'User already has this badge.' });
        }
        res.status(500).json({ success: false, message: 'Database error while awarding badge.', details: err.message });
    }
});

// NEW: Endpoint for an admin to remove a badge from a user
app.delete('/api/admin/users/:userId/badges/:badgeId', authenticateToken, requireAdmin, async (req, res) => {
    const { userId, badgeId } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM user_badges WHERE user_id = ? AND badge_id = ?',
            [userId, badgeId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Badge not found for this user.' });
        }

        res.json({ success: true, message: 'Badge removed successfully.' });
    } catch (err) {
        console.error(`❌ Failed to remove badge ${badgeId} from user ${userId}:`, err);
        res.status(500).json({ success: false, message: 'Database error while removing badge.', details: err.message });
    }
});

// NEW: Endpoint for an admin to delete a user
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Note: The order of deletion matters due to foreign key constraints.
        // If reviews have votes, you might need to delete votes first, then reviews.
        // Assuming ON DELETE CASCADE is set up in the DB schema for review_votes.
        // If not, you would delete review_votes belonging to the user's reviews first.

        // Delete user's badges
        await connection.query('DELETE FROM user_badges WHERE user_id = ?', [id]);
        // Delete user's votes
        await connection.query('DELETE FROM review_votes WHERE user_id = ?', [id]);
        // Delete user's reviews
        await connection.query('DELETE FROM reviews WHERE user_id = ?', [id]);
        // Finally, delete the user
        const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        await connection.commit();
        res.json({ success: true, message: 'User and all their associated data have been deleted successfully.' });

    } catch (err) {
        await connection.rollback();
        console.error(`❌ Failed to delete user ${id}:`, err);
        res.status(500).json({ success: false, message: 'Database error during user deletion.', details: err.message });
    } finally {
        connection.release();
    }
});

// NEW: Endpoint for an admin to verify their password before a sensitive action
app.post('/api/admin/verify-password', authenticateToken, requireAdmin, async (req, res) => {
    const { password } = req.body;
    const adminUserId = req.user.userId;

    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required for verification.' });
    }

    try {
        const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [adminUserId]);
        const user = rows[0];

        if (!user) {
            // This should theoretically not happen if the token is valid
            return res.status(404).json({ success: false, message: 'Admin user not found.' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            res.json({ success: true, message: 'Password verified successfully.' });
        } else {
            res.status(401).json({ success: false, message: 'Incorrect password.' });
        }
    } catch (err) {
        console.error(`❌ Failed to verify password for admin ${adminUserId}:`, err);
        res.status(500).json({ success: false, message: 'Database error during password verification.', details: err.message });
    }
});

// Endpoint to get all votes for the logged-in user
app.get('/api/users/votes', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const [votes] = await db.query('SELECT review_id, vote_type FROM review_votes WHERE user_id = ?', [userId]);
        res.json({ success: true, votes });
    } catch (err) {
        console.error('❌ Failed to fetch user votes:', err);
        res.status(500).json({ success: false, message: 'Database error while fetching user votes.' });
    }
});

// Endpoint to get all reviews with vote counts, sorting, and filtering (for public use)
app.get('/api/reviews', async (req, res) => {
    const { sort, trait } = req.query;

    try {
        let queryParams = [];
        let whereClauses = [];

        if (trait) {
            whereClauses.push(`r.tags LIKE ?`);
            queryParams.push(`%${trait}%`);
        }

        const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        let orderByString = 'ORDER BY r.created_at DESC';
        if (sort === 'highest_rated' || sort === 'worst_rated') {
            const sortDirection = sort === 'highest_rated' ? 'DESC' : 'ASC';
            orderByString = `ORDER BY plate_stats.avg_rating ${sortDirection}, r.created_at DESC`;
        }

        const query = `
            SELECT
                r.id, r.plate_number, r.rating, r.vehicle_make, r.vehicle_model, r.comment, r.tags,
                u.username AS user_id, r.incident_location, r.created_at, r.vehicle_color,
                COALESCE(SUM(CASE WHEN rv.vote_type = 'up' THEN 1 ELSE 0 END), 0) AS upvotes,
                COALESCE(SUM(CASE WHEN rv.vote_type = 'down' THEN 1 ELSE 0 END), 0) AS downvotes
            FROM reviews r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN review_votes rv ON r.id = rv.review_id
            LEFT JOIN (
                SELECT plate_number, AVG(rating) AS avg_rating
                FROM reviews
                GROUP BY plate_number
            ) AS plate_stats ON r.plate_number = plate_stats.plate_number
            ${whereString}
            GROUP BY r.id, u.username
            ${orderByString};
        `;
        const [rows] = await db.query(query, queryParams);
        res.json(rows);
    } catch (err) {
        console.error('❌ Failed to fetch reviews:', err);
        res.status(500).json({ error: 'Database query failed', details: err.message });
    }
});

// NEW: Endpoint to get ALL reviews (no filtering/sorting) for the admin dashboard
// Note: This endpoint is separate from the public-facing one
app.get('/api/admin/reviews', authenticateToken, requireAdmin, async (req, res) => {
    try {
        // This query fetches all reviews, including the `status` column which is needed for the admin table
        const [reviews] = await db.query(`
            SELECT
                r.id, r.plate_number, r.user_id, r.rating, r.comment, r.status, r.created_at
            FROM reviews r
            ORDER BY r.created_at DESC
        `);
        res.json(reviews);
    } catch (err) {
        console.error('❌ Failed to fetch reviews for admin dashboard:', err);
        res.status(500).json({ success: false, message: 'Database error while fetching reviews.' });
    }
});

// NEW: Endpoint for an admin to delete a review
app.delete('/api/admin/reviews/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // First, delete associated votes to maintain referential integrity
        await connection.query('DELETE FROM review_votes WHERE review_id = ?', [id]);

        // Then, delete the review itself
        const [result] = await connection.query('DELETE FROM reviews WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Review not found.' });
        }

        await connection.commit();
        res.json({ success: true, message: 'Review and its associated votes have been deleted successfully.' });

    } catch (err) {
        await connection.rollback();
        console.error(`❌ Failed to delete review ${id}:`, err);
        res.status(500).json({ success: false, message: 'Database error during review deletion.', details: err.message });
    } finally {
        connection.release();
    }
});

// Endpoint to submit a new review
app.post('/api/reviews', authenticateToken, async (req, res) => {
    const { plate_number, rating, tags, comment, vehicle_make, vehicle_model, vehicle_color, incident_location } = req.body;
    const user_id = req.user.userId;
    if (!plate_number || !plate_number.trim()) return res.status(400).json({ success: false, details: 'Plate number is required.' });
    const parsedRating = Number(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) return res.status(400).json({ success: false, details: 'A valid rating (1-5 stars) is required.' });

    if (comment && (typeof comment.template === 'undefined' || !Array.isArray(comment.words))) {
        return res.status(400).json({ success: false, details: 'A valid structured comment is required.' });
    }

    try {
      const commentJSON = comment ? JSON.stringify(comment) : null;
      const [result] = await db.query(
        `INSERT INTO reviews (plate_number, rating, user_id, tags, comment, vehicle_make, vehicle_model, vehicle_color, incident_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [plate_number, parsedRating, user_id, tags || null, commentJSON, vehicle_make || null, vehicle_model || null, vehicle_color || null, incident_location || null]
      );

      res.status(201).json({ success: true, review_id: result.insertId });

      (async () => {
        try {
            const [userReviews] = await db.query('SELECT vehicle_make, vehicle_model FROM reviews WHERE user_id = ?', [user_id]);
            const totalReviewsCount = userReviews.length;

            const reviewerBadgeChecks = [
                { count: 5, id: '0200' },
                { count: 10, id: '0201' },
                { count: 50, id: '0202' },
                { count: 100, id: '0203' },
                { count: 500, id: '0204' },
                { count: 1000, id: '0205' }
            ];

            for (const check of reviewerBadgeChecks) {
                if (totalReviewsCount >= check.count) {
                    await db.query('INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)', [user_id, check.id]);
                }
            }

            const sedanCount = userReviews.filter(review =>
                vehicleSubtype[review.vehicle_make]?.[review.vehicle_model] === 'Sedan'
            ).length;

            const sedanBadgeChecks = [
                { count: 5, id: '0100' },
                { count: 10, id: '0101' },
                { count: 50, id: '0102' },
                { count: 100, id: '0103' },
                { count: 500, id: '0104' },
                { count: 1000, id: '0105' }
            ];

            for (const check of sedanBadgeChecks) {
                if (sedanCount >= check.count) {
                    await db.query('INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)', [user_id, check.id]);
                }
            }
        } catch (badgeError) {
            console.error('❌ Badge awarding failed after review submission:', badgeError);
        }
      })();

    } catch (err) {
      console.error('❌ Failed to insert review:', err);
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Duplicate entry' });
      res.status(500).json({ error: 'Database insert failed', details: err.message });
    }
});

// Endpoint to vote on a review
app.post('/api/reviews/:reviewId/vote', authenticateToken, async (req, res) => {
    const { reviewId } = req.params;
    const { voteType } = req.body;
    const userId = req.user.userId;

    if (!['up', 'down', 'none'].includes(voteType)) {
        return res.status(400).json({ success: false, message: 'Invalid vote type.' });
    }

    try {
        if (voteType === 'none') {
            await db.query('DELETE FROM review_votes WHERE review_id = ? AND user_id = ?', [reviewId, userId]);
        } else {
            const query = `
                INSERT INTO review_votes (review_id, user_id, vote_type) VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE vote_type = ?;
            `;
            await db.query(query, [reviewId, userId, voteType, voteType]);
        }

        res.status(200).json({ success: true, message: 'Vote recorded.' });

        // Asynchronously handle badge and notification logic without holding up the response
        (async () => {
            try {
                // Badge logic for upvoting
                if (voteType === 'up') {
                    const [upvoteCountRows] = await db.query('SELECT COUNT(*) as upvoteCount FROM review_votes WHERE user_id = ? AND vote_type = "up"', [userId]);
                    const upvoteCount = upvoteCountRows[0].upvoteCount;
                    const upvoterBadgeChecks = [
                        { count: 5, id: '0500' }, { count: 10, id: '0501' }, { count: 50, id: '0502' },
                        { count: 100, id: '0503' }, { count: 500, id: '0504' }, { count: 1000, id: '0505' }
                    ];
                    for (const check of upvoterBadgeChecks) {
                        if (upvoteCount >= check.count) {
                            await db.query('INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, check.id]);
                        }
                    }
                }

                // Notification logic for any vote type other than 'none'
                if (voteType !== 'none') {
                    const [reviewRows] = await db.query('SELECT user_id, plate_number FROM reviews WHERE id = ?', [reviewId]);
                    if (reviewRows.length > 0) {
                        const reviewAuthorId = reviewRows[0].user_id;
                        const plateNumber = reviewRows[0].plate_number.toUpperCase();

                        // Avoid notifying user for their own actions
                        if (reviewAuthorId !== userId) {
                            const [voterRows] = await db.query('SELECT username FROM users WHERE id = ?', [userId]);
                            const voterUsername = voterRows.length > 0 ? voterRows[0].username : 'Someone';
                            const message = `${voterUsername} just gave your review for ${plateNumber} an ${voteType === 'up' ? 'upvote' : 'downvote'}!`;
                            await db.query(
                                'INSERT INTO notifications (user_id, type, content, related_id) VALUES (?, ?, ?, ?)',
                                [reviewAuthorId, 'vote', message, reviewId]
                            );
                        }
                    }
                }
            } catch (asyncError) {
                console.error('❌ Post-vote async logic failed:', asyncError);
            }
        })();

    } catch (err) {
        console.error('❌ Failed to record vote:', err);
        res.status(500).json({ error: 'Database error while voting.', details: err.message });
    }
});

// NEW: Endpoint to get user's notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const [notifications] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', // Added a limit
            [userId]
        );
        res.json({ success: true, notifications });
    } catch (err) {
        console.error(`❌ Failed to fetch notifications for user ${userId}:`, err);
        res.status(500).json({ success: false, message: 'Database error while fetching notifications.' });
    }
});

// NEW: Endpoint to mark all notifications as read for a user
app.put('/api/notifications/read', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        await db.query(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
            [userId]
        );
        res.json({ success: true, message: 'Notifications marked as read.' });
    } catch (err) {
        console.error(`❌ Failed to mark notifications as read for user ${userId}:`, err);
        res.status(500).json({ success: false, message: 'Database error while updating notifications.' });
    }
});


// Endpoint to get all badges
app.get('/api/badges', async (req, res) => {
    try {
        const [badges] = await db.query('SELECT * FROM badges ORDER BY badge_id');
        res.json(badges);
    } catch (err) {
        console.error('❌ Failed to fetch all badges:', err);
        res.status(500).json({ error: 'Database error while fetching badges.' });
    }
});

// Endpoint to get public community statistics
app.get('/api/stats', async (req, res) => {
    try {
        // Get total users
        const [userRows] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
        const totalUsers = userRows[0].totalUsers;

        res.json({
            success: true,
            totalUsers
        });

    } catch (err) {
        console.error('❌ Failed to fetch community stats:', err);
        res.status(500).json({ success: false, message: 'Database error while fetching community stats.', details: err.message });
    }
});

// Endpoint to get all user_badges for the admin dashboard
app.get('/api/user_badges', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM user_badges ORDER BY earned_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('❌ Failed to fetch user_badges for admin dashboard:', err);
        res.status(500).json({ success: false, message: 'Database error while fetching user_badges.' });
    }
});

// Endpoint to get all review_votes for the admin dashboard
app.get('/api/review_votes', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM review_votes ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('❌ Failed to fetch review_votes for admin dashboard:', err);
        res.status(500).json({ success: false, message: 'Database error while fetching review_votes.' });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log(`PlateTraits Node.js server running on http://0.0.0.0:${PORT}`));
