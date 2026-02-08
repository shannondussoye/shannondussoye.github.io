export interface TripStop {
    id: string;
    name: string;
    lat: number;
    lng: number;
    description?: string;
}

export interface Trip {
    id: string;
    year: number;
    title: string;
    summary: string;
    stops: TripStop[];
    color: string;
}

export const trips: Trip[] = [
    {
        id: "trip-2023",
        year: 2023,
        title: "The Southern Loop",
        summary: "A journey from Sydney through the vibrant streets of Thailand, the serene shores of Mauritius, and the spiritual heart of India.",
        color: "#60a5fa",
        stops: [
            { id: "sydney-1", name: "Sydney", lat: -33.8688, lng: 151.2093, description: "Home base and starting point." },
            { id: "bangkok", name: "Bangkok", lat: 13.7563, lng: 100.5018, description: "Bustling city life and incredible street food." },
            { id: "chiang-mai", name: "Chiang Mai", lat: 18.7883, lng: 98.9853, description: "Northern temples and lush landscapes." },
            { id: "mauritius", name: "Mauritius", lat: -20.3484, lng: 57.5522, description: "Volcanic island and turquoise lagoons." },
            { id: "rishikesh", name: "Rishikesh", lat: 30.0869, lng: 78.2676, description: "The yoga capital on the banks of the Ganges." },
            { id: "delhi", name: "Delhi", lat: 28.6139, lng: 77.2090, description: "The historic and chaotic heart of India." },
            { id: "sydney-2", name: "Sydney", lat: -33.8688, lng: 151.2093, description: "Returning home." }
        ]
    },
    {
        id: "trip-2024",
        year: 2024,
        title: "Japan Traverse",
        summary: "Exploring the length of Japan, from the southern flavors of Fukuoka to the neon pulse of Tokyo.",
        color: "#a78bfa",
        stops: [
            { id: "sydney-3", name: "Sydney", lat: -33.8688, lng: 151.2093, description: "Setting off for the north." },
            { id: "fukuoka", name: "Fukuoka", lat: 33.5902, lng: 130.4017, description: "Kyushu's largest city and tonkotsu ramen capital." },
            { id: "hiroshima", name: "Hiroshima", lat: 34.3853, lng: 132.4553, description: "Peace Memorial Park and Miyajima's torii gate." },
            { id: "osaka", name: "Osaka", lat: 34.6937, lng: 135.5023, description: "Japan's kitchen - takoyaki and okonomiyaki." },
            { id: "kyoto", name: "Kyoto", lat: 35.0116, lng: 135.7681, description: "The cultural heart with thousands of temples." },
            { id: "tokyo", name: "Tokyo", lat: 35.6762, lng: 139.6503, description: "The world's largest metropolis." },
            { id: "sydney-4", name: "Sydney", lat: -33.8688, lng: 151.2093, description: "Completing the traverse." }
        ]
    }
];
