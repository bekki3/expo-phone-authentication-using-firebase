import { View, Text, Pressable, TextInput, Alert } from "react-native";
import React, { useRef, useState } from "react";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "./config";
import firebase from "firebase/compat/app";

const PhoneVerification = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [code, setCode] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);

    const sendVerification = () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
            .then(setVerificationId);
        setPhoneNumber("");
    };

    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        firebase
            .auth()
            .signInWithCredential(credential)
            .then(() => {
                setCode("");
            })
            .catch((err) => {
                console.error(err);
            });
        Alert.alert("Logged in");
    };

    return (
        <View style={{ flex: 1, margin: 50 }}>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
            />
            <Text>Login</Text>
            <TextInput
                placeholder="phone num."
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <Pressable onPress={sendVerification}>
                <Text>Send verification</Text>
            </Pressable>

            <TextInput
                placeholder="confirm code"
                onChangeText={setCode}
                keyboardType="phone-pad"
            />
            <Pressable onPress={confirmCode}>
                <Text>Confirm verification</Text>
            </Pressable>
        </View>
    );
};

export default PhoneVerification;
