import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
// import { getAuth, signInWithCredential, PhoneAuthProvider } from 'firebase/auth';
import { useRoute } from '@react-navigation/native';
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// import { firebaseConfig } from '../../firebase';
import CustomModal from '../../components/modals/CustomModal';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const auth = getAuth();

const OTPVerification = () => {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigation = useNavigation();
 
  


  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [verificationId, setVerificationId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);


  const route = useRoute();
  console.log("route", route)

  // const verificationAuthId = route?.params?.verificationId;

  const formattedPhoneNumber = route?.params?.formattedPhoneNumber;


  // useEffect(() => {
  //   if (verificationAuthId && verificationId === '') {
  //     setVerificationId(verificationAuthId);
  //   }
  // }, [verificationAuthId, verificationId]);

  useEffect(() => {
    if (countdown > 0 && resendDisabled) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown, resendDisabled]);

  const recaptchaVerifier = useRef(null);

  useEffect(() => {
    // Check if the user is already authenticated (i.e., OTP is verified) and navigate accordingly
    // const unsubscribe = auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     // User is already authenticated (OTP is verified)
    //     const uid = user.uid;
    //     // Now check if the form is filled or not
    //     // checkFormFilled(uid);
    //   }
    // });

    // return () => unsubscribe();
  }, []);

  const handleOTPChange = (index, value) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    // Auto-focus on the next input box when a digit is entered
    if (value !== '') {
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      } else {
        Keyboard.dismiss();
      }
    }
  };


  const handleOTPVerification = async () => {
    try {
      const verificationCode = otp.join('');
      // const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      // await signInWithCredential(auth, credential);
      console.log('OTP verification successful');

      // Save the UID and other data in AsyncStorage
      // const uid = auth.currentUser.uid;
      const hasFilledForm = false; // Change this based on your logic for form filling
      const hasVerifiedOTP = true;

      // Saving the data
      try {
        await AsyncStorage.setItem('userUID', uid);
        await AsyncStorage.setItem('hasFilledForm', hasFilledForm.toString());
        await AsyncStorage.setItem('hasVerifiedOTP', hasVerifiedOTP.toString());

        // After saving the data, navigate to the appropriate screen
       checkFormFilled(uid);
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }

      // ... (existing modal logic)
    } catch (error) {
      console.log('Error verifying OTP:', error);
      // ... (existing modal logic)
    }

    navigation.navigate("Introduction")
  };

  const checkFormFilled = async (uid) => {
    try {
      // Retrieve the form filled status from AsyncStorage
      const hasFilledForm = await AsyncStorage.getItem('hasFilledForm');
      const isFormFilled = hasFilledForm === 'true';
      console.log("Uid", uid)
      if (!uid) {
        // User UID does not exist, navigate to the 'Login' screen
        navigation.navigate('Login');
      } else if (!isFormFilled) {
        // User UID exists, OTP is verified, but form is not filled, navigate to the 'Intro' screen
        navigation.navigate('Intro', { uid:uid, phone:formattedPhoneNumber });
      } else {
        // User UID exists, OTP is verified, and form is filled, navigate to the 'SwipableScreen' screen
        navigation.navigate('SwipableScreen', { uid });
      }
    } catch (error) {
      console.error('Error reading form filled status from AsyncStorage:', error);
    }
  };

 


  const handleResendOTP = async () => {
    if (resendDisabled) {
      return;
    }

    setResendDisabled(true);
    setCountdown(60);

    // const phoneProvider = new PhoneAuthProvider(auth);
    try {
      const verificationSnapshot = await phoneProvider.verifyPhoneNumber(
        formattedPhoneNumber,
        recaptchaVerifier.current
      ).then(setVerificationId);
      console.log('Verification code has been sent to your phone', verificationId);
    } catch (error) {
      console.log('Error sending verification code:', error);
      let errorMessage = 'An unknown error occurred';
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      }
      setModalVisible(true);
      setModalTitle('Error');
      setModalDescription(errorMessage);
      setModalSuccess(false);
    }
  };

  const handleOTPKeyPress = (index, key) => {
    if (key === 'Backspace' && index > 0 && otp[index] === '') {
      // Move focus to the previous input box when Backspace is pressed and the current input box is empty
      inputRefs.current[index - 1].focus();
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>Enter the verification code sent to your phone number</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              placeholder=""
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(value) => handleOTPChange(index, value)}
              onKeyPress={({ nativeEvent }) => handleOTPKeyPress(index, nativeEvent.key)}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleOTPVerification}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.resendButton, resendDisabled && styles.disabledResendButton]}
          onPress={handleResendOTP}
          disabled={resendDisabled}
        >
          <Text style={styles.resendButtonText}>
            {resendDisabled ? `Resend OTP in ${countdown} seconds` : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
        {/* <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification={true}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resendButton: {
    marginBottom: 20,
  },
  disabledResendButton: {
    backgroundColor: '#ccc',
  },
  resendButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default OTPVerification;
