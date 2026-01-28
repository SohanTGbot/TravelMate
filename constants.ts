
import { Destination, FAQ, Review, Blog, Service } from './types';

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Goa, India',
    image: 'https://picsum.photos/id/1015/600/400',
    description: 'Sun, sand, and spices. The perfect beach getaway with Portuguese heritage.',
    rating: 4.8,
    category: 'Beach',
    bestMonth: 'Nov - Feb',
    idealDuration: '4-6 Days',
    priceLevel: 'Medium'
  },
  {
    id: '2',
    name: 'Kyoto, Japan',
    image: 'https://picsum.photos/id/1018/600/400',
    description: 'Ancient temples, traditional tea houses, and enchanting bamboo forests.',
    rating: 4.9,
    category: 'Culture',
    bestMonth: 'Mar - May',
    idealDuration: '5-7 Days',
    priceLevel: 'High'
  },
  {
    id: '3',
    name: 'Bali, Indonesia',
    image: 'https://picsum.photos/id/1039/600/400',
    description: 'Tropical paradise with lush jungles, vibrant culture, and surfing spots.',
    rating: 4.7,
    category: 'Beach',
    bestMonth: 'Apr - Oct',
    idealDuration: '7-10 Days',
    priceLevel: 'Medium'
  },
  {
    id: '4',
    name: 'Paris, France',
    image: 'https://picsum.photos/id/1040/600/400',
    description: 'The city of lights, offering world-class art, fashion, and gastronomy.',
    rating: 4.8,
    category: 'City',
    bestMonth: 'Jun - Aug',
    idealDuration: '4-5 Days',
    priceLevel: 'High'
  },
  {
    id: '5',
    name: 'Dubai, UAE',
    image: 'https://picsum.photos/id/1035/600/400',
    description: 'Futuristic architecture, luxury shopping, and thrilling desert safaris.',
    rating: 4.6,
    category: 'Desert',
    bestMonth: 'Nov - Mar',
    idealDuration: '3-5 Days',
    priceLevel: 'High'
  },
  {
    id: '6',
    name: 'Manali, India',
    image: 'https://picsum.photos/id/1036/600/400',
    description: 'Snow-capped mountains and river valleys offering peace and adventure.',
    rating: 4.7,
    category: 'Mountain',
    bestMonth: 'Oct - Jun',
    idealDuration: '3-5 Days',
    priceLevel: 'Low'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    user: 'Aarav Patel',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'TravelMate planned my entire honeymoon in Bali. It found hidden gems we never would have discovered on our own!',
    approved: true,
    location: 'Mumbai, India',
    tripType: 'Couple',
    date: '2 weeks ago'
  },
  {
    id: '2',
    user: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    rating: 4,
    comment: 'Great suggestions for budget travel in Europe. The budget estimator was spot on, though I wish it had more hostel options.',
    approved: true,
    location: 'London, UK',
    tripType: 'Solo',
    date: '1 month ago'
  },
  {
    id: '3',
    user: 'Rohan Gupta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'The AI itinerary was surprisingly detailed. It even accounted for travel time between locations perfectly.',
    approved: true,
    location: 'Delhi, India',
    tripType: 'Friends',
    date: '3 weeks ago'
  }
];

export const MOCK_FAQS: FAQ[] = [
  {
    id: '1',
    question: 'How accurate is the AI planning?',
    answer: 'Our Gemini-powered AI uses real-time data analysis to ensure high accuracy. However, we always recommend verifying operating hours and prices locally.'
  },
  {
    id: '2',
    question: 'Can I customize the generated plan?',
    answer: 'Yes! Once the AI generates your base itinerary, you can edit activities, regenerate specific days, or adjust the budget to fit your needs perfectly.'
  },
  {
    id: '3',
    question: 'Is TravelMate free to use?',
    answer: 'The core itinerary generation features are completely free. We may introduce premium features for booking integrations in the future.'
  },
  {
    id: '4',
    question: 'Can I export my plan?',
    answer: 'Absolutely. You can download your itinerary as a PDF, text file, or JSON format to take with you offline.'
  }
];

export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Smart AI Planning',
    description: 'Generate comprehensive day-by-day itineraries tailored to your unique style in seconds.',
    icon: '🤖',
    stats: '50k+ Plans Created'
  },
  {
    id: '2',
    title: 'Smart Stay Finder',
    description: 'Get tailored hotel and hostel suggestions that perfectly match your budget and location preferences.',
    icon: '🏨',
    stats: '120k+ Hotels Indexed'
  },
  {
    id: '3',
    title: 'Local Secrets',
    description: 'Discover hidden gems, local favorite eateries, and cultural spots avoiding typical tourist traps.',
    icon: '🗺️',
    stats: '150+ Countries'
  }
];

export const MOCK_BLOGS: Blog[] = [
  {
    id: '1',
    title: '10 Hidden Gems in Southeast Asia',
    excerpt: 'Move beyond the tourist trails and discover these untouched paradises that offer solitude and beauty.',
    content: 'Full article content...',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    author: 'TravelMate Team',
    date: 'Jan 15, 2025',
    category: 'Guides',
    readTime: '5 min read',
    featured: true
  },
  {
    id: '2',
    title: 'Packing Light: The Ultimate Guide',
    excerpt: 'How to travel for 2 weeks with just a carry-on backpack using our proven layering techniques.',
    content: 'Full article content...',
    image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    author: 'Sarah J.',
    date: 'Feb 01, 2025',
    category: 'Tips',
    readTime: '3 min read',
    featured: false
  },
  {
    id: '3',
    title: 'Budget Travel in Europe 2025',
    excerpt: 'Explore the continent without breaking the bank. Top tips for trains, hostels, and cheap eats.',
    content: 'Full article content...',
    image: 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    author: 'Mike T.',
    date: 'Feb 10, 2025',
    category: 'Budget',
    readTime: '7 min read',
    featured: false
  }
];
