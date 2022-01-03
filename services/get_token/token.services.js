import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/constant';
import { urls } from '../urls';
export class tokenServices {

  static async getToken(requestBody) {
    console.log(requestBody)
    const fetched = await fetch(urls.getToken, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: requestBody
    });

    try {
      const response = await fetched.json();
      if (response?.resp === 1) {
        await AsyncStorage.setItem(STORAGE_KEYS.token, response?.token.toString())
      }
    } catch (e) {
      console.log(JSON.stringify(e))
    }
  }
}