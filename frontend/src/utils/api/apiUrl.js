import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL_KEY = 'API_BASE_URL';
const DEFAULT_URL = 'http://localhost:8080';

export async function setApiUrl(url) {
  await AsyncStorage.setItem(API_URL_KEY, url);
}

export async function getApiUrl() {
  const url = await AsyncStorage.getItem(API_URL_KEY);
  return url || DEFAULT_URL;
}

export async function removeApiUrl() {
  await AsyncStorage.removeItem(API_URL_KEY);
}
