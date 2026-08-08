import axios from 'axios';
import { User } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const TOKEN_KEY_ACCESS = 'pricetracker_access_token';
const TOKEN_KEY_REFRESH = 'pricetracker_refresh_token';
const USER_KEY = 'pricetracker_user_data';

// Axios Instance with Automatic Bearer Token Header
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY_ACCESS);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(TOKEN_KEY_REFRESH);
}

export function saveTokens(access: string, refresh: string): void {
  localStorage.setItem(TOKEN_KEY_ACCESS, access);
  localStorage.setItem(TOKEN_KEY_REFRESH, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY_ACCESS);
  localStorage.removeItem(TOKEN_KEY_REFRESH);
  localStorage.removeItem(USER_KEY);
}

export function getSavedUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as User;
  } catch {
    return null;
  }
}

export function saveUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}



export async function loginUserApi(phoneNumber: string, password: string): Promise<User> {
  const response = await apiClient.post('/auth/login/', {
    phone_number: phoneNumber,
    password,
  });

  const { access, refresh, user_id, first_name, last_name, phone_number, wallet_balance } = response.data;
  saveTokens(access, refresh);

  const user: User = {
    id: user_id || 'usr_1',
    name: `${first_name} ${last_name}`.trim(),
    firstName: first_name,
    lastName: last_name,
    phone: phone_number || phoneNumber,
    tokens: wallet_balance ?? 50,
    searchCount: 0,
    createdAt: new Date().toISOString(),
  };

  saveUser(user);
  return user;
}

export async function registerUserApi(
  firstName: string,
  lastName: string,
  phoneNumber: string,
  password: string
): Promise<User> {
  await apiClient.post('/auth/register/', {
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
    password,
    password_confirm: password,
  });

  // Automatically log in after registration
  return await loginUserApi(phoneNumber, password);
}


export async function fetchUserProfileApi(): Promise<User | null> {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const response = await apiClient.get('/auth/profile/');
    const data = response.data;
    const user: User = {
      id: data.id,
      name: `${data.first_name} ${data.last_name}`.trim(),
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone_number,
      tokens: data.wallet_balance ?? 50,
      searchCount: data.search_count || 0,
      createdAt: data.date_joined || new Date().toISOString(),
    };
    saveUser(user);
    return user;
  } catch {
    clearTokens();
    return null;
  }
}

export function logoutUser(): void {
  clearTokens();
}
