// admin.js — PlateTraits Admin Dashboard
// NEW: Drag-and-drop selection box for users to drive bulk actions.

document.addEventListener('DOMContentLoaded', () => {
  // ---------- CONFIG ----------
  const API_URL = '/api';
  const authToken = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('isAdmin') === '1';

  if (!authToken || !isAdmin) {
    window.location.href = '/home.html';
    return;
  }

  // ---------- VEHICLE DATA ----------
  // Paste your full vehicleSubtype mapping (from server.js) here if you want model dropdowns in the Manage modal:
const vehicleSubtype = {"Acura":{"ILX":"Sedan","Integra":"Sedan","MDX":"SUV","NSX":"Sports Car","RDX":"SUV","RL":"Sedan","RLX":"Sedan","TLX":"Sedan","ZDX":"SUV"},"Alfa Romeo":{"Giulia":"Sedan","Stelvio":"SUV","Tonale":"SUV"},"Aprilia":{"RS 660":"Sport Bike","RSV4":"Sport Bike","Tuareg 660":"Adventure Bike","Tuono":"Sport Bike"},"Audi":{"A3":"Sedan","A4":"Sedan","A5":"Coupe","A6":"Sedan","A7":"Sedan","A8":"Sedan","e-tron":"SUV","e-tron GT":"Sedan","Q3":"SUV","Q4 e-tron":"SUV","Q5":"SUV","Q7":"SUV","Q8":"SUV","R8":"Sports Car","RS 3":"Sedan","RS 5":"Coupe","RS 6":"Wagon","RS 7":"Sedan","S3":"Sedan","S4":"Sedan","S5":"Coupe","TT":"Coupe"},"BMW":{"2 Series":"Coupe","3 Series":"Sedan","4 Series":"Coupe","5 Series":"Sedan","7 Series":"Sedan","8 Series":"Coupe","i4":"Sedan","i7":"Sedan","iX":"SUV","M2":"Coupe","M3":"Sedan","M4":"Coupe","M5":"Sedan","M8":"Coupe","R 1250 GS":"Adventure Bike","S 1000 RR":"Sport Bike","X1":"SUV","X2":"SUV","X3":"SUV","X4":"SUV","X5":"SUV","X6":"SUV","X7":"SUV","Z4":"Convertible"},"Buell":{"Firebolt":"Sport Bike","Lightning":"Standard Motorcycle","Ulysses":"Adventure Bike"},"Buick":{"Cascada":"Convertible","Century":"Sedan","Enclave":"SUV","Encore":"SUV","Encore GX":"SUV","Envision":"SUV","LaCrosse":"Sedan","LeSabre":"Sedan","Lucerne":"Sedan","Park Avenue":"Sedan","Rainier":"SUV","Regal":"Sedan","Rendezvous":"SUV","Verano":"Sedan"},"Cadillac":{"ATS":"Sedan","Celestiq":"Sedan","CT4":"Sedan","CT5":"Sedan","CT6":"Sedan","CTS":"Sedan","DeVille":"Sedan","DTS":"Sedan","Escalade":"SUV","Lyriq":"SUV","Seville":"Sedan","STS":"Sedan","XLR":"Convertible","XT4":"SUV","XT5":"SUV","XT6":"SUV"},"Can-Am":{"Defender":"UTV/Side-by-Side","Maverick":"UTV/Side-by-Side","Ryker":"Three-Wheeled Motorcycle","Spyder":"Three-Wheeled Motorcycle"},"Chevrolet":{"Astro":"Minivan","Avalanche":"Pickup Truck","Aveo":"Sedan","Beretta":"Coupe","Blazer":"SUV","Blazer EV":"SUV","Bolt EUV":"SUV","Bolt EV":"Hatchback","Camaro":"Coupe","Caprice":"Sedan","Captiva Sport":"SUV","Cavalier":"Sedan","Celebrity":"Sedan","Chevelle":"Coupe","Chevy II / Nova":"Sedan","City Express":"Cargo Van","Cobalt":"Sedan","Colorado":"Pickup Truck","Corsica":"Sedan","Corvette":"Sports Car","Cruze":"Sedan","El Camino":"Pickup Truck","Equinox":"SUV","Equinox EV":"SUV","Express":"Cargo Van","HHR":"Wagon","Impala":"Sedan","Low Cab Forward":"Commercial Truck","Lumina":"Sedan","Malibu":"Sedan","Metro":"Hatchback","Monte Carlo":"Coupe","Prizm":"Sedan","S-10":"Pickup Truck","Silverado 1500":"Pickup Truck","Silverado 2500HD":"Pickup Truck","Silverado 3500HD":"Pickup Truck","Silverado 4500HD":"Commercial Truck","Silverado 5500HD":"Commercial Truck","Silverado 6500HD":"Commercial Truck","Silverado EV":"Pickup Truck","Sonic":"Sedan","Spark":"Hatchback","SSR":"Pickup Truck","Suburban":"SUV","Tahoe":"SUV","Tracker":"SUV","TrailBlazer":"SUV","Traverse":"SUV","Trax":"SUV","Uplander":"Minivan","Venture":"Minivan","Volt":"Sedan"},"Chrysler":{"200":"Sedan","300":"Sedan","Aspen":"SUV","Concorde":"Sedan","Crossfire":"Coupe","Grand Voyager":"Minivan","Imperial":"Sedan","LHS":"Sedan","New Yorker":"Sedan","Pacifica":"Minivan","PT Cruiser":"Wagon","Sebring":"Sedan","Town & Country":"Minivan","Voyager":"Minivan"},"Dodge":{"Attitude":"Sedan","Avenger":"Sedan","Caliber":"Hatchback","Caravan":"Minivan","Challenger":"Coupe","Challenger SRT Demon / 170":"Coupe","Challenger SRT Hellcat":"Coupe","Charger":"Sedan","Charger Daytona":"Sedan","Charger SRT Hellcat":"Sedan","Dakota":"Pickup Truck","Dart":"Sedan","Durango":"SUV","Durango SRT / Hellcat":"SUV","Grand Caravan":"Minivan","Hornet":"SUV","Intrepid":"Sedan","Journey":"SUV","Magnum":"Wagon","Neon / SRT-4":"Sedan","Nitro":"SUV","Ram Van / B-series":"Cargo Van","Spirit":"Sedan","Stealth":"Coupe","Stratus":"Sedan","Viper":"Sports Car"},"Ducati":{"Diavel":"Cruiser","Hypermotard":"Standard Motorcycle","Monster":"Standard Motorcycle","Multistrada":"Adventure Bike","Panigale":"Sport Bike","Scrambler":"Standard Motorcycle","Streetfighter":"Standard Motorcycle"},"Fiat":{"124 Spider":"Convertible","500":"Hatchback","500L":"Wagon","500X":"SUV"},"Ford":{"Aerostar":"Minivan","Aspire":"Hatchback","Bronco":"SUV","Bronco Sport":"SUV","C-Max":"Wagon","Contour":"Sedan","Crown Victoria":"Sedan","E-Series":"Cargo Van","E-Transit":"Cargo Van","EcoSport":"SUV","Edge":"SUV","Escape":"SUV","Escort":"Sedan","Excursion":"SUV","Expedition":"SUV","Explorer":"SUV","F-150":"Pickup Truck","F-150 Lightning":"Pickup Truck","F-250 Super Duty":"Pickup Truck","F-350 Super Duty":"Pickup Truck","F-450 Super Duty":"Pickup Truck","F-550 Super Duty":"Commercial Truck","F-650":"Commercial Truck","F-750":"Commercial Truck","Festiva":"Hatchback","Fiesta":"Hatchback","Five Hundred":"Sedan","Flex":"SUV","Focus":"Sedan","Freestar":"Minivan","Freestyle":"SUV","Fusion":"Sedan","GT":"Sports Car","Maverick":"Pickup Truck","Mustang":"Coupe","Mustang Mach-E":"SUV","Probe":"Coupe","Ranger":"Pickup Truck","Taurus":"Sedan","Taurus X":"SUV","Thunderbird":"Convertible","Transit":"Cargo Van","Transit Connect":"Cargo Van","Windstar":"Minivan"},"Freightliner":{"108SD":"Commercial Truck","114SD":"Commercial Truck","122SD":"Commercial Truck","Cascadia":"Commercial Truck","Columbia":"Commercial Truck","Coronado":"Commercial Truck","EconicSD":"Commercial Truck","M2 106":"Commercial Truck","M2 112":"Commercial Truck"},"Genesis":{"G70":"Sedan","G80":"Sedan","G90":"Sedan","GV60":"SUV","GV70":"SUV","GV80":"SUV"},"GMC":{"Acadia":"SUV","Canyon":"Pickup Truck","Envoy":"SUV","Hummer EV":"Pickup Truck","Jimmy":"SUV","Safari":"Minivan","Savana":"Cargo Van","Sierra 1500":"Pickup Truck","Sierra 2500HD":"Pickup Truck","Sierra 3500HD":"Pickup Truck","Sierra 4500HD":"Commercial Truck","Sierra 5500HD":"Commercial Truck","Sierra 6500HD":"Commercial Truck","Sonoma":"Pickup Truck","Syclone":"Pickup Truck","Terrain":"SUV","TopKick":"Commercial Truck","Typhoon":"SUV","Yukon":"SUV","Yukon XL":"SUV"},"Harley-Davidson":{"CVO":"Touring Bike","LiveWire":"Standard Motorcycle","Pan America":"Adventure Bike","Road Glide":"Touring Bike","Softail":"Cruiser","Sportster":"Cruiser","Street Glide":"Touring Bike","Trike":"Three-Wheeled Motorcycle"},"Hino":{"155":"Commercial Truck","195":"Commercial Truck","238":"Commercial Truck","258":"Commercial Truck","268":"Commercial Truck","338":"Commercial Truck","L Series":"Commercial Truck","M Series":"Commercial Truck","XL Series":"Commercial Truck"},"Honda":{"Accord":"Sedan","Accord Hybrid":"Sedan","Africa Twin":"Adventure Bike","CBR Series":"Sport Bike","Civic":"Sedan","Civic Si":"Sedan","Civic Type R":"Hatchback","Clarity":"Sedan","CR-V":"SUV","CR-V Hybrid":"SUV","CR-Z":"Hatchback","CRF Series":"Dual-Sport","CRX":"Hatchback","Del Sol":"Convertible","Element":"SUV","Fit":"Hatchback","Gold Wing":"Touring Bike","Grom":"Standard Motorcycle","HR-V":"SUV","Insight":"Sedan","Odyssey":"Minivan","Passport":"SUV","Pilot":"SUV","Prelude":"Coupe","Prologue":"SUV","Ridgeline":"Pickup Truck","S2000":"Convertible","Shadow":"Cruiser"},"Hummer":{"H1":"SUV","H2":"SUV","H3":"SUV"},"Husqvarna":{"FC 450":"Motocross/Off-road","Norden 901":"Adventure Bike","Svartpilen":"Standard Motorcycle","Vitpilen":"Standard Motorcycle"},"Hyundai":{"Accent":"Sedan","Azera":"Sedan","Elantra":"Sedan","Entourage":"Minivan","Equus":"Sedan","Genesis":"Sedan","Genesis Coupe":"Coupe","Ioniq 5":"SUV","Ioniq 6":"Sedan","Kona":"SUV","Nexo":"SUV","Palisade":"SUV","Santa Cruz":"Pickup Truck","Santa Fe":"SUV","Sonata":"Sedan","Tiburon":"Coupe","Tucson":"SUV","Veloster":"Hatchback","Venue":"SUV","Veracruz":"SUV"},"Indian":{"Challenger":"Touring Bike","Chieftain":"Touring Bike","Chief":"Cruiser","FTR":"Standard Motorcycle","Scout":"Cruiser","Springfield":"Touring Bike"},"Infiniti":{"EX":"SUV","FX":"SUV","G20":"Sedan","G35":"Sedan","G37":"Coupe","I30":"Sedan","I35":"Sedan","JX":"SUV","M":"Sedan","Q40":"Sedan","Q50":"Sedan","Q60":"Coupe","Q70":"Sedan","QX30":"SUV","QX4":"SUV","QX50":"SUV","QX55":"SUV","QX60":"SUV","QX70":"SUV","QX80":"SUV"},"International":{"CV Series":"Commercial Truck","DuraStar":"Commercial Truck","HV Series":"Commercial Truck","HX Series":"Commercial Truck","LoneStar":"Commercial Truck","LT Series":"Commercial Truck","MV Series":"Commercial Truck","ProStar":"Commercial Truck","RH Series":"Commercial Truck","WorkStar":"Commercial Truck"},"Isuzu":{"Ascender":"SUV","Axiom":"SUV","D-Max":"Pickup Truck","F-Series":"Commercial Truck","Hombre":"Pickup Truck","i-Series":"Pickup Truck","N-Series":"Commercial Truck","Oasis":"Minivan","Rodeo":"SUV","Stylus":"Sedan","Trooper":"SUV"},"Jaguar":{"E-PACE":"SUV","F-PACE":"SUV","F-TYPE":"Sports Car","I-PACE":"SUV","S-Type":"Sedan","X-Type":"Sedan","XE":"Sedan","XF":"Sedan","XJ":"Sedan","XK":"Coupe"},"Jeep":{"Cherokee":"SUV","Commander":"SUV","Compass":"SUV","Gladiator":"Pickup Truck","Grand Cherokee":"SUV","Grand Wagoneer":"SUV","Liberty":"SUV","Patriot":"SUV","Renegade":"SUV","Wagoneer":"SUV","Wrangler":"SUV","Wrangler 4xe":"SUV"},"Kawasaki":{"Concours":"Touring Bike","KLR650":"Dual-Sport","Ninja":"Sport Bike","Versys":"Adventure Bike","Vulcan":"Cruiser","Z Series":"Standard Motorcycle"},"Kenworth":{"C500":"Commercial Truck","K270":"Commercial Truck","K370":"Commercial Truck","T280":"Commercial Truck","T380":"Commercial Truck","T480":"Commercial Truck","T680":"Commercial Truck","T800":"Commercial Truck","T880":"Commercial Truck","W900":"Commercial Truck","W990":"Commercial Truck"},"Kia":{"Amanti":"Sedan","Borrego":"SUV","Cadenza":"Sedan","Carnival":"Minivan","EV6":"SUV","EV9":"SUV","Forte":"Sedan","K5":"Sedan","K900":"Sedan","Niro":"SUV","Optima":"Sedan","Rio":"Sedan","Rondo":"Wagon","Sedona":"Minivan","Seltos":"SUV","Sephia":"Sedan","Sorento":"SUV","Soul":"Wagon","Spectra":"Sedan","Sportage":"SUV","Stinger":"Sedan","Telluride":"SUV"},"KTM":{"Adventure Series":"Adventure Bike","Duke Series":"Standard Motorcycle","EXC-F Series":"Dual-Sport","RC Series":"Sport Bike"},"Land Rover":{"Defender":"SUV","Discovery":"SUV","Discovery Sport":"SUV","Freelander":"SUV","LR2":"SUV","LR3":"SUV","LR4":"SUV","Range Rover":"SUV","Range Rover Evoque":"SUV","Range Rover Sport":"SUV","Range Rover Velar":"SUV"},"Lexus":{"CT":"Hatchback","ES":"Sedan","GS":"Sedan","GX":"SUV","HS":"Sedan","IS":"Sedan","LC":"Coupe","LFA":"Sports Car","LS":"Sedan","LX":"SUV","NX":"SUV","RC":"Coupe","RX":"SUV","RZ":"SUV","SC":"Convertible","TX":"SUV"},"Lincoln":{"Aviator":"SUV","Blackwood":"Pickup Truck","Continental":"Sedan","Corsair":"SUV","LS":"Sedan","Mark LT":"Pickup Truck","Mark VIII":"Coupe","MKS":"Sedan","MKT":"SUV","MKX":"SUV","MKZ":"Sedan","Nautilus":"SUV","Navigator":"SUV","Town Car":"Sedan","Zephyr":"Sedan"},"Lucid":{"Air":"Sedan"},"Mack":{"Anthem":"Commercial Truck","Granite":"Commercial Truck","LR":"Commercial Truck","MD Series":"Commercial Truck","Pinnacle":"Commercial Truck","TerraPro":"Commercial Truck"},"Maserati":{"Ghibli":"Sedan","GranTurismo":"Coupe","Grecale":"SUV","Levante":"SUV","MC20":"Sports Car","Quattroporte":"Sedan"},"Mazda":{"2":"Hatchback","3":"Sedan","5":"Minivan","6":"Sedan","626":"Sedan","CX-3":"SUV","CX-30":"SUV","CX-5":"SUV","CX-50":"SUV","CX-7":"SUV","CX-9":"SUV","CX-90":"SUV","Mazda3":"Sedan","Mazda5":"Minivan","Mazda6":"Sedan","Millenia":"Sedan","MPV":"Minivan","MX-3":"Coupe","MX-5 Miata":"Convertible","MX-6":"Coupe","Protege":"Sedan","RX-7":"Sports Car","RX-8":"Coupe","Tribute":"SUV"},"Mercedes-Benz":{"A-Class":"Sedan","AMG GT":"Sports Car","B-Class":"Hatchback","C-Class":"Sedan","CL-Class":"Coupe","CLA":"Sedan","CLK-Class":"Coupe","CLS":"Sedan","E-Class":"Sedan","eSprinter":"Cargo Van","EQB":"SUV","EQE":"Sedan","EQS":"Sedan","G-Class":"SUV","GL-Class":"SUV","GLA":"SUV","GLB":"SUV","GLC":"SUV","GLE":"SUV","GLK-Class":"SUV","GLS":"SUV","M-Class":"SUV","Metris":"Cargo Van","R-Class":"Minivan","S-Class":"Sedan","SL-Class":"Convertible","SLK-Class":"Convertible","Sprinter":"Cargo Van"},"Mercury":{"Capri":"Convertible","Cougar":"Coupe","Grand Marquis":"Sedan","Marauder":"Sedan","Mariner":"SUV","Milan":"Sedan","Montego":"Sedan","Mountaineer":"SUV","Mystique":"Sedan","Sable":"Sedan","Topaz":"Sedan","Tracer":"Sedan","Villager":"Minivan"},"Mini":{"Clubman":"Wagon","Convertible":"Convertible","Countryman":"SUV","Hardtop":"Hatchback"},"Mitsubishi":{"3000GT":"Sports Car","Diamante":"Sedan","Eclipse":"Coupe","Eclipse Cross":"SUV","Endeavor":"SUV","Galant":"Sedan","i-MiEV":"Hatchback","Lancer":"Sedan","Mirage":"Hatchback","Mirage G4":"Sedan","Montero":"SUV","Montero Sport":"SUV","Outlander":"SUV","Outlander PHEV":"SUV","Outlander Sport":"SUV","Raider":"Pickup Truck"},"Mitsubishi Fuso":{"Canter":"Commercial Truck","eCanter":"Commercial Truck","FA/FI Series":"Commercial Truck","FE/FG Series":"Commercial Truck"},"Moto Guzzi":{"V100 Mandello":"Touring Bike","V7":"Standard Motorcycle","V85 TT":"Adventure Bike","V9":"Cruiser"},"MV Agusta":{"Brutale":"Standard Motorcycle","Dragster":"Standard Motorcycle","F3":"Sport Bike","Turismo Veloce":"Touring Bike"},"Nissan":{"200SX":"Coupe","240SX":"Coupe","300ZX":"Sports Car","350Z":"Sports Car","370Z":"Sports Car","Altima":"Sedan","Ariya":"SUV","Armada":"SUV","Cube":"Wagon","Frontier":"Pickup Truck","GT-R":"Sports Car","Juke":"SUV","Kicks":"SUV","Leaf":"Hatchback","Maxima":"Sedan","Murano":"SUV","NV":"Cargo Van","NV200":"Cargo Van","Pathfinder":"SUV","Pulsar":"Hatchback","Quest":"Minivan","Rogue":"SUV","Sentra":"Sedan","Stanza":"Sedan","Titan":"Pickup Truck","Titan XD":"Pickup Truck","Versa":"Sedan","Xterra":"SUV","Z":"Sports Car"},"Norton":{"Commando 961":"Standard Motorcycle","V4SV":"Sport Bike"},"Peterbilt":{"220":"Commercial Truck","325":"Commercial Truck","330":"Commercial Truck","337":"Commercial Truck","348":"Commercial Truck","365":"Commercial Truck","367":"Commercial Truck","389":"Commercial Truck","520":"Commercial Truck","536":"Commercial Truck","537":"Commercial Truck","548":"Commercial Truck","567":"Commercial Truck","579":"Commercial Truck","589":"Commercial Truck"},"Piaggio":{"Beverly":"Scooter","Liberty":"Scooter","MP3":"Scooter"},"Polestar":{"Polestar 1":"Coupe","Polestar 2":"Sedan","Polestar 3":"SUV"},"Pontiac":{"6000":"Sedan","Aztek":"SUV","Bonneville":"Sedan","Fiero":"Sports Car","Firebird":"Coupe","G3":"Hatchback","G5":"Coupe","G6":"Sedan","G8":"Sedan","Grand Am":"Sedan","Grand Prix":"Sedan","GTO":"Coupe","LeMans":"Hatchback","Montana":"Minivan","Solstice":"Convertible","Sunbird":"Sedan","Sunfire":"Sedan","Torrent":"SUV","Trans Sport":"Minivan","Vibe":"Wagon"},"Porsche":{"718 Boxster":"Convertible","718 Cayman":"Coupe","911":"Sports Car","928":"Sports Car","944":"Sports Car","Carrera GT":"Sports Car","Cayenne":"SUV","Macan":"SUV","Panamera":"Sedan","Taycan":"Sedan"},"Ram":{"1500":"Pickup Truck","2500":"Pickup Truck","3500":"Pickup Truck","4500":"Commercial Truck","5500":"Commercial Truck","Chassis Cab":"Commercial Truck","ProMaster":"Cargo Van","ProMaster City":"Cargo Van"},"Rivian":{"R1S":"SUV","R1T":"Pickup Truck"},"Royal Enfield":{"Classic 350":"Standard Motorcycle","Continental GT":"Standard Motorcycle","Himalayan":"Adventure Bike","Interceptor 650":"Standard Motorcycle"},"Saab":{"9-2X":"Wagon","9-3":"Sedan","9-4X":"SUV","9-5":"Sedan","9-7X":"SUV","900":"Sedan","9000":"Sedan"},"Saturn":{"Astra":"Hatchback","Aura":"Sedan","Ion":"Sedan","L-Series":"Sedan","Outlook":"SUV","Relay":"Minivan","S-Series":"Sedan","Sky":"Convertible","Vue":"SUV"},"Scion":{"FR-S":"Coupe","iA":"Sedan","iM":"Hatchback","iQ":"Hatchback","tC":"Coupe","xA":"Hatchback","xB":"Wagon","xD":"Hatchback"},"Subaru":{"Ascent":"SUV","B9 Tribeca":"SUV","Baja":"Pickup Truck","BRZ":"Coupe","Crosstrek":"SUV","Forester":"SUV","Impreza":"Sedan","Justy":"Hatchback","Legacy":"Sedan","Loyale":"Wagon","Outback":"Wagon","Solterra":"SUV","SVX":"Coupe","Tribeca":"SUV","WRX":"Sedan","XT":"Coupe"},"Suzuki":{"Aerio":"Sedan","DR-Z400S":"Dual-Sport","Equator":"Pickup Truck","Esteem":"Sedan","Forenza":"Sedan","Grand Vitara":"SUV","GSX-R Series":"Sport Bike","Hayabusa":"Sport Bike","Katana":"Sport Bike","Kizashi":"Sedan","Reno":"Hatchback","Samurai":"SUV","Sidekick":"SUV","SV650":"Standard Motorcycle","Swift":"Hatchback","SX4":"Hatchback","V-Strom":"Adventure Bike","Verona":"Sedan","Vitara":"SUV","X-90":"SUV","XL7":"SUV"},"Tesla":{"Cybertruck":"Pickup Truck","Model 3":"Sedan","Model S":"Sedan","Model X":"SUV","Model Y":"SUV","Roadster":"Sports Car","Semi":"Commercial Truck"},"Toyota":{"4Runner":"SUV","86":"Coupe","Avalon":"Sedan","bZ4X":"SUV","C-HR":"SUV","Camry":"Sedan","Celica":"Coupe","Corolla":"Sedan","Corolla Cross":"SUV","Corolla Hatchback":"Hatchback","Corolla iM":"Hatchback","Cressida":"Sedan","Crown":"Sedan","Echo":"Sedan","FJ Cruiser":"SUV","GR Corolla":"Hatchback","GR Supra":"Sports Car","GR86":"Coupe","Grand Highlander":"SUV","Highlander":"SUV","Land Cruiser":"SUV","Matrix":"Wagon","Mirai":"Sedan","MR2 / MR2 Spyder":"Sports Car","Paseo":"Coupe","Previa":"Minivan","Prius":"Hatchback","Prius Prime":"Hatchback","RAV4":"SUV","RAV4 Prime":"SUV","Sequoia":"SUV","Sienna":"Minivan","Solara":"Coupe","Supra":"Sports Car","T100":"Pickup Truck","Tacoma":"Pickup Truck","Tercel":"Sedan","Tundra":"Pickup Truck","Venza":"SUV","Yaris":"Hatchback"},"Triumph":{"Bonneville":"Standard Motorcycle","Rocket 3":"Cruiser","Scrambler":"Standard Motorcycle","Speed Triple":"Standard Motorcycle","Street Triple":"Standard Motorcycle","Tiger":"Adventure Bike","Trident":"Standard Motorcycle"},"Vespa":{"GTS":"Scooter","Primavera":"Scooter","Sprint":"Scooter"},"Volkswagen":{"Arteon":"Sedan","Atlas":"SUV","Atlas Cross Sport":"SUV","Beetle":"Hatchback","Cabrio":"Convertible","CC":"Sedan","Corrado":"Coupe","Eos":"Convertible","Fox":"Sedan","Golf":"Hatchback","Golf R":"Hatchback","GTI":"Hatchback","ID.4":"SUV","Jetta":"Sedan","Jetta GLI":"Sedan","New Beetle":"Hatchback","Passat":"Sedan","Phaeton":"Sedan","Rabbit":"Hatchback","Routan":"Minivan","Taos":"SUV","Tiguan":"SUV","Touareg":"SUV","Vanagon":"Minivan"},"Volvo":{"C30":"Hatchback","C40 Recharge":"SUV","C70":"Convertible","S40":"Sedan","S60":"Sedan","S70":"Sedan","S80":"Sedan","S90":"Sedan","V40":"Wagon","V50":"Wagon","V60":"Wagon","V70":"Wagon","V90":"Wagon","VHD":"Commercial Truck","VNL":"Commercial Truck","VNR":"Commercial Truck","XC40":"SUV","XC60":"SUV","XC70":"Wagon","XC90":"SUV"},"Yamaha":{"Bolt":"Cruiser","MT Series":"Standard Motorcycle","Super Ténéré":"Adventure Bike","Tracer 9":"Touring Bike","TW200":"Dual-Sport","VMAX":"Cruiser","V Star":"Cruiser","XSR Series":"Standard Motorcycle","YZF-R Series":"Sport Bike","Zuma":"Scooter"},"Zero Motorcycles":{"DSR/X":"Adventure Bike","FXE":"Standard Motorcycle","SR/F":"Standard Motorcycle","SR/S":"Sport Bike"},"Other":{"Other":"Other"}};
  const vehicleMakes = Object.keys(vehicleSubtype).sort();
  const vehicleColors = ["Beige","Black","Blue","Brown","Burgundy","Charcoal","Dark Blue","Dark Green","Gold","Gray","Green","Light Blue","Orange","Red","Silver","Tan","White","Yellow"].sort();

  const commentBuilderData = {
    templates: ["_____.","_____ _____.","_____ _____ _____.","_____ _____ _____ _____.","Ignorance of _____.","If only I had a _____.","If only I had a _____, then _____.","_____ ahead, therefore _____.","Could this be a _____?","Behold, _____!","Offer _____.","Praise the _____.","Try _____.","Beware of _____.","Time for _____.","_____ required ahead.","No _____ here, move along.","Watch for _____ ahead.","Do not trust _____.","Unexpected _____ incoming.","Approach _____ with caution.","Prepare for _____.","Caution: _____ zone.","Look out for _____.","Expect _____ ahead.","Proceed with _____.","_____ detected, slow down.","Immediate _____ recommended.","_____ spotted nearby.","Engage _____ mode.","_____ is inevitable.","May the _____ guide you.","You must gather your _____ before venturing forth.","Visions of _____...","_____ awaits.","_____, but _____.","First _____, then _____.","Look _____, O, look _____.","Why is it always _____?"],
    words: {
      people_archetypes:["college kid","cyclist","driver","fool","hero","impatient driver","legend","lost driver","pedestrian","police","road rager","slowpoke","speeder","student driver","tailgater","texter","tourist","villain"],
      vehicles:["beater","bus","car","convertible","delivery truck","farm equipment","garbage truck","mail truck","motorcycle","RV","semi","sports car","SUV","tractor","truck"],
      road_features:["blind spot","construction","crosswalk","deer crossing","detour","dirt road","exit ramp","fire hydrant","four-way stop","gridlock","merge lane","oncoming lane","one-lane bridge","parking spot","passing zone","pothole","railroad crossing","road work","roundabout","school zone","sharp curve","speed bump","speed trap","steep hill","traffic jam"],
      maneuvers_actions:["accelerating","braking","changing lanes","coasting","decelerating","drifting","merging","parallel parking","parking","passing","perfect park","signaling","slowing down","speeding","speeding up","three-point turn","turning","U-turn","yielding"],
      driver_errors:["bad parking","blocking the lane","brake checking","cutting off","distracted driving","double parking","erratic steering","following too closely","hesitation","honking","ignoring signs","ignoring speed limit","late braking","no lights","road rage","rolling stop","running a red light","tailgating","wide turn"],
      concepts_states:["agony","caution","confusion","despair","doom","faith","focus","frustration","grace","haste","joy","patience","relief","ruin","skill","urgency"],
      qualities_adjectives:["aggressive","cautious","courteous","erratic","fast","flawless","good","hesitant","illegal","inconsiderate","lawful","oblivious","predictable","questionable","reckless","skillful","sloppy","slow","smooth","steady","sudden","terrible","unexpected","unlawful","unpredictable"],
      directions:["adjacent","ahead","behind","everywhere","far","left","near","oncoming","right"],
      phrases:["breaking the speed limit","burning rubber","close call","dead end","failure to yield","fender bender","heavy traffic","last minute turn","left lane camper","moment of silence","right-of-way","sudden stop","test of patience","wrong turn"],
      conjunctions:["all the more","and","and then","but","eventually","except for","if only","in short","in the end","or","therefore"],
      items_gestures:["a head nod","a shrug","a wave","angry stare","brake lights","hand gestures","hazard lights","headlights","high beams","horn","middle finger","thumbs-up","turn signal"],
      modes_stances:["autopilot","beast mode","cruise control","defensive driving","offensive driving","stealth mode","turtle mode","zen mode"],
      guidance:["common sense","GPS","intuition","local knowledge","muscle memory","road signs","streetlights","the dotted line","the North Star"]
    }
  };

  // ---------- STATE ----------
  const state = {
    users: [],
    reviews: [],
    badges: [],
    userBadges: [],
    reviewVotes: [],
    usernameMap: {},
    filters: {
      username: localStorage.getItem('filter_username') || '',
      global: localStorage.getItem('filter_global') || ''
    },
    sort: {
      users: { key: 'id', direction: 'asc' },
      reviews: { key: 'created_at', direction: 'desc' },
      badges: { key: 'badge_id', direction: 'asc' },
      userBadges: { key: 'earned_at', direction: 'desc' },
      reviewVotes: { key: 'created_at', direction: 'desc' }
    },
    paging: {
      users: { page: 1, size: parseInt(localStorage.getItem('size_users')||'25',10) },
      reviews: { page: 1, size: parseInt(localStorage.getItem('size_reviews')||'50',10) },
      votes: { page: 1, size: parseInt(localStorage.getItem('size_votes')||'50',10) },
      userBadges: { page: 1, size: parseInt(localStorage.getItem('size_userBadges')||'50',10) }
    },
    charts: {},
    chartRange: localStorage.getItem('chart_range') || '90',
    density: localStorage.getItem('density') || 'comfortable',
    activeTab: localStorage.getItem('admin_tab') || 'dashboard',
    // NEW: selected users for bulk ops (Set of user IDs)
    selectedUserIds: new Set()
  };

  // ---------- ELEMENTS ----------
  const els = {
    // header
    darkToggle: byId('dark-toggle'),
    densityToggle: byId('density-toggle'),
    refreshBtn: byId('refresh-btn'),
    globalFilter: byId('global-filter'),
    globalFilterMobile: byId('global-filter-mobile'),
    // stats
    stats: {
      totalUsers: byId('total-users'),
      totalReviews: byId('total-reviews'),
      totalBadges: byId('total-badges'),
      totalUserBadges: byId('total-user-badges'),
      totalVotes: byId('total-votes'),
    },
    // filter
    filterInput: byId('user-filter'),
    clearUserFilter: byId('clear-user-filter'),
    suggestions: byId('autocomplete-suggestions'),
    // selection box
    selectionDropzone: byId('selection-dropzone'),
    selectionHint: byId('selection-hint'),
    selectedChips: byId('selected-users-chips'),
    selectedCount: byId('selected-count'),
    addFilteredToSelection: byId('add-filtered-to-selection'),
    clearSelectionBtn: byId('clear-selection'),
    // tabs
    tabs: qsa('.tab-button'),
    contents: qsa('.tab-content'),
    // users
    usersBody: byId('users-table-body'),
    userCount: byId('users-count'),
    usersPage: byId('users-page'),
    usersPrev: byId('users-prev'),
    usersNext: byId('users-next'),
    usersPageSize: byId('users-page-size'),
    exportUsers: byId('export-users'),
    // badges
    badgesBody: byId('badges-table-body'),
    exportBadges: byId('export-badges'),
    // userBadges table
    userBadgesBody: byId('user-badges-table-body'),
    userBadgesCount: byId('userBadges-count'),
    userBadgesPage: byId('userBadges-page'),
    userBadgesPrev: byId('userBadges-prev'),
    userBadgesNext: byId('userBadges-next'),
    userBadgesPageSize: byId('userBadges-page-size'),
    exportUserBadges: byId('export-user-badges'),
    // reviews
    reviewsBody: byId('reviews-table-body'),
    reviewsCount: byId('reviews-count'),
    reviewsPage: byId('reviews-page'),
    reviewsPrev: byId('reviews-prev'),
    reviewsNext: byId('reviews-next'),
    reviewsPageSize: byId('reviews-page-size'),
    exportReviews: byId('export-reviews'),
    reviewsCheckAll: byId('reviews-check-all'),
    bulkDeleteReviews: byId('bulk-delete-reviews'),
    // votes
    votesBody: byId('review-votes-table-body'),
    votesCount: byId('votes-count'),
    votesPage: byId('votes-page'),
    votesPrev: byId('votes-prev'),
    votesNext: byId('votes-next'),
    votesPageSize: byId('votes-page-size'),
    exportVotes: byId('export-votes'),
    // charts
    chartUsers: byId('chart-users'),
    chartRatings: byId('chart-ratings'),
    rangeButtons: byId('range-buttons'),
    // modals
    modal: byId('manage-user-modal'),
    modalClose: byId('close-modal-btn'),
    modalUsername: byId('modal-username'),
    modalFirst: byId('modal-first-name'),
    modalEmail: byId('modal-email'),
    modalIsAdmin: byId('modal-is-admin'),
    modalPass: byId('modal-new-password'),
    modalShowPass: byId('modal-show-password-toggle'),
    modalVehicleMake: byId('modal-vehicle-make'),
    modalVehicleModel: byId('modal-vehicle-model'),
    modalVehicleYear: byId('modal-vehicle-year'),
    modalVehicleColor: byId('modal-vehicle-color'),
    modalBioTemplate: byId('modal-bio-template'),
    modalBioWords: byId('modal-bio-words-container'),
    modalBadgeSelect: byId('modal-badge-select'),
    modalUserBadges: byId('modal-user-badges'),
    saveUserBtn: byId('save-user-btn'),
    editUserMsg: byId('edit-user-message'),
    awardBadgeBtn: byId('award-badge-btn'),
    awardBadgeMsg: byId('award-badge-message'),
    grantAllBtn: byId('grant-all-badges-btn'),
    removeAllBtn: byId('remove-all-badges-btn'),
    // delete modal
    delModal: byId('delete-user-modal'),
    delBtnCloseTop: byId('cancel-delete-btn'),
    delBtnCancel: byId('cancel-delete-action-btn'),
    delBtnConfirm: byId('confirm-delete-action-btn'),
    delCheckbox: byId('confirm-delete-checkbox'),
    delPassword: byId('admin-password-input'),
    delError: byId('delete-user-error-message'),
    // toast + bulk labels
    toast: byId('toast-container'),
    bulkBadgeSelect: byId('bulk-badge-select'),
    bulkAwardBtn: byId('bulk-award-btn'),
    bulkGrantAll: byId('bulk-grant-all'),
    bulkRemoveAll: byId('bulk-remove-all'),
    bulkBadgeMsg: byId('bulk-badge-msg'),
    bulkTargetLabel: byId('bulk-target-label')
  };

  // ---------- UTILITIES ----------
  function byId(id){ return document.getElementById(id); }
  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
  const debounce = (fn, ms=250) => { let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), ms); }; };

  const withAuth = (init={}) => {
    const headers = new Headers(init.headers || {});
    headers.set('Authorization', `Bearer ${authToken}`);
    if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json');
    return { ...init, headers };
  };

  const fetchJSON = async (url, init) => {
    const res = await fetch(url, withAuth(init));
    if (res.status === 401) {
      localStorage.removeItem('token'); localStorage.removeItem('isAdmin');
      window.location.href = '/home.html';
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try { const d = await res.json(); msg = d.message || d.error || JSON.stringify(d); } catch {}
      const err = new Error(msg); err.status = res.status; throw err;
    }
    return res.json();
  };

  const toast = (msg, type='info') => {
    const div = document.createElement('div');
    div.className = `px-3 py-2 rounded-md shadow border text-sm ${
      type==='success'?'bg-green-600 text-white border-green-700':
      type==='error'?'bg-red-600 text-white border-red-700':
      type==='warn'?'bg-yellow-500 text-white border-yellow-600':
      'bg-gray-900 text-white border-gray-800'
    }`;
    div.textContent = msg;
    els.toast.appendChild(div);
    setTimeout(()=>div.remove(), 3000);
  };

  const isDateStr = v => typeof v === 'string' && !isNaN(Date.parse(v));
  const fmtDate = v => { const d=new Date(v); return isNaN(d)?'—':d.toLocaleDateString(); };
  const fmtDateTime = v => { const d=new Date(v); return isNaN(d)?'—':d.toLocaleString(); };

  const sortData = (data, sortKey, direction) => {
    const dir = direction === 'asc' ? 1 : -1;
    return [...data].sort((a,b)=>{
      const va=a?.[sortKey], vb=b?.[sortKey];
      if (va==null && vb==null) return 0;
      if (va==null) return 1;
      if (vb==null) return -1;
      if (isDateStr(va) && isDateStr(vb)) {
        const cmp = new Date(va)-new Date(vb);
        return cmp===0?0:(cmp>0?dir:-dir);
      }
      if (typeof va==='string' && typeof vb==='string') {
        const cmp = va.localeCompare(vb, undefined, {numeric:true, sensitivity:'base'});
        return cmp===0?0:(cmp>0?dir:-dir);
      }
      if (va===vb) return 0;
      return (va>vb?1:-1)*dir;
    });
  };
  const paginate = (arr, page, size) => arr.slice((page-1)*size, (page-1)*size + size);
  const csvEscape = v => v==null ? '' : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g,'""')}"` : String(v);
  const downloadCSV = (rows, filename) => {
    const csv = rows.map(r => r.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=filename; a.click();
    URL.revokeObjectURL(url);
  };
  const escapeHtml = (str) => (str==null ? '' : String(str).replace(/[&<>"'`=\/]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'}[s])));

  // ---------- DARK & DENSITY ----------
  const darkPref = localStorage.getItem('dark') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? '1' : '0');
  if (darkPref==='1') document.documentElement.classList.add('dark');

  function applyDensity(){
    const compact = state.density === 'compact';
    document.documentElement.classList.toggle('text-[15px]', compact);
    els.densityToggle.textContent = compact ? 'Comfortable' : 'Compact';
  }
  applyDensity();

  els.darkToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('dark', document.documentElement.classList.contains('dark')?'1':'0');
  });
  els.densityToggle.addEventListener('click', ()=>{
    state.density = state.density==='compact' ? 'comfortable' : 'compact';
    localStorage.setItem('density', state.density);
    applyDensity();
  });

  // ---------- GLOBAL FILTER ----------
  const updateGlobalFilter = debounce((val)=>{
    state.filters.global = val.trim();
    localStorage.setItem('filter_global', state.filters.global);
    renderAll();
  }, 150);
  [els.globalFilter, els.globalFilterMobile].forEach(inp=>{
    if (!inp) return;
    inp.value = state.filters.global || '';
    inp.addEventListener('input', e => updateGlobalFilter(e.target.value));
  });

  // ---------- FETCH ----------
  const showLoadingRows = (tbody, cols, count=6) => {
    tbody.innerHTML = '';
    for (let i=0;i<count;i++){
      const tr=document.createElement('tr');
      for (let c=0;c<cols;c++){
        const td=document.createElement('td'); td.className='px-4 py-2';
        td.innerHTML = `<div class="h-4 skeleton rounded"></div>`;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  };

  const fetchAll = async () => {
    showLoadingRows(els.usersBody, 6);
    showLoadingRows(els.badgesBody, 3);
    showLoadingRows(els.userBadgesBody, 4);
    showLoadingRows(els.reviewsBody, 8);
    showLoadingRows(els.votesBody, 5);

    const [users, reviews, badges, userBadges, reviewVotes] = await Promise.all([
      fetchJSON(`${API_URL}/users`),
      fetchJSON(`${API_URL}/admin/reviews`),
      fetchJSON(`${API_URL}/admin/badges`),
      fetchJSON(`${API_URL}/user_badges`),
      fetchJSON(`${API_URL}/review_votes`)
    ]);

    state.users = users;
    state.reviews = reviews;
    state.badges = badges;
    state.userBadges = userBadges;
    state.reviewVotes = reviewVotes;

    state.usernameMap = {};
    for (const u of users) state.usernameMap[u.id] = u.username;

    fillBulkBadgeSelect();
    renderAll();
    buildCharts();
  };

  // ---------- MATCH HELPERS ----------
  const globalMatch = (text) => {
    const q = (state.filters.global||'').toLowerCase();
    if (!q) return true;
    return String(text||'').toLowerCase().includes(q);
  };
  const usernamePartialMatch = (username) => {
    const f = (state.filters.username||'').trim().toLowerCase();
    if (!f) return true;
    return String(username||'').toLowerCase().includes(f);
  };

  // ---------- RENDER ----------
  const updateStats = () => {
    els.stats.totalUsers.textContent = state.users.length;
    els.stats.totalReviews.textContent = state.reviews.length;
    els.stats.totalBadges.textContent = state.badges.length;
    els.stats.totalUserBadges.textContent = state.userBadges.length;
    els.stats.totalVotes.textContent = state.reviewVotes.length;
  };

  const renderUsers = () => {
    let rows = state.users.filter(u =>
      usernamePartialMatch(u.username) &&
      (globalMatch(u.username) || globalMatch(u.first_name) || globalMatch(u.email))
    );
    rows = sortData(rows, state.sort.users.key, state.sort.users.direction);

    const total = rows.length;
    const page = state.paging.users.page;
    const size = +state.paging.users.size || 25;
    const maxPage = Math.max(1, Math.ceil(total/size));
    if (page>maxPage) state.paging.users.page = maxPage;
    const pageRows = paginate(rows, state.paging.users.page, size);

    els.usersBody.innerHTML = '';
    if (!pageRows.length) {
      els.usersBody.innerHTML = `<tr><td colspan="6" class="px-4 py-6 text-center text-gray-500">No users found.</td></tr>`;
    } else {
      for (const u of pageRows) {
        const tr = document.createElement('tr');
        tr.className = 'user-row hover:bg-gray-50 dark:hover:bg-gray-800';
        tr.dataset.id = String(u.id);
        tr.draggable = true;
        if (state.selectedUserIds.has(u.id)) tr.classList.add('selected');

        tr.addEventListener('dragstart', (ev)=>{
          ev.dataTransfer.setData('text/plain', String(u.id));
          ev.dataTransfer.effectAllowed = 'copyMove';
        });

        tr.innerHTML = `
          <td class="px-4 py-2">${u.id}</td>
          <td class="px-4 py-2">${escapeHtml(u.username)}</td>
          <td class="px-4 py-2">${escapeHtml(u.first_name||'')}</td>
          <td class="px-4 py-2">${escapeHtml(u.email||'')}</td>
          <td class="px-4 py-2">${fmtDate(u.created_at)}</td>
          <td class="px-4 py-2 text-right whitespace-nowrap">
            <button class="text-blue-600 hover:underline manage-user-btn" data-id="${u.id}">Manage</button>
            <button class="ml-3 text-gray-700 dark:text-gray-300 hover:underline quick-select-btn" data-id="${u.id}">Select</button>
            <button class="ml-3 text-red-600 hover:underline delete-user-btn" data-id="${u.id}" data-username="${escapeHtml(u.username)}">Delete</button>
          </td>`;
        els.usersBody.appendChild(tr);
      }
    }

    els.userCount.textContent = `Showing ${pageRows.length} of ${total} ${total===1?'user':'users'}`;
    els.usersPage.textContent = `Page ${state.paging.users.page} / ${Math.max(1,Math.ceil(total/size))}`;
  };

  const renderBadges = () => {
    const rows = sortData(state.badges, state.sort.badges.key, state.sort.badges.direction)
      .filter(b => globalMatch(b.name) || globalMatch(b.description) || globalMatch(b.badge_id));
    els.badgesBody.innerHTML = rows.length
      ? rows.map(b=>`<tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
          <td class="px-4 py-2">${b.badge_id}</td>
          <td class="px-4 py-2">${escapeHtml(b.name)}</td>
          <td class="px-4 py-2">${escapeHtml(b.description||'')}</td>
        </tr>`).join('')
      : `<tr><td colspan="3" class="px-4 py-6 text-center text-gray-500">No badges.</td></tr>`;
  };

  const renderUserBadges = () => {
    let rows = state.userBadges.map(ub => ({
      ...ub,
      user_label: state.usernameMap[ub.user_id] || ub.user_id
    })).filter(r => usernamePartialMatch(r.user_label) && (globalMatch(r.user_label) || globalMatch(r.badge_id)));
    rows = sortData(rows, state.sort.userBadges.key, state.sort.userBadges.direction);

    const total = rows.length;
    const size = +state.paging.userBadges.size || 50;
    const page = state.paging.userBadges.page;
    const maxPage = Math.max(1, Math.ceil(total/size));
    if (page>maxPage) state.paging.userBadges.page = maxPage;
    const pageRows = paginate(rows, state.paging.userBadges.page, size);

    els.userBadgesBody.innerHTML = pageRows.length
      ? pageRows.map(r=>`<tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
          <td class="px-4 py-2">${r.id}</td>
          <td class="px-4 py-2">${escapeHtml(r.user_label)}</td>
          <td class="px-4 py-2">${r.badge_id}</td>
          <td class="px-4 py-2">${fmtDateTime(r.earned_at)}</td>
        </tr>`).join('')
      : `<tr><td colspan="4" class="px-4 py-6 text-center text-gray-500">No earned badges.</td></tr>`;
    els.userBadgesCount.textContent = `Showing ${pageRows.length} of ${total}`;
    els.userBadgesPage.textContent = `Page ${state.paging.userBadges.page} / ${Math.max(1,Math.ceil(total/size))}`;
  };

  const renderReviews = () => {
    let rows = state.reviews.map(r => ({
      ...r,
      user_label: state.usernameMap[r.user_id] || r.user_id
    })).filter(r =>
      usernamePartialMatch(r.user_label) &&
      (globalMatch(r.user_label) || globalMatch(r.plate_number) || globalMatch(r.status) || globalMatch(r.id))
    );
    rows = sortData(rows, state.sort.reviews.key, state.sort.reviews.direction);

    const total = rows.length;
    const size = +state.paging.reviews.size || 50;
    const page = state.paging.reviews.page;
    const maxPage = Math.max(1, Math.ceil(total/size));
    if (page>maxPage) state.paging.reviews.page = maxPage;
    const pageRows = paginate(rows, state.paging.reviews.page, size);

    els.reviewsBody.innerHTML = pageRows.length
      ? pageRows.map(r=>`<tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
          <td class="px-4 py-2"><input type="checkbox" class="review-check" data-id="${r.id}"/></td>
          <td class="px-4 py-2">${r.id}</td>
          <td class="px-4 py-2">${escapeHtml(r.plate_number)}</td>
          <td class="px-4 py-2">${escapeHtml(r.user_label)}</td>
          <td class="px-4 py-2">${r.rating}</td>
          <td class="px-4 py-2">${escapeHtml(r.status||'')}</td>
          <td class="px-4 py-2">${fmtDateTime(r.created_at)}</td>
          <td class="px-4 py-2 text-right">
            <button class="text-red-600 hover:underline delete-review-btn" data-id="${r.id}">Delete</button>
          </td>
        </tr>`).join('')
      : `<tr><td colspan="8" class="px-4 py-6 text-center text-gray-500">No reviews.</td></tr>`;
    els.reviewsCount.textContent = `Showing ${pageRows.length} of ${total}`;
    els.reviewsPage.textContent = `Page ${state.paging.reviews.page} / ${Math.max(1,Math.ceil(total/size))}`;
  };

  const renderVotes = () => {
    let rows = state.reviewVotes.map(v => ({
      ...v,
      user_label: state.usernameMap[v.user_id] || v.user_id
    })).filter(v =>
      usernamePartialMatch(v.user_label) &&
      (globalMatch(v.user_label) || globalMatch(v.review_id) || globalMatch(v.vote_type))
    );
    rows = sortData(rows, state.sort.reviewVotes.key, state.sort.reviewVotes.direction);

    const total = rows.length;
    const size = +state.paging.votes.size || 50;
    const page = state.paging.votes.page;
    const maxPage = Math.max(1, Math.ceil(total/size));
    if (page>maxPage) state.paging.votes.page = maxPage;
    const pageRows = paginate(rows, state.paging.votes.page, size);

    els.votesBody.innerHTML = pageRows.length
      ? pageRows.map(v=>`<tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
          <td class="px-4 py-2">${v.id}</td>
          <td class="px-4 py-2">${v.review_id}</td>
          <td class="px-4 py-2">${escapeHtml(v.user_label)}</td>
          <td class="px-4 py-2">${escapeHtml(v.vote_type)}</td>
          <td class="px-4 py-2">${fmtDateTime(v.created_at)}</td>
        </tr>`).join('')
      : `<tr><td colspan="5" class="px-4 py-6 text-center text-gray-500">No votes.</td></tr>`;
    els.votesCount.textContent = `Showing ${pageRows.length} of ${total}`;
    els.votesPage.textContent = `Page ${state.paging.votes.page} / ${Math.max(1,Math.ceil(total/size))}`;
  };

  const renderSelection = () => {
    els.selectedChips.innerHTML = '';
    const ids = [...state.selectedUserIds];
    for (const id of ids) {
      const u = state.users.find(x=>x.id===id);
      const chip = document.createElement('div');
      chip.className = 'badge-chip';
      chip.draggable = true; // allow re-order if you like
      chip.innerHTML = `<span>${escapeHtml(u?.username || `User ${id}`)}</span>
                        <button class="ml-2 text-red-600 hover:text-red-800 remove-chip" data-id="${id}" title="Remove">&times;</button>`;
      els.selectedChips.appendChild(chip);
    }
    els.selectionHint.classList.toggle('hidden', ids.length>0);
    els.selectedCount.textContent = `(${ids.length})`;

    // Highlight rows that are selected
    qsa('tr.user-row').forEach(tr=>{
      const id = Number(tr.dataset.id);
      tr.classList.toggle('selected', state.selectedUserIds.has(id));
    });
  };

  const renderAll = () => {
    updateStats();
    renderUsers();
    renderBadges();
    renderUserBadges();
    renderReviews();
    renderVotes();
    updateSortIndicators();
    renderAutocomplete();
    renderSelection();
    persistPageSizes();
  };

  // ---------- SORT ----------
  function updateSortIndicators(){
    qsa('.sortable').forEach(th=>{
      const t = th.dataset.table, key = th.dataset.sortKey;
      th.classList.remove('asc','desc');
      if (state.sort[t]?.key === key) th.classList.add(state.sort[t].direction);
    });
  }
  qsa('.sortable').forEach(th=>{
    th.addEventListener('click', ()=>{
      const table = th.dataset.table, key = th.dataset.sortKey;
      const s = state.sort[table];
      if (s.key===key) s.direction = s.direction==='asc'?'desc':'asc';
      else { s.key=key; s.direction='asc'; }
      renderAll();
    });
  });

  // ---------- AUTOCOMPLETE + LIVE USERNAME FILTER ----------
  function renderAutocomplete(){
    els.filterInput.value = state.filters.username || '';
    const val = els.filterInput.value.trim().toLowerCase();
    const box = els.suggestions;
    box.innerHTML = '';
    if (!val) { box.classList.add('hidden'); return; }

    const matches = state.users.filter(u => u.username.toLowerCase().includes(val)).slice(0,10);
    if (!matches.length) { box.classList.add('hidden'); return; }

    for (const u of matches) {
      const item = document.createElement('div');
      item.className = 'p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer';
      item.textContent = u.username;
      item.addEventListener('pointerdown', (ev)=>{
        ev.preventDefault();
        els.filterInput.value = u.username;
        state.filters.username = u.username;
        localStorage.setItem('filter_username', state.filters.username);
        box.classList.add('hidden');
        renderAll();
      });
      box.appendChild(item);
    }
    box.classList.remove('hidden');
  }

  els.filterInput.addEventListener('input', debounce((e)=>{
    state.filters.username = e.target.value;
    localStorage.setItem('filter_username', state.filters.username);
    renderAll();
  }, 150));
  els.filterInput.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') els.suggestions.classList.add('hidden');
  });
  els.clearUserFilter.addEventListener('click', ()=>{
    state.filters.username = '';
    localStorage.setItem('filter_username', '');
    els.filterInput.value = '';
    els.suggestions.classList.add('hidden');
    renderAll();
  });
  document.addEventListener('click', (e)=>{
    if (!els.filterInput.contains(e.target) && !els.suggestions.contains(e.target)) {
      els.suggestions.classList.add('hidden');
    }
  });

  // ---------- PAGINATION ----------
  els.usersPrev.addEventListener('click', ()=>{ if (state.paging.users.page>1) {state.paging.users.page--; renderUsers();} });
  els.usersNext.addEventListener('click', ()=>{ state.paging.users.page++; renderUsers(); });
  els.usersPageSize.value = String(state.paging.users.size);
  els.usersPageSize.addEventListener('change', ()=>{
    state.paging.users.size = parseInt(els.usersPageSize.value,10);
    state.paging.users.page = 1; renderUsers();
  });

  els.userBadgesPrev.addEventListener('click', ()=>{ if (state.paging.userBadges.page>1) {state.paging.userBadges.page--; renderUserBadges();} });
  els.userBadgesNext.addEventListener('click', ()=>{ state.paging.userBadges.page++; renderUserBadges(); });
  els.userBadgesPageSize.value = String(state.paging.userBadges.size);
  els.userBadgesPageSize.addEventListener('change', ()=>{ state.paging.userBadges.size=parseInt(els.userBadgesPageSize.value,10); state.paging.userBadges.page=1; renderUserBadges(); });

  els.reviewsPrev.addEventListener('click', ()=>{ if (state.paging.reviews.page>1) {state.paging.reviews.page--; renderReviews();} });
  els.reviewsNext.addEventListener('click', ()=>{ state.paging.reviews.page++; renderReviews(); });
  els.reviewsPageSize.value = String(state.paging.reviews.size);
  els.reviewsPageSize.addEventListener('change', ()=>{ state.paging.reviews.size=parseInt(els.reviewsPageSize.value,10); state.paging.reviews.page=1; renderReviews(); });

  els.votesPrev.addEventListener('click', ()=>{ if (state.paging.votes.page>1) {state.paging.votes.page--; renderVotes();} });
  els.votesNext.addEventListener('click', ()=>{ state.paging.votes.page++; renderVotes(); });
  els.votesPageSize.value = String(state.paging.votes.size);
  els.votesPageSize.addEventListener('change', ()=>{ state.paging.votes.size=parseInt(els.votesPageSize.value,10); state.paging.votes.page=1; renderVotes(); });

  function persistPageSizes(){
    localStorage.setItem('size_users', String(state.paging.users.size));
    localStorage.setItem('size_reviews', String(state.paging.reviews.size));
    localStorage.setItem('size_votes', String(state.paging.votes.size));
    localStorage.setItem('size_userBadges', String(state.paging.userBadges.size));
  }

  // ---------- TAB SWITCH + PERSIST ----------
  function activateTab(id){
    qsa('.tab-button').forEach(b=>{
      b.classList.toggle('border-blue-600', b.dataset.tab===id);
      b.classList.toggle('text-blue-700', b.dataset.tab===id);
    });
    qsa('.tab-content').forEach(c=>c.classList.toggle('active', c.id===id));
    state.activeTab = id;
    localStorage.setItem('admin_tab', id);
  }
  els.tabs.forEach(btn=> btn.addEventListener('click', ()=>activateTab(btn.dataset.tab)));
  activateTab(state.activeTab);

  // ---------- TABLE ACTIONS ----------
  els.usersBody.addEventListener('click', (e)=>{
    const manageBtn = e.target.closest('.manage-user-btn');
    const delBtn = e.target.closest('.delete-user-btn');
    const selectBtn = e.target.closest('.quick-select-btn');
    if (manageBtn) openManageUserModal(Number(manageBtn.dataset.id));
    if (delBtn) openDeleteUserModal(Number(delBtn.dataset.id), delBtn.dataset.username);
    if (selectBtn) { addSelectedUser(Number(selectBtn.dataset.id)); }
  });

  // Reviews actions
  els.reviewsBody.addEventListener('click', async (e)=>{
    const del = e.target.closest('.delete-review-btn');
    if (!del) return;
    const id = Number(del.dataset.id);
    if (!confirm(`Delete review #${id}? This cannot be undone.`)) return;
    try {
      await fetchJSON(`${API_URL}/admin/reviews/${id}`, { method:'DELETE' });
      toast(`Review ${id} deleted.`, 'success');
      state.reviews = await fetchJSON(`${API_URL}/admin/reviews`);
      renderReviews();
      buildCharts();
    } catch (err) {
      console.error(err);
      toast(`Failed to delete review: ${err.message}`, 'error');
    }
  });

  // Bulk review delete
  byId('reviews-check-all').addEventListener('change', ()=>{
    qsa('.review-check').forEach(cb=>{ cb.checked = byId('reviews-check-all').checked; });
  });
  els.bulkDeleteReviews.addEventListener('click', async ()=>{
    const ids = qsa('.review-check:checked').map(cb=>Number(cb.dataset.id));
    if (!ids.length) return toast('No reviews selected.', 'warn');
    if (!confirm(`Delete ${ids.length} selected review(s)?`)) return;
    try {
      for (const id of ids) await fetchJSON(`${API_URL}/admin/reviews/${id}`, { method:'DELETE' });
      toast(`Deleted ${ids.length} review(s).`, 'success');
      state.reviews = await fetchJSON(`${API_URL}/admin/reviews`);
      renderReviews();
      buildCharts();
    } catch (err) {
      console.error(err);
      toast('Bulk delete failed.', 'error');
    }
  });

  // ---------- CSV EXPORT ----------
  els.exportUsers.addEventListener('click', ()=>{
    const rows = [['id','username','first_name','email','created_at']];
    let data = state.users.filter(u =>
      usernamePartialMatch(u.username) &&
      (globalMatch(u.username) || globalMatch(u.first_name) || globalMatch(u.email))
    );
    for (const u of data) rows.push([u.id, u.username, u.first_name||'', u.email||'', u.created_at]);
    downloadCSV(rows, 'users.csv');
  });
  els.exportReviews.addEventListener('click', ()=>{
    const rows = [['id','plate_number','user','rating','status','created_at']];
    let data = state.reviews.map(r=>({...r, user_label: state.usernameMap[r.user_id]||r.user_id }));
    data = data.filter(r =>
      usernamePartialMatch(r.user_label) &&
      (globalMatch(r.user_label) || globalMatch(r.plate_number) || globalMatch(r.status))
    );
    for (const r of data) rows.push([r.id, r.plate_number, r.user_label, r.rating, r.status||'', r.created_at]);
    downloadCSV(rows, 'reviews.csv');
  });
  els.exportVotes.addEventListener('click', ()=>{
    const rows = [['id','review_id','user','vote_type','created_at']];
    let data = state.reviewVotes.map(v=>({...v, user_label: state.usernameMap[v.user_id]||v.user_id }))
      .filter(v => usernamePartialMatch(v.user_label) && (globalMatch(v.user_label) || globalMatch(v.review_id) || globalMatch(v.vote_type)));
    for (const v of data) rows.push([v.id, v.review_id, v.user_label, v.vote_type, v.created_at]);
    downloadCSV(rows, 'votes.csv');
  });
  els.exportBadges.addEventListener('click', ()=>{
    const rows = [['badge_id','name','description']];
    let data = state.badges.filter(b => globalMatch(b.name) || globalMatch(b.description) || globalMatch(b.badge_id));
    for (const b of data) rows.push([b.badge_id, b.name, b.description||'']);
    downloadCSV(rows, 'badges.csv');
  });
  els.exportUserBadges.addEventListener('click', ()=>{
    const rows = [['id','user','badge_id','earned_at']];
    let data = state.userBadges.map(ub=>({...ub, user_label: state.usernameMap[ub.user_id]||ub.user_id }))
      .filter(r => usernamePartialMatch(r.user_label) && (globalMatch(r.user_label) || globalMatch(r.badge_id)));
    for (const r of data) rows.push([r.id, r.user_label, r.badge_id, r.earned_at]);
    downloadCSV(rows, 'user_badges.csv');
  });

  // ---------- MANAGE USER MODAL ----------
  let currentModalUserId = null;

  function openManageUserModal(userId){
    currentModalUserId = userId;
    const user = state.users.find(u=>u.id===userId);
    if (!user) return;

    els.modal.dataset.userId = String(userId);
    els.modalUsername.textContent = user.username;
    els.modalFirst.value = user.first_name || '';
    els.modalEmail.value = user.email || '';
    els.modalIsAdmin.checked = !!user.is_admin;
    els.modalPass.value = '';
    els.modalShowPass.checked = false;
    els.modalPass.type = 'password';

    populateVehicleDropdowns(user);
    populateBioBuilder(user);

    els.modalBadgeSelect.innerHTML = '<option value="">Select a badge…</option>' +
      state.badges.map(b=>`<option value="${b.badge_id}">${escapeHtml(b.name)} (${b.badge_id})</option>`).join('');
    renderUserBadgesChips(userId);

    els.editUserMsg.textContent = '';
    els.awardBadgeMsg.textContent = '';
    showModal(true);
  }

  function showModal(show){
    els.modal.classList.toggle('hidden', !show);
    els.modal.classList.toggle('flex', show);
  }
  els.modalClose.addEventListener('click', ()=>showModal(false));
  els.modalShowPass.addEventListener('change', ()=>{ els.modalPass.type = els.modalShowPass.checked?'text':'password'; });

  function renderUserBadgesChips(userId){
    els.modalUserBadges.innerHTML = '';
    const list = state.userBadges.filter(ub=>ub.user_id===userId);
    if (!list.length) {
      els.modalUserBadges.innerHTML = `<p class="text-sm text-gray-500">This user has no badges.</p>`;
      return;
    }
    for (const ub of list) {
      const b = state.badges.find(x=>x.badge_id===ub.badge_id);
      const div = document.createElement('div');
      div.className = 'badge-chip';
      div.innerHTML = `
        <span>${escapeHtml(b?b.name:ub.badge_id)}</span>
        <button class="ml-2 text-red-600 hover:text-red-800 remove-badge-btn" data-user-id="${userId}" data-badge-id="${ub.badge_id}" title="Remove">&times;</button>
      `;
      els.modalUserBadges.appendChild(div);
    }
  }

  function buildYearOptions(){
    const end = new Date().getFullYear() + 1;
    const out = ['<option value="">Select Year</option>'];
    for (let y=end; y>=1900; y--) out.push(`<option>${y}</option>`);
    return out.join('');
  }

  function populateVehicleDropdowns(user){
    const makeSel = els.modalVehicleMake, modelSel = els.modalVehicleModel, yearSel = els.modalVehicleYear, colorSel = els.modalVehicleColor;

    makeSel.innerHTML = '<option value="">Select Make</option>' + vehicleMakes.map(m=>`<option>${m}</option>`).join('');
    colorSel.innerHTML = '<option value="">Select Color</option>' + vehicleColors.map(c=>`<option>${c}</option>`).join('');
    yearSel.innerHTML = buildYearOptions();

    makeSel.value = user.current_vehicle_make || '';
    colorSel.value = user.current_vehicle_color || '';
    yearSel.value = user.current_vehicle_year || '';

    const updateModels = ()=>{
      const make = makeSel.value;
      const models = Object.keys(vehicleSubtype[make] || {}).sort();
      modelSel.innerHTML = '<option value="">Select Model</option>' + models.map(m=>`<option>${m}</option>`).join('');
      modelSel.disabled = !make;
      if (models.includes(user.current_vehicle_model)) modelSel.value = user.current_vehicle_model || '';
      else modelSel.value = '';
    };
    makeSel.onchange = updateModels;
    updateModels();
  }

  function populateBioBuilder(user){
    const sel = els.modalBioTemplate, wordsBox = els.modalBioWords;
    sel.innerHTML = commentBuilderData.templates.map((t,i)=>`<option value="${i}">${escapeHtml(t)}</option>`).join('');
    const applyWords = ()=>{
      const idx = Number(sel.value);
      const tmpl = commentBuilderData.templates[idx];
      const slots = (tmpl.match(/_____/g)||[]).length;
      wordsBox.innerHTML = '';
      for (let i=0;i<slots;i++){
        const s = document.createElement('select');
        s.className = 'w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950';
        s.innerHTML = [
          ['People', commentBuilderData.words.people_archetypes],
          ['Vehicles', commentBuilderData.words.vehicles],
          ['Road', commentBuilderData.words.road_features],
          ['Maneuvers', commentBuilderData.words.maneuvers_actions],
          ['Errors', commentBuilderData.words.driver_errors],
          ['Items', commentBuilderData.words.items_gestures],
          ['Concepts', commentBuilderData.words.concepts_states],
          ['Modes', commentBuilderData.words.modes_stances],
          ['Guidance', commentBuilderData.words.guidance],
          ['Qualities', commentBuilderData.words.qualities_adjectives],
          ['Directions', commentBuilderData.words.directions],
          ['Phrases', commentBuilderData.words.phrases],
          ['Conjunctions', commentBuilderData.words.conjunctions]
        ].map(([label,arr])=>`<optgroup label="${label}">${arr.map(w=>`<option>${escapeHtml(w)}</option>`).join('')}</optgroup>`).join('');
        wordsBox.appendChild(s);
      }
      if (user.bio && String(user.bio.template)===String(idx) && Array.isArray(user.bio.words)) {
        qsa('select', wordsBox).forEach((select,i)=>{
          if (user.bio.words[i]) select.value = user.bio.words[i];
        });
      }
    };
    sel.onchange = applyWords;
    if (user.bio && user.bio.template!=null) sel.value = String(user.bio.template);
    applyWords();
  }

  els.saveUserBtn.addEventListener('click', async ()=>{
    const userId = Number(els.modal.dataset.userId);
    const bioTemplate = els.modalBioTemplate.value;
    const bioWords = qsa('#modal-bio-words-container select').map(s=>s.value);
    const body = {
      first_name: els.modalFirst.value,
      email: els.modalEmail.value,
      is_admin: els.modalIsAdmin.checked,
      current_vehicle_make: els.modalVehicleMake.value || null,
      current_vehicle_model: els.modalVehicleModel.value || null,
      current_vehicle_year: els.modalVehicleYear.value || null,
      current_vehicle_color: els.modalVehicleColor.value || null,
      bio: { template: bioTemplate, words: bioWords }
    };
    const newPass = els.modalPass.value;
    if (newPass) body.password = newPass;

    els.editUserMsg.textContent = 'Saving...';
    els.editUserMsg.className = 'text-sm mt-1 text-gray-500';
    try {
      await fetchJSON(`${API_URL}/admin/users/${userId}`, { method:'PUT', body: JSON.stringify(body) });
      els.editUserMsg.textContent = 'User saved successfully.';
      els.editUserMsg.className = 'text-sm mt-1 text-green-600';
      state.users = await fetchJSON(`${API_URL}/users`);
      state.usernameMap = {}; state.users.forEach(u=>state.usernameMap[u.id]=u.username);
      renderUsers();
    } catch (err) {
      els.editUserMsg.textContent = `Error: ${err.message}`;
      els.editUserMsg.className = 'text-sm mt-1 text-red-600';
    }
  });

  // Award / grant-all / remove-all in modal
  els.awardBadgeBtn.addEventListener('click', async ()=>{
    const userId = Number(els.modal.dataset.userId);
    const badgeId = els.modalBadgeSelect.value;
    if (!badgeId) { setModalBadgeMsg('Please select a badge.','red'); return; }
    setModalBadgeMsg('Awarding...','gray');
    try {
      await fetchJSON(`${API_URL}/admin/users/${userId}/badges`, { method:'POST', body: JSON.stringify({ badge_id: badgeId }) });
      state.userBadges = await fetchJSON(`${API_URL}/user_badges`);
      renderUserBadgesChips(userId);
      renderUserBadges();
      setModalBadgeMsg('Badge awarded!','green');
    } catch (err) { setModalBadgeMsg(`Error: ${err.message}`,'red'); }
  });

  els.grantAllBtn.addEventListener('click', async ()=>{
    const userId = Number(els.modal.dataset.userId);
    if (!confirm('Grant ALL badges to this user?')) return;
    setModalBadgeMsg('Granting all badges...','gray');
    try {
      for (const b of state.badges) {
        await fetchJSON(`${API_URL}/admin/users/${userId}/badges`, { method:'POST', body: JSON.stringify({ badge_id: b.badge_id }) });
      }
      state.userBadges = await fetchJSON(`${API_URL}/user_badges`);
      renderUserBadgesChips(userId);
      renderUserBadges();
      setModalBadgeMsg('All badges granted.','green');
    } catch (err) { setModalBadgeMsg(`Grant-all failed: ${err.message}`,'red'); }
  });

  els.removeAllBtn.addEventListener('click', async ()=>{
    const userId = Number(els.modal.dataset.userId);
    if (!confirm('Remove ALL badges from this user?')) return;
    setModalBadgeMsg('Removing all badges...','gray');
    try {
      const theirs = state.userBadges.filter(ub => ub.user_id === userId);
      for (const ub of theirs) {
        await fetchJSON(`${API_URL}/admin/users/${userId}/badges/${ub.badge_id}`, { method:'DELETE' });
      }
      state.userBadges = await fetchJSON(`${API_URL}/user_badges`);
      renderUserBadgesChips(userId);
      renderUserBadges();
      setModalBadgeMsg('All badges removed.','green');
    } catch (err) { setModalBadgeMsg(`Remove-all failed: ${err.message}`,'red'); }
  });

  function setModalBadgeMsg(text,color){
    els.awardBadgeMsg.textContent = text;
    els.awardBadgeMsg.className = `text-sm mt-1 ${color==='green'?'text-green-600':color==='red'?'text-red-600':'text-gray-500'}`;
  }

  els.modalUserBadges.addEventListener('click', async (e)=>{
    const btn = e.target.closest('.remove-badge-btn'); if (!btn) return;
    const userId = Number(btn.dataset.userId), badgeId = btn.dataset.badgeId;
    if (!confirm(`Remove badge ${badgeId} from this user?`)) return;
    try {
      await fetchJSON(`${API_URL}/admin/users/${userId}/badges/${badgeId}`, { method:'DELETE' });
      toast('Badge removed.', 'success');
      state.userBadges = await fetchJSON(`${API_URL}/user_badges`);
      renderUserBadgesChips(userId);
      renderUserBadges();
    } catch (err) {
      toast(`Failed to remove badge: ${err.message}`, 'error');
    }
  });

  // ---------- DELETE USER ----------
  function openDeleteUserModal(userId, username){
    els.delModal.dataset.userId = String(userId);
    els.delModal.dataset.username = username;
    els.delPassword.value = '';
    els.delCheckbox.checked = false;
    els.delBtnConfirm.disabled = true;
    els.delError.textContent = '';
    els.delModal.classList.remove('hidden');
    els.delModal.classList.add('flex');
  }
  function closeDeleteUserModal(){
    els.delModal.classList.add('hidden');
    els.delModal.classList.remove('flex');
  }
  els.delBtnCloseTop.addEventListener('click', closeDeleteUserModal);
  els.delBtnCancel.addEventListener('click', closeDeleteUserModal);
  els.delCheckbox.addEventListener('change', ()=>{ els.delBtnConfirm.disabled = !els.delCheckbox.checked; });
  els.delBtnConfirm.addEventListener('click', confirmDeleteUser);

  async function confirmDeleteUser(){
    const userId = Number(els.delModal.dataset.userId);
    const username = els.delModal.dataset.username;
    const password = els.delPassword.value;
    els.delError.textContent = '';
    try {
      await fetchJSON(`${API_URL}/admin/verify-password`, { method:'POST', body: JSON.stringify({ password }) });
    } catch (err) {
      els.delError.textContent = err.message || 'Password verification failed.'; return;
    }
    try {
      await fetchJSON(`${API_URL}/admin/users/${userId}`, { method:'DELETE' });
      closeDeleteUserModal();
      toast(`User ${username} deleted.`, 'success');
      state.users = await fetchJSON(`${API_URL}/users`);
      state.userBadges = await fetchJSON(`${API_URL}/user_badges`);
      state.reviewVotes = await fetchJSON(`${API_URL}/review_votes`);
      // Also remove from selection if present
      state.selectedUserIds.delete(userId); renderSelection();
      renderAll();
      buildCharts();
    } catch (err) {
      els.delError.textContent = err.message || 'Delete failed.';
    }
  }

  // ---------- CHARTS ----------
  function buildCharts(){
    const range = state.chartRange;
    const now = new Date();
    let start = new Date(0);
    if (range !== 'all') {
      start = new Date(now);
      start.setDate(start.getDate() - (parseInt(range,10)-1));
      start.setHours(0,0,0,0);
    }

    const dayKey = d => { const t = new Date(d); t.setHours(0,0,0,0); return t.getTime(); };
    const counts = new Map();
    for (const u of state.users) {
      const d = new Date(u.created_at);
      if (range==='all' || d >= start) counts.set(dayKey(d), (counts.get(dayKey(d))||0)+1);
    }
    const labels=[], data=[];
    const earliest = state.users.length
      ? state.users.reduce((a,b)=> new Date(a.created_at) < new Date(b.created_at) ? a : b).created_at
      : now;
    const begin = range==='all' ? dayKey(earliest) : dayKey(start);
    const end = dayKey(now);
    for (let t=begin; t<=end; t += 86400000) {
      labels.push(new Date(t).toLocaleDateString());
      data.push(counts.get(t)||0);
    }

    if (state.charts.users) state.charts.users.destroy();
    state.charts.users = new Chart(els.chartUsers.getContext('2d'), {
      type:'line',
      data:{ labels, datasets:[{ label:'New Users', data }]},
      options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true }}, plugins:{ legend:{ display:false } } }
    });

    const buckets = {1:0,2:0,3:0,4:0,5:0};
    for (const r of state.reviews) {
      const d = new Date(r.created_at);
      if (range==='all' || d>=start) { if (buckets[r.rating]!=null) buckets[r.rating]++; }
    }
    const rlabels = Object.keys(buckets), rdata = Object.values(buckets);
    if (state.charts.ratings) state.charts.ratings.destroy();
    state.charts.ratings = new Chart(els.chartRatings.getContext('2d'), {
      type:'bar',
      data:{ labels:rlabels, datasets:[{ label:'Reviews', data:rdata }]},
      options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true }}, plugins:{ legend:{ display:false } } }
    });

    qsa('#range-buttons button').forEach(b=>{
      b.classList.toggle('bg-blue-600', b.dataset.range===state.chartRange);
      b.classList.toggle('text-white', b.dataset.range===state.chartRange);
      b.classList.toggle('border', b.dataset.range!==state.chartRange);
    });
  }
  els.rangeButtons.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-range]'); if (!btn) return;
    state.chartRange = btn.dataset.range;
    localStorage.setItem('chart_range', state.chartRange);
    buildCharts();
  });

  // ---------- BULK BADGE OPS (use selection) ----------
  function fillBulkBadgeSelect(){
    els.bulkBadgeSelect.innerHTML = '<option value="">Select a badge…</option>' +
      state.badges.map(b=>`<option value="${b.badge_id}">${escapeHtml(b.name)} (${b.badge_id})</option>`).join('');
  }
  const selectedUsersArray = () => [...state.selectedUserIds].map(id => state.users.find(u=>u.id===id)).filter(Boolean);

  els.bulkAwardBtn.addEventListener('click', async ()=>{
    const badgeId = els.bulkBadgeSelect.value;
    if (!badgeId) { setBulkMsg('Select a badge first.','red'); return; }
    const targets = selectedUsersArray();
    if (!targets.length) { setBulkMsg('No selected users. Drag users into the selection box or click “Add all filtered”.','red'); return; }

    setBulkMsg(`Awarding badge ${badgeId} to ${targets.length} user(s)...`,'gray');
    try {
      for (const u of targets) {
        await fetchJSON(`${API_URL}/admin/users/${u.id}/badges`, { method:'POST', body: JSON.stringify({ badge_id: badgeId }) });
      }
      state.userBadges = await fetchJSON(`${API_URL}/user_badges`);
      renderUserBadges();
      setBulkMsg(`Badge ${badgeId} awarded to ${targets.length} user(s).`,'green');
    } catch (err) {
      setBulkMsg(`Bulk award failed: ${err.message}`,'red');
    }
  });

  els.bulkGrantAll.addEventListener('click', async ()=>{
    const targets = selectedUsersArray();
    if (!targets.length) { setBulkMsg('No selected users. Drag users into the selection box or click “Add all filtered”.','red'); return; }
    if (!confirm(`Grant ALL ${state.badges.length} badges to ${targets.length} user(s)?`)) return;

    setBulkMsg(`Granting all badges to ${targets.length} user(s)...`,'gray');
    try {
      for (const u of targets) {
        for (const b of state.badges) {
          await fetchJSON(`${API_URL}/admin/users/${u.id}/badges`, { method:'POST', body: JSON.stringify({ badge_id: b.badge_id }) });
        }
      }
      state.userBadges = await fetchJSON(`${API_URL}/user_badges`);
      renderUserBadges();
      setBulkMsg(`All badges granted to ${targets.length} user(s).`,'green');
    } catch (err) {
      setBulkMsg(`Grant-all failed: ${err.message}`,'red');
    }
  });

  els.bulkRemoveAll.addEventListener('click', async ()=>{
    const targets = selectedUsersArray();
    if (!targets.length) { setBulkMsg('No selected users. Drag users into the selection box or click “Add all filtered”.','red'); return; }
    if (!confirm(`Remove ALL badges from ${targets.length} user(s)?`)) return;

    setBulkMsg(`Removing all badges from ${targets.length} user(s)...`,'gray');
    try {
      for (const u of targets) {
        const theirs = state.userBadges.filter(ub => ub.user_id === u.id);
        for (const ub of theirs) {
          await fetchJSON(`${API_URL}/admin/users/${u.id}/badges/${ub.badge_id}`, { method:'DELETE' });
        }
      }
      state.userBadges = await fetchJSON(`${API_URL}/user_badges`);
      renderUserBadges();
      setBulkMsg(`All badges removed from ${targets.length} user(s).`,'green');
    } catch (err) {
      setBulkMsg(`Remove-all failed: ${err.message}`,'red');
    }
  });

  function setBulkMsg(text, color){
    els.bulkBadgeMsg.textContent = text;
    els.bulkBadgeMsg.className = `text-sm ${color==='green'?'text-green-600':color==='red'?'text-red-600':'text-gray-500'}`;
  }

  // ---------- DRAG & DROP SELECTION ----------
  els.selectionDropzone.addEventListener('dragover', (e)=>{ e.preventDefault(); els.selectionDropzone.classList.add('drag-over'); });
  els.selectionDropzone.addEventListener('dragenter', ()=> els.selectionDropzone.classList.add('drag-over'));
  els.selectionDropzone.addEventListener('dragleave', (e)=>{ if (e.target===els.selectionDropzone) els.selectionDropzone.classList.remove('drag-over'); });
  els.selectionDropzone.addEventListener('drop', (e)=>{
    e.preventDefault();
    els.selectionDropzone.classList.remove('drag-over');
    const idStr = e.dataTransfer.getData('text/plain');
    const id = Number(idStr);
    if (!id || !state.users.find(u=>u.id===id)) return;
    addSelectedUser(id);
  });

  // Quick chip remove
  els.selectedChips.addEventListener('click', (e)=>{
    const btn = e.target.closest('.remove-chip'); if (!btn) return;
    const id = Number(btn.dataset.id);
    state.selectedUserIds.delete(id);
    renderSelection();
  });

  // Add all filtered users into selection
  els.addFilteredToSelection.addEventListener('click', ()=>{
    const filtered = currentFilteredUsers();
    for (const u of filtered) state.selectedUserIds.add(u.id);
    renderSelection();
    if (!filtered.length) toast('No users match current filter.', 'warn');
    else toast(`Added ${filtered.length} ${filtered.length===1?'user':'users'} to selection.`, 'success');
  });

  // Clear selection
  els.clearSelectionBtn.addEventListener('click', ()=>{
    state.selectedUserIds.clear();
    renderSelection();
  });

  function addSelectedUser(id){
    state.selectedUserIds.add(id);
    renderSelection();
    // make it obvious which users can be dragged:
    toast('User added to selection.', 'success');
  }

  function currentFilteredUsers(){
    return state.users.filter(u =>
      usernamePartialMatch(u.username) &&
      (globalMatch(u.username) || globalMatch(u.first_name) || globalMatch(u.email))
    );
  }

  // ---------- INIT ----------
  els.filterInput.value = state.filters.username || '';
  qsa('.sortable').forEach(h=>h.addEventListener('click', ()=>updateSortIndicators()));
  els.refreshBtn.addEventListener('click', ()=>fetchAll().then(()=>toast('Refreshed','success')).catch(()=>toast('Refresh failed','error')));
  fetchAll().catch(err=>{ console.error(err); toast('Failed to load admin data.', 'error'); });

  // Keyboard shortcut for global search
  document.addEventListener('keydown',(e)=>{
    if (e.key==='/' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      (els.globalFilter || els.globalFilterMobile).focus();
    }
  });
});
