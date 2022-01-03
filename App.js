/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import UploadImage from './src/uploadImage';
import { tokenServices } from './services/get_token/token.services';
import base64 from 'react-native-base64';
import Aes from 'react-native-aes-crypto';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  /**
   * Get the encrypted data 
   * @param {*} text 
   * @param {*} key 
   * @returns 
   */
  const encryptData = (text, key) => {
    return Aes.randomKey(16).then((iv) => {
      return Aes.encrypt(text, key, iv, 'aes-128-cbc').then((cipher) => ({
        cipher,
        iv,
      }))
    })
  }

  /**
   * Get the final ciphertext
   * @returns 
   */
  const getEncryptData = async () => {
    try {
      var encrypt_key = 'ab821eb4b7d352cd65e84c5a7f38dbb0966262c651cf7064a0d821d8b2a20a5a';
      var text = 'This is some sample plaintext data to encrypt'
      var response = await encryptData(text, encrypt_key)
      var final_ciphertext = base64.encode(response?.iv + response?.cipher);
      return final_ciphertext
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Call get token API
   */
  const getToken = async () => {
    // Get Encrypted text - (iv+raw_ciphertext)
    var final_ciphertext = await getEncryptData()
    const payload = await {
      "ciphertext": final_ciphertext
    }
    await tokenServices.getToken(payload)
  }

  useEffect(() => {
    // get token and store it on AsyncStorage
    getToken()
  }, [])

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <UploadImage />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%"
  }
});

export default App;
