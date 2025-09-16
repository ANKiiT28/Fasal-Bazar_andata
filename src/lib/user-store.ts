
"use client";

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  [key: string]: any; 
}

export interface UserCredentials extends Omit<User, 'name' | 'id'> {
    name?: string;
    password?: string;
}

const USERS_STORAGE_KEY = 'app_users';

function getStoredUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
}

function setStoredUsers(users: User[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

const initialProfileData: { [key: string]: any[] } = {
    farmer: [
        {
            id: 'user-farmer-01',
            name: 'Aditya Panwar',
            email: 'aditya@example.com',
            password: 'password123',
            role: 'farmer',
            avatar: 'https://picsum.photos/seed/aditya/200',
            rating: 4.8, bio: 'farmer_bio', farmName: 'green_valley_organics',
            location: 'Pune, Maharashtra', specialty: 'organic_specialties',
            phone: '+91 7500807060', upiId: 'aditya.pawar@okhdfcbank', bankAccount: 'HDFC Bank - XXXX1234',
            isTrusted: true
        },
        {
            id: 'user-farmer-02',
            name: 'Ramesh Kumar',
            email: 'ramesh@example.com',
            password: 'password123',
            role: 'farmer',
            avatar: 'https://picsum.photos/seed/ramesh/200',
            rating: 4.8, bio: 'A farmer from Nashik with 20 years of experience in grape and onion farming.', farmName: 'Kumar Farms',
            location: 'Nashik, Maharashtra', specialty: 'Onions, Grapes',
            phone: '+91 9822098220', upiId: 'ramesh.k@okaxis', bankAccount: 'Axis Bank - XXXX5678',
            isTrusted: false
        },
        {
            id: 'user-farmer-03',
            name: 'Sunita Devi',
            email: 'sunita@example.com',
            password: 'password123',
            role: 'farmer',
            avatar: 'https://picsum.photos/seed/sunita/200',
            rating: 4.6, bio: 'Specializing in fresh vegetables and leafy greens from my farm near Indore.', farmName: 'Devi Organics',
            location: 'Indore, Madhya Pradesh', specialty: 'Spinach, Potatoes, Leafy Greens',
            phone: '+91 9988776655', upiId: 'sunita.devi@okicici', bankAccount: 'ICICI Bank - XXXX9012',
            isTrusted: false
        },
        {
            id: 'user-farmer-04',
            name: 'Gurpreet Singh',
            email: 'gurpreet@example.com',
            password: 'password123',
            role: 'farmer',
            avatar: 'https://picsum.photos/seed/gurpreet/200',
            rating: 4.9, bio: 'Proudly growing the finest wheat and mustard in the fields of Punjab.', farmName: 'Singh & Sons Agriculture',
            location: 'Ludhiana, Punjab', specialty: 'Wheat, Mustard, Basmati Rice',
            phone: '+91 9876501234', upiId: 'gurpreet.s@ybl', bankAccount: 'Yes Bank - XXXX3456',
            isTrusted: true
        },
        {
            id: 'user-farmer-05',
            name: 'Lakshmi Reddy',
            email: 'lakshmi@example.com',
            password: 'password123',
            role: 'farmer',
            avatar: 'https://picsum.photos/seed/lakshmi/200',
            rating: 4.7, bio: 'From the heart of Andhra, bringing you the spiciest Guntur chillies and fresh vegetables.', farmName: 'Reddy Chilli Farms',
            location: 'Guntur, Andhra Pradesh', specialty: 'Chilli, Brinjal, Turmeric',
            phone: '+91 9123456789', upiId: 'lakshmi.r@oksbi', bankAccount: 'SBI - XXXX7890',
            isTrusted: false
        },
    ],
    buyer: [
        {
            id: 'user-buyer-01',
            name: 'Harsh Singh',
            email: 'harsh@example.com',
            password: 'password123',
            role: 'buyer',
            avatar: 'https://picsum.photos/seed/harsh/200',
            bio: 'buyer_bio', phone: '+91 9876543210',
            addresses: { home: '123, Rose Apartments, Viman Nagar, Pune', office: '456, WeWork, Magarpatta, Pune' },
            payment: { upi: 'harsh.singh@okhdfcbank', card: 'HDFC Credit Card **** 5678' }
        },
        {
            id: 'user-buyer-02',
            name: 'Anjali Sharma',
            email: 'anjali@example.com',
            password: 'password123',
            role: 'buyer',
            avatar: 'https://picsum.photos/seed/anjali/200',
            bio: 'A restaurant owner in Mumbai looking for bulk purchases of fresh, organic produce.', phone: '+91 9876512345',
            addresses: { home: 'Flat 101, Sea View, Bandra West, Mumbai', office: 'The Golden Spoon Restaurant, Juhu, Mumbai' },
            payment: { upi: 'anjali.sharma@paytm', card: 'Kotak Bank Visa **** 1122' }
        }
    ],
    delivery: [
        {
            id: 'user-delivery-01',
            name: 'Adarsh Singh',
            email: 'adarsh@example.com',
            password: 'password123',
            role: 'delivery',
            avatar: 'https://picsum.photos/seed/adarsh/200',
            rating: 4.9, vehicle: 'electric_bike', serviceArea: 'pune_pcmc',
            phone: '+91 8765432109', vehicleId: 'MH 12 AB 1234', licenseNo: 'DL1234567890123'
        }
    ],
    admin: [
        {
            id: 'user-admin-01',
            name: 'Ankit Kumar',
            email: 'ankit@example.com',
            password: 'password123',
            role: 'admin',
            avatar: 'https://picsum.photos/seed/ankit/200',
        }
    ]
};

function ensureDefaultUsers() {
    if (typeof window === 'undefined') return;

    const storedUsers = getStoredUsers();
    const allDefaultUsers = [
        ...initialProfileData.farmer,
        ...initialProfileData.buyer,
        ...initialProfileData.delivery,
        ...initialProfileData.admin,
    ];

    const defaultUserIds = new Set(allDefaultUsers.map(u => u.id));

    // Filter out any old versions of the default users from storage
    const customUsers = storedUsers.filter(user => !defaultUserIds.has(user.id));
    
    const finalUserList = [...customUsers, ...allDefaultUsers];

    // Check if there's an actual change to avoid unnecessary writes
    if (JSON.stringify(storedUsers) !== JSON.stringify(finalUserList)) {
        setStoredUsers(finalUserList);
    }
}

// Run the check when the module is loaded on the client side.
ensureDefaultUsers();

// Initialize with an empty crop list if none exists
if (typeof window !== 'undefined' && !localStorage.getItem('allCrops')) {
    localStorage.setItem('allCrops', JSON.stringify([]));
}


export const findOrCreateUser = (
    credentials: UserCredentials,
    isSignUp: boolean
): { success: boolean; user: User | null; message: string } => {

    if (!credentials.email || !credentials.password) {
        return { success: false, user: null, message: "Email and password are required." };
    }

    const users = getStoredUsers();
    const existingUser = users.find(u => u.email === credentials.email);

    if (isSignUp) {
        if (existingUser) {
            return { success: false, user: null, message: 'An account with this email already exists.' };
        }
        if (!credentials.name) {
            return { success: false, user: null, message: 'Name is required for sign up.' };
        }
        
        const newUser: User = {
            id: `user-${credentials.role}-${Date.now()}`,
            name: credentials.name,
            email: credentials.email,
            password: credentials.password, // In a real app, this should be hashed
            role: credentials.role,
            avatar: 'https://picsum.photos/seed/newuser/200',
            // Add other role-specific default properties if needed
        };

        const updatedUsers = [...users, newUser];
        setStoredUsers(updatedUsers);
        return { success: true, user: newUser, message: 'Account Created' };

    } else { // Sign In
        if (!existingUser) {
            return { success: false, user: null, message: 'User not found. Please sign up.' };
        }

        if (existingUser.role !== credentials.role) {
            return { success: false, user: null, message: `This email is registered as a ${existingUser.role}, not a ${credentials.role}.` };
        }
        
        // In a real app, you would verify a hashed password. Here we do a simple check.
        if (existingUser.password !== credentials.password) {
            return { success: false, user: null, message: 'Incorrect password.' };
        }

        return { success: true, user: existingUser, message: 'Login Successful' };
    }
};

export const updateUser = (userId: string, updatedData: Partial<User>) => {
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        setStoredUsers(users);
        return users[userIndex];
    }
    return null;
};
