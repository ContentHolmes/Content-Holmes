/**
 * Exports base data needed for [typechecker]{@link module:urlblock/typechecker}.
 * @module data/typechecker
 */


export {
    categories
}

/**
 * Categorical data that is used to check against tags and categorize websites.
 */

var categories = {
    "Entertainment": {
        "Strong": [
            "Entertainment",
            "Celebrities",
            "Comics",
            "Animation",
            "Anime",
            "Manga",
            "Cartoons",
            "Film",
            "TV",
            "Music",
            "Clubs",
            "Nightlife",
            "Concerts",
            "Festivals",
            "Sporting",
            "Movie",
            "Theater",
            "Showtimes",
            "Ticket",
            "Movies",
            "Films",
            "Animated",
            "DVD",
            "Reviews",
            "Previews",
            "Media",
            "Game",
            "Shows",
            "Programs",
            "Musical",
            "Romance",
            "Science",
            "Fiction",
            "Fantasy",
            "Thriller",
            "Crime",
            "Mystery",
            "Tours",
            "Performing",
            "Acting",
            "Broadway",
            "Dance",
            "Comedies",
            "Dramas", ,
            "Sci-Fi",
            "Opera",
            "Action",
            "Adventure",
            "Magazines",
            "Martial",
            "Arts",
            "Superhero"
        ],
        "Weak": [
            "Industry",
            "Awards",
            "Production",
            "Recording",
            "Record",
            "Labels",
            "Events",
            "Listings",
            "Sales",
            "Fun",
            "Trivia",
            "Flash-Based",
            "Silly",
            "Surveys",
            "Humor",
            "Comedy",
            "Political",
            "Spoofs",
            "Satire",
            "Western",
            "Bollywood",
            "South",
            "Asian",
            "Classic",
            "Silent",
            "Cult",
            "Indie",
            "Shopping",
            "Rentals",
            "Drama",
            "Family",
            "Horror",
            "Memorabilia",
            "Reference",
            "Offbeat",
            "Edgy",
            "Bizarre",
            "Occult",
            "Paranormal",
            "Online",
            "Image",
            "Galleries",
            "Webcams",
            "Virtual",
            "Commercials",
            "Guides",
            "Networks",
            "Stations",
            "Legal",
            "Medical",
            "Soap",
            "Operas",
            "Family-Oriented",
            "Reality",
            "Talk"
        ]
    },
    "Music": {
        "Strong": [
            "Music",
            "CD",
            "Audio",
            "Jazz",
            "Blues",
            "DJ",
            "Musical",
            "Instruments",
            "Drums",
            "Percussion",
            "Guitars",
            "Pianos",
            "Pop",
            "Keyboards",
            "Song",
            "Lyrics",
            "Rock",
            "Classic",
            "Oldies",
            "Salsa",
            "Tropical",
            "Punk",
            "Hip-Hop",
            "Rap",
            "Reggaeton",
            "Soul",
            "R&B",
            "Reggae"
        ],
        "Weak": [
            "Shopping",
            "Classical",
            "Country",
            "Dance",
            "Electronic",
            "Experimental",
            "Industrial",
            "Folk",
            "Traditional",
            "Art",
            "Memorabilia",
            "Instruction",
            "Technology",
            "Resources",
            "Recording",
            "Samples",
            "Sound",
            "Libraries",
            "Reference",
            "Composition",
            "Sheet",
            "Tabs",
            "Streams",
            "Downloads",
            "Radio",
            "Podcasting",
            "Talk",
            "Religious",
            "Christian",
            "Gospel",
            "Hard",
            "Progressive",
            "Indie",
            "Alternative",
            "Metal",
            "Soundtracks",
            "Urban",
            "Vocals",
            "Show",
            "Tunes",
            "World",
            "African",
            "Arab",
            "Middle",
            "Eastern",
            "East",
            "Asian",
            "Latin",
            "American",
            "Brazilian",
            "Caribbean",
            "South"
        ]
    },
    "Art": {
        "Strong": [
            "Art",
            "Visual",
            "Design",
            "Architecture",
            "Craft",
            "Supplies",
            "Arts",
            "Graphic",
            "Painting",
            "Photographic",
            "Digital"
        ],
        "Weak": [
            "Education",
            "Industrial",
            "Product",
            "Interior"
        ]
    },
    "Vehicles": {
        "Strong": [
            "Vehicles",
            "Bicycles",
            "Boats",
            "Watercraft",
            "Campers",
            "RVs",
            "Cargo",
            "Trucks",
            "Trailers",
            "Hybrid",
            "Electric",
            "Plug-In",
            "Microcars",
            "Cars",
            "Motorcycles",
            "Off-Road",
            "Personal",
            "Aircraft",
            "Scooters",
            "Mopeds",
            "SUVs",
            "Vans",
            "Minivans",
            "Vehicle",
            "Brands",
            "Acura",
            "Audi",
            "BMW",
            "Bentley",
            "Buick",
            "Cadillac",
            "Chevrolet",
            "Chrysler",
            "Citroën",
            "Dodge",
            "Ferrari",
            "Fiat",
            "Ford",
            "GM-Daewoo",
            "GMC",
            "Honda",
            "Hummer",
            "Hyundai",
            "Isuzu",
            "Jaguar",
            "Jeep",
            "Kia",
            "Lamborghini",
            "Land",
            "Rover",
            "Lexus",
            "Lincoln",
            "Maserati",
            "Mazda",
            "Mercedes-Benz",
            "Mercury",
            "Mitsubishi",
            "Nissan",
            "Infiniti",
            "Peugeot",
            "Pontiac",
            "Porsche",
            "Renault-Samsung",
            "Rolls-Royce",
            "Saab",
            "Saturn",
            "Subaru",
            "Suzuki",
            "Toyota",
            "Scion",
            "Vauxhall-Opel",
            "Volkswagen",
            "Volvo",
            "Engine",
            "Transmission",
            "Fuels",
            "Lubricants",
            "Wheels",
            "Tires"
        ],
        "Weak": [
            "Accessories",
            "Classic",
            "Parts",
            "Auto",
            "Exterior",
            "Interior",
            "Commercial",
            "Custom",
            "Performance",
            "Licensing",
            "Registration",
            "Maintenance",
            "City",
            "Mini",
            "Alternative",
            "Shopping",
            "Fuel",
            "Gas"
        ]
    },
    "Beauty": {
        "Strong": [
            "Beauty",
            "Pageants",
            "Body",
            "Cosmetic",
            "Cosmetology",
            "Face",
            "Care",
            "Perfumes",
            "Fragrances",
            "Skin",
            "Nail",
            "Hair",
            "Fashion",
            "Style",
            "Designers",
            "Modeling",
            "Spas",
            "Massage",
            "Therapy"
        ],
        "Weak": [
            "Art",
            "Procedures",
            "Surgery",
            "Professionals",
            "Hygiene",
            "Toiletries",
            "Make-Up",
            "Cosmetics",
            "Unwanted",
            "Facial",
            "Removal",
            "Collections",
            "Fitness",
            "Bodybuilding",
            "Yoga",
            "Pilates",
            "Loss",
            "Services",
            "Weight"
        ]
    },
    "Books": {
        "Strong": [
            "Books",
            "Reading",
            "Book",
            "Literature",
            "E-Books",
            "Magazines",
            "Poetry",
            "Writers",
            "Literary"
        ],
        "Weak": [
            "Retailers",
            "Children's",
            "Fan",
            "Fiction",
            "Classics",
            "Resources"
        ]
    },
    "Sports": {
        "Strong": [
            "Sports",
            "Boxing",
            "Martial",
            "Arts",
            "Wrestling",
            "Bowling",
            "Cycling",
            "Golf",
            "Gymnastics",
            "Racquet",
            "Tennis",
            "Running",
            "Walking",
            "Skate",
            "Track",
            "Field",
            "Motor",
            "Sporting",
            "Football",
            "Baseball",
            "Basketball",
            "Cheerleading",
            "Cricket",
            "Handball",
            "Hockey",
            "Rugby",
            "Soccer",
            "Volleyball",
            "Ice",
            "Skating",
            "Skiing",
            "Snowboarding",
            "Sporting",
            "Olympics",
            "Water Sports",
            "Winter",
        ],
        "Weak": [
            "College",
            "Combat",
            "Extreme",
            "Fantasy",
            "Individual",
            "Goods",
            "Memorabilia",
            "Coaching",
            "Training",
            "Team",
            "American"
        ]
    },
    "Science & Education": {
        "Strong": [
            "Study",
            "Class",
            "Classes",
            "School",
            "College",
            "Education",
            "Tests",
            "Theory",
            "Equipment",
            "Science",
            "Astronomy",
            "Biological",
            "Sciences",
            "Anatomy",
            "Flora",
            "Fauna",
            "Insects",
            "Entomology",
            "Genetics",
            "Neuroscience",
            "Chemistry",
            "Computer",
            "Distributed",
            "Parallel",
            "Computing",
            "Documentary",
            "Machine",
            "Learning",
            "Artificial",
            "Intelligence",
            "Earth",
            "Atmospheric",
            "Geology",
            "Paleontology",
            "Water",
            "Marine",
            "Ecology",
            "Environment",
            "Climate",
            "Change",
            "Global",
            "Warming",
            "Engineering",
            "Technology",
            "Robotics",
            "Mathematics",
            "Statistics",
            "Physics",
            "Scientific",
            "Equipment",
            "Institutions"
        ]
    },
    "Pets & Animals": {
        "Strong": [
            "Pets",
            "Animal",
            "Pet",
            "Food",
            "Veterinarians",
            "Birds",
            "Cats",
            "Dogs",
            "Exotic",
            "Fish",
            "Aquaria",
            "Horses",
            "Rabbits",
            "Rodents",
            "Reptiles",
            "Amphibians",
            "Wildlife"
        ],
        "Weak": [
            "Products",
            "Services",
            "Welfare",
            "Supplies"
        ]
    },
    "Social": {
        "Strong": [
            "Social",
            "Blogging",
            "Microblogging",
            "Dating",
            "Sharing",
            "Hosting",
            "Chat",
            "Forum",
            "Networks",
            "Virtual",
            "Worlds"
        ],
        "Weak": [
            "Resources",
            "Services",
            "Personals",
            "Matrimonial",
            "Photo",
            "Rating",
            "Sites",
            "File",
            "Providers",
            "Online",
            "Goodies",
            "Clip",
            "Art",
            "Animated",
            "GIFs",
            "Skins",
            "Themes",
            "Wallpapers",
            "Network",
            "Apps",
            "Add-Ons",
            "Journals",
            "Personal",
            "Video",
            "Image"
        ]
    },
    "News": {
        "Strong": [
            "News",
            "Magazines",
            "Weather"
        ],
        "Weak": [
            "Stories",
            "Trends"
        ]
    },
    "Games": {
        "Strong": [
            "Games",
            "Arcade",
            "Coin-Op",
            "Chess",
            "Abstract",
            "Strategy",
            "Miniatures",
            "Wargaming",
            "Card",
            "Collectible",
            "Gaming",
            "Game",
            "Multiplayer",
            "Party",
            "Puzzles",
            "Roleplaying",
            "Gaming"
        ],
        "Weak": [
            "Computer",
            "Video",
            "Action",
            "Platform",
            "Adventure",
            "Casual",
            "Driving",
            "Racing",
            "Fighting",
            "Media",
            "Reference",
            "Cheats",
            "Hints",
            "Music",
            "Dance",
            "Shooter",
            "Simulation",
            "Sports",
            "Emulation",
            "Retailers",
            "Family-Oriented",
            "Activities",
            "Drawing",
            "Coloring",
            "Dress-Up",
            "Fashion",
            "Online",
            "Massive",
            "Brainteasers",
            "Table",
            "Billiards",
            "Tennis"
        ]
    },
    "Technology": {
        "Strong": [
            "Technology",
            "Computers",
            "Computer",
            "Robotics",
            "Robots",
            "Robot",
            "Laptop",
            "Phones",
            "Mobiles",
            "Mobile",
            "Phone"
        ],
        "Weak": []
    }
};