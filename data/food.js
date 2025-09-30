class Food {
    id;
    state;
    name;
    location;
    image;
    cuisine;
    rating;
    description;

    constructor(foodDetails) {
        this.id = foodDetails.id;
        this.state = foodDetails.state;
        this.name = foodDetails.name;
        this.location = foodDetails.location;
        this.image = foodDetails.image;
        this.cuisine = foodDetails.cuisine;
        this.rating = foodDetails.rating;
        this.description = foodDetails.description;
    }

    getStarsUrl() {
        const rounded = Math.round(this.rating.stars * 2) / 2;
        return `images/ratings/rating-${rounded * 10}.png`;
    }
}

export const foods = [
    // Johor
    { 
        id: 1, 
        state: "Johor", 
        name: "Laksa Johor", 
        location: "Jalan Tan Hiok Nee, Johor Bahru, 80000 Johor", 
        image: "images/food/johor/laksa-johor.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 4.5, 
            count: 87 
        }, 
        description: "Spaghetti-like noodles in spicy fish gravy." 
    },
    { 
        id: 2, 
        state: "Johor", 
        name: "Mee Rebus", 
        location: "Jalan Tan Hiok Nee, Johor Bahru, 80000 Johor", 
        image: "images/food/johor/mee-rebus.jpg",
        cuisine: "Malay", 
        rating: 
        { 
            stars: 4,
            count: 65
        }, 
        description: "Noodles in thick, spicy gravy with boiled egg." 
    },
    { 
        id: 3, 
        state: "Johor", 
        name: "Roti John", 
        location: "Taman Universiti, 81300 Skudai, Johor", 
        image: "images/food/johor/roti-john.jpg",
        cuisine: "Indian", 
        rating: { 
            stars: 5, 
            count: 78 
        }, 
        description: "Omelette-filled sandwich with minced meat." 
    },

    // Kedah
    { 
        id: 4, 
        state: "Kedah", 
        name: "Nasi Lemak", 
        location: "Jalan Pintu Sepuluh, 05100 Alor Setar, Kedah",
        image: "images/food/kedah/nasi-lemak.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 4.5, 
            count: 102 
        },
        description: "Coconut rice with sambal, anchovies, and egg." 
    },
    { 
        id: 5, 
        state: "Kedah", 
        name: "Kuih Akok", 
        location: "Jalan Pegawai, 05000 Alor Setar, Kedah",
        image: "images/food/kedah/kuih-akok.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 4.0, 
            count: 45 
        }, 
        description: "Sweet egg and coconut cake." 
    },
    { 
        id: 6, 
        state: "Kedah", 
        name: "Char Kuey Teow", 
        location: "Jalan Pintu Sepuluh, 05100 Alor Setar, Kedah",
        image: "images/food/kedah/char-kuey-teow-kedah.jpg",
        cuisine: "Chinese", 
        rating: { 
            stars: 4.5, 
            count: 62 
        }, 
        description: "Fried flat rice noodles with shrimp and egg." 
    },

    // Kelantan
    { 
        id: 7, 
        state: "Kelantan", 
        name: "Nasi Kerabu", 
        location: "Kampung Kraftangan, 15300 Kota Bharu, Kelantan",
        image: "images/food/kelantan/nasi-kerabu.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 4.5, 
            count: 95 
        }, 
        description: "Blue rice with herbs, fried fish and salted egg." 
    },
    { 
        id: 8, 
        state: "Kelantan", 
        name: "Ayam Percik", 
        location: "Kampung Kraftangan, 15300 Kota Bharu, Kelantan",
        image: "images/food/kelantan/ayam-percik.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 4.5, 
            count: 80 
        }, 
        description: "Grilled chicken with spicy coconut sauce." 
    },
    { 
        id: 9, 
        state: "Kelantan", 
        name: "Roti Canai", 
        location: "Pasar Siti Khadijah, 15300 Kota Bharu, Kelantan",
        image: "images/food/kelantan/roti-canai-kelantan.jpg",
        cuisine: "Indian", 
        rating: { 
            stars: 4.5, 
            count: 70 
        }, 
        description: "Flaky flatbread served with dhal or curry." 
    },

    // Melaka
    { 
        id: 10, 
        state: "Melaka", 
        name: "Chicken Rice Balls", 
        location: "Jalan Hang Jebat, 75200 Melaka", 
        image: "images/food/melaka/chicken-rice-ball.jpg",
        cuisine: "Chinese", 
        rating: { 
            stars: 4.5, 
            count: 74 
        }, 
        description: "Rice shaped into balls served with chicken." 
    },
    { 
        id: 11, 
        state: "Melaka", 
        name: "Cendol", 
        location: "Jalan Hang Jebat, 75200 Melaka",
        image: "images/food/melaka/cendol.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 5, 
            count: 88 
        }, 
        description: "Shaved ice dessert with pandan jelly and coconut milk." 
    },
    { 
        id: 12, 
        state: "Melaka", 
        name: "Murtabak", 
        location: "Taman Asean, 75250 Melaka",
        image: "images/food/melaka/murtabak.jpg",
        cuisine: "Indian", 
        rating: { 
            stars: 4.5, 
            count: 66 
        }, 
        description: "Stuffed pan-fried bread with egg and meat." 
    },

    // Negeri Sembilan
    { 
        id: 13, 
        state: "Negeri Sembilan", 
        name: "Masak Lemak Cili Api", 
        location: "Jalan Dato' Abdul Malek, 70100 Seremban, Negeri Sembilan",
        image: "images/food/negeri-sembilan/masak-lemak-cili-api.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 4.5, 
            count: 69 
        }, 
        description: "Spicy coconut milk dish with vegetables or meat." 
    },
    { 
        id: 14, 
        state: "Negeri Sembilan", 
        name: "Rendang Tok", 
        location: "Jalan Dato' Abdul Malek, 70100 Seremban, Negeri Sembilan",
        image: "images/food/negeri-sembilan/rendang-tok.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 4.5, 
            count: 84 
        }, 
        description: "Rich, slow-cooked beef rendang." 
    },
    { 
        id: 15, 
        state: "Negeri Sembilan", 
        name: "Roti Telur", 
        location: "Ampangan, 70200 Seremban, Negeri Sembilan",
        image: "images/food/negeri-sembilan/roti-telur.jpg",
        cuisine: "Indian", 
        rating: { 
            stars: 4.0, 
            count: 50 
        }, 
        description: "Indian flatbread stuffed with egg." 
    },

    // Pahang
    { 
        id: 16, 
        state: "Pahang", 
        name: "Satay Kajang", 
        location: "Kampung Bukit Tinggi, 28750 Bentong, Pahang",
        image: "images/food/pahang/satay-kajang.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 5, 
            count: 77 
        }, 
        description: "Skewered grilled meat with peanut sauce." 
    },
    { 
        id: 17, 
        state: "Pahang", 
        name: "Char Kuey Teow", 
        location: "Pasar Malam, 28000 Temerloh, Pahang",
        image: "images/food/pahang/char-kuey-teow-pahang.jpg",
        cuisine: "Chinese", 
        rating: { 
            stars: 4.0, 
            count: 60 
        }, 
        description: "Fried flat rice noodles with seafood." 
    },
    { 
        id: 18, 
        state: "Pahang", 
        name: "Mee Goreng Mamak", 
        location: "Pasar Malam, 28000 Temerloh, Pahang",
        image: "images/food/pahang/mee-goreng-mamak.jpg",
        cuisine: "Indian", 
        rating: { 
            stars: 4.5, 
            count: 55 
        }, 
        description: "Spicy fried noodles with vegetables and tofu." 
    },

    // Perak
    { 
        id: 19, 
        state: "Perak", 
        name: "Ipoh Chicken Hor Fun", 
        location: "Medan Selera, Jalan Dato Onn Jaafar, 30300 Ipoh, Perak",
        image: "images/food/perak/chicken-hor-fun.jpg",
        cuisine: "Chinese", 
        rating: { 
            stars: 4.5, 
            count: 92 
        }, 
        description: "Flat rice noodles with chicken and gravy." 
    },
    { 
        id: 20, 
        state: "Perak", 
        name: "Bean Sprout Chicken", 
        location: "Medan Selera, Jalan Dato Onn Jaafar, 30300 Ipoh, Perak",
        image: "images/food/perak/bean-sprout-chicken.jpg",
        cuisine: "Chinese", 
        rating: { 
            stars: 5, 
            count: 85 
        }, 
        description: "Poached chicken served with crunchy bean sprouts." 
    },
    { 
        id: 21, 
        state: "Perak", 
        name: "Roti Canai Perak", 
        location: "Taman Cempaka, 31400 Ipoh, Perak",
        image: "images/food/perak/roti-canai-perak.jpg",
        cuisine: "Indian", 
        rating: { 
            stars: 4.0, 
            count: 52 
        }, 
        description: "Flaky flatbread served with dhal." 
    },

    // Perlis
    { 
        id: 22, 
        state: "Perlis", 
        name: "Laksa Perlis", 
        location: "Jalan Kangar-Alor Setar, 01000 Kangar, Perlis",
        image: "images/food/perlis/laksa-perlis.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 4.0, 
            count: 48 
        }, 
        description: "Spicy noodle soup with fish." 
    },
    { 
        id: 23, 
        state: "Perlis", 
        name: "Roti Tisu", 
        location: "Jalan Kangar-Alor Setar, 01000 Kangar, Perlis",
        image: "images/food/perlis/roti-tisu.jpg",
        cuisine: "Indian", 
        rating: { 
            stars: 4.0, 
            count: 55 
        },
        description: "Thin, crispy, cone-shaped flatbread, usually drizzled with condensed milk or sugar as a sweet snack." 
    },
    { 
        id: 24, 
        state: "Perlis",
        name: "Nasi Dagang", 
        location: "Jalan Kangar-Alor Setar, 01000 Kangar, Perlis",
        image: "images/food/perlis/nasi-dagang.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 4.5, 
            count: 60 
        }, 
        description: "Steamed rice with fish curry." 
    },

    // Pulau Pinang
    { 
        id: 25, 
        state: "Pulau Pinang", 
        name: "Char Kuey Teow", 
        location: "Burmah Road, Pulau Tikus, 10350 George Town, Penang",
        image: "images/food/pulau-pinang/char-kuey-teow.jpg",
        cuisine: "Chinese", 
        rating: { 
            stars: 5, 
            count: 120 
        }, 
        description: "Famous wok-fried flat noodles with prawns." 
    },
    { 
        id: 26, 
        state: "Pulau Pinang", 
        name: "Asam Laksa", 
        location: "Chulia Street, George Town, 10450 George Town, Penang",
        image: "images/food/pulau-pinang/asam-laksa.jpg", 
        cuisine: "Malay", 
        rating: { 
            stars: 5, 
            count: 110 
        }, 
            description: "Sour fish-based noodle soup." 
        },
    { 
        id: 27,
        state: "Pulau Pinang",
        name: "Bak Kut Teh Penang",
        location: "Chulia Street, George Town, 10450 George Town, Penang",
        image: "images/food/pulau-pinang/bak-kut-teh.jpg",
        cuisine: "Chinese",
        rating: {
            stars: 5,
            count: 90
        },
        description: "Herbal pork rib soup served with rice and side dishes."
    },

    // Sabah
    { 
        id: 28, 
        state: "Sabah", 
        name: "Tuaran Mee", 
        location: "Gaya Street, Kota Kinabalu, 88000 Sabah",
        image: "images/food/sabah/tuaran-mee.jpg",
        cuisine: "Chinese", 
        rating: { 
            stars: 5, 
            count: 68 
        }, 
        description: "Fried egg noodles from Tuaran." 
    },
    { 
        id: 29, 
        state: "Sabah", 
        name: "Sinalau Bakas", 
        location: "Gaya Street, Kota Kinabalu, 88000 Sabah",
        image: "images/food/sabah/sinalau-bakas.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 5, 
            count: 74 
        }, 
        description: "Smoked wild boar meat." 
    },
    { 
        id: 30, 
        state: "Sabah", 
        name: "Mee Goreng Mamak", 
        location: "Tanjung Aru, Kota Kinabalu, 88100 Sabah",
        image: "images/food/sabah/mee-goreng-mamak-sabah.jpg",
        cuisine: "Indian", 
        rating: { 
            stars: 4.5, 
            count: 56 
        }, 
        description: "Spicy fried noodles with tofu and vegetables." 
    },

    // Sarawak
    { 
        id: 31, 
        state: "Sarawak", 
        name: "Kolo Mee", 
        location: "Kuching Waterfront, 93000 Kuching, Sarawak",
        image: "images/food/sarawak/kolo-mee.jpg",
        cuisine: "Chinese", 
        rating: { 
            stars: 5, 
            count: 90 
        }, 
        description: "Springy noodles with minced pork and char siu." 
    },
    { 
        id: 32, 
        state: "Sarawak", 
        name: "Sarawak Laksa", 
        location: "Kuching Waterfront, 93000 Kuching, Sarawak",
        image: "images/food/sarawak/sarawak-laksa.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 5, 
            count: 95 
        }, 
        description: "Spicy noodle soup with sambal and coconut milk." 
    },
    { 
        id: 33,
        state: "Sarawak",
        name: "Ikan Terubuk Sarawak",
        location: "Pasar Satok, 93000 Kuching, Sarawak",
        image: "images/food/sarawak/ikan-terubuk.jpg",
        cuisine: "Malay",
        rating: {
            stars: 5,
            count: 70
        },
        description: "Salted or grilled Ikan Terubok, a local fish specialty, often served with rice."
    },

    // Selangor
    { 
        id: 34, 
        state: "Selangor", 
        name: "Rojak", 
        location: "Kajang Town, 43000 Kajang, Selangor",
        image: "images/food/selangor/rojak.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 4.0, 
            count: 60 
        }, 
        description: "Fruit and vegetable salad with sweet sauce." 
    },
    { 
        id: 35, 
        state: "Selangor", 
        name: "Bak Kut Teh", 
        location: "Jalan Sayur, Pudu, 55100 Kuala Lumpur, Selangor",
        image: "images/food/selangor/bak-kut-teh-selangor.jpg",
        cuisine: "Chinese", 
        rating: { 
            stars: 5, 
            count: 85 
        }, 
        description: "Herbal pork rib soup." 
    },
    { 
        id: 36, 
        state: "Selangor", 
        name: "Murtabak Selangor", 
        location: "Kajang Town, 43000 Kajang, Selangor",
        image: "images/food/selangor/murtabak-selangor.jpg",
        cuisine: "Indian", 
        rating: { 
            stars: 4.5, 
            count: 70 
        }, 
        description: "Stuffed pan-fried bread with meat and egg." 
    },

    // Terengganu
    { 
        id: 37, 
        state: "Terengganu", 
        name: "Nasi Dagang", 
        location: "Kampung Cina, 20000 Kuala Terengganu, Terengganu",
        image: "images/food/terengganu/nasi-dagang.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 5, 
            count: 80 
        }, 
        description: "Steamed rice with fish curry and coconut milk." 
    },
    { 
        id: 38, 
        state: "Terengganu", 
        name: "Keropok Lekor", 
        location: "Pasar Payang, 20000 Kuala Terengganu, Terengganu",
        image: "images/food/terengganu/keropok-lekor.jpg",
        cuisine: "Malay", 
        rating: { 
            stars: 4.5, 
            count: 75 
        }, 
        description: "Fish sausage snack." 
    },
    { 
        id: 39, 
        state: "Terengganu", 
        name: "Roti Telur Terengganu", 
        location: "Pasar Payang, 20000 Kuala Terengganu, Terengganu",
        image: "images/food/terengganu/roti-telur.jpg",
        cuisine: "Indian", 
        rating: { 
            stars: 4.5, 
            count: 60 
        }, 
        description: "Indian-style egg stuffed bread." 
    },
].map((foodDetails) => {
    return new Food(foodDetails);
});


