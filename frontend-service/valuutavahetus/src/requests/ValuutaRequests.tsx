import axios from 'axios';
//Only public requests
const ENDPOINT_URL = 'http://localhost:8080/api/valuuta/public/';

export interface Valuuta {
  id: number;
  nimetus: string;
  kurss: number;
}

export async function getAllValuutas() {
  try {
    const response = await axios.get<Valuuta[]>(ENDPOINT_URL);

    return response.data;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return [];
  }
}
