import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/constant';
import { urls } from '../urls';
export class imageServices {

  static async uploadImage(formData) {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.token)
    const fetched = await fetch(urls.uploadImage, {
      method: 'POST',
      headers: {
        "token": token,
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: formData
    });

    const response = await fetched.json();
    return response;
  }
}