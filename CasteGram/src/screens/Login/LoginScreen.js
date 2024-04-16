import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Image, TextInput, TouchableOpacity, Text, ActivityIndicator,StatusBar } from 'react-native';
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// import { initializeApp } from 'firebase/app';
// import { getAuth, PhoneAuthProvider, signInWithCredential, RecaptchaVerifier } from 'firebase/auth';
// import { firebaseConfig } from '../../firebase';
import CountryPicker from 'react-native-country-picker-modal';
import CustomModal from '../../components/modals/CustomModal';
import { useNavigation } from '@react-navigation/native';
// import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase app
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const phoneProvider = new PhoneAuthProvider(auth);

const LoginScreen = () => {
  const logoAnimation = useRef(new Animated.Value(0)).current;
  const [selectedCountry, setSelectedCountry] = useState(null);
  const recaptchaVerifier = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');

  const navigation = useNavigation();

  //useEffects
  useEffect(() => {
    if (verificationId) {
      AsyncStorage.setItem('Phone', formattedPhoneNumber.toString());
      navigation.navigate('OTP', { verificationId: verificationId, formattedPhoneNumber: formattedPhoneNumber });
      console.log('Verification navigate', { verificationId: verificationId, formattedPhoneNumber: formattedPhoneNumber });
    }
  }, [verificationId]);

  // Set default country as India
  useEffect(() => {
    const defaultCountry = {
      cca2: 'IN',
      callingCode: '91',
      name: 'India',
    };
    setSelectedCountry(defaultCountry);
  }, []);

  //functions
  const validatePhoneNumber = () => {
    navigation.navigate("OTPVerification")
    //check later
    if(false){
      if (!selectedCountry) {
        setModalTitle('Error');
        setModalDescription('Please select a country');
        setModalSuccess(false);
        setModalVisible(true);
        return false;
      }
  
    }
   
    if (selectedCountry.name === 'India' && phoneNumber.length !== 10) {
      setModalTitle('Error');
      setModalDescription('Please enter a valid 10-digit phone number');
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }

    return true;
  };

  const sendVerificationCode = async () => {
    if (!validatePhoneNumber()) {
      return;
    }

    // setLoading(true);

    // const formattedPhoneNumber = `+${selectedCountry.callingCode}${phoneNumber}`;
    // setFormattedPhoneNumber(formattedPhoneNumber);
    // try {
    //   const verificationSnapshot = await phoneProvider.verifyPhoneNumber(
    //     formattedPhoneNumber,
    //     recaptchaVerifier.current
    //   ).then(setVerificationId);
    //   console.log('Verification code has been sent to your phone', verificationId);
    //   setLoading(false);
    // } catch (error) {
    //   console.log('Error sending verification code:', error);
    //   let errorMessage = 'An unknown error occurred';
    //   if (error.code === 'auth/invalid-phone-number') {
    //     errorMessage = 'Invalid phone number';
    //   } else if (error.code === 'auth/too-many-requests') {
    //     errorMessage = 'Too many requests. Please try again later.';
    //   }
    //   setModalTitle('Error');
    //   setModalDescription(errorMessage);
    //   setModalSuccess(false);
    //   setModalVisible(true);
    //   setLoading(false);
    // }

    else{
      navigation.navigate("OTPS")
    }

  };

  useEffect(() => {
    startLogoAnimation();
  }, []);

  const startLogoAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const logoStyle = {
    transform: [
      {
        translateY: logoAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E14265" barStyle="light-content" translucent />
      <View style={styles.statusBarBackground} />
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image source={require('../../assets/images/castgram.png')} style={styles.logo} />
      </Animated.View>
      <View style={styles.inputContainer}>
        <View style={styles.countryContainer}>
          <CountryPicker
            withFilter
            withFlag
            withCountryNameButton
            withCallingCode
            withCallingCodeButton
            withEmoji
            onSelect={handleCountrySelect}
            placeholder="Select Country"
            countryCode={selectedCountry ? selectedCountry.cca2 : 'IN'}
            containerButtonStyle={styles.countryPickerButton}
            countryCodeTextStyle={styles.countryPickerButtonText}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          placeholderTextColor="#D9D8D8"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TouchableOpacity style={styles.nextButton} onPress={sendVerificationCode}>
          {loading ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <Text style={styles.nextButtonText}>GET OTP</Text>
          )}
        </TouchableOpacity>
      </View>
      <View id="recaptcha-container" style={styles.recaptchaContainer}></View>
      {/* <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      /> */}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        description={modalDescription}
        success={modalSuccess}
        onBackdropPress={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#E14265'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '80%',
  },
  countryContainer: {
    marginBottom: 20,
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  countryPickerButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  input: {
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    color: '#000000',
  },
  nextButton: {
    backgroundColor: '#ffffff',
    marginBottom: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  recaptchaContainer: {
    height: 0,
  },
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StatusBar.currentHeight,
    backgroundColor: '#E14265',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
});

export default LoginScreen;
