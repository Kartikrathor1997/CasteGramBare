import React, { useRef, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';

const CustomModal = ({ visible, title, description, success, onBackdropPress }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 20,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const closeModal = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onBackdropPress());
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

//   const renderIcon = () => {
//     if (success) {
//       return <MaterialIcons name="check-circle" size={80} color="#00C851" />;
//     } else {
//       return <MaterialIcons name="cancel" size={80} color="#FF4444" />;
//     }
//   };

  return (
    <Modal visible={visible} transparent={true} animationType="none" onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContainer, animatedStyle]}>
              {/* <View style={styles.iconContainer}>{renderIcon()}</View> */}
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CustomModal;
