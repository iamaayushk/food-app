import { View, Text, SafeAreaView, TouchableOpacity, StatusBar, ScrollView, Image, TextInput, Alert } from 'react-native'
import React from 'react'
import logo from '../../assets/images/dinetimelogo.png';
import frame from '../../assets/images/Frame.png';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import validationSchema from '../../utils/authSchema';
import { createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import {doc,getFirestore,setDoc} from "firebase/firestore";
import { auth , db } from '../../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Signup = () => {
    const router = useRouter();
    const db = getFirestore();
    const auth = getAuth();
    const handleGuest = async()=>{
        const userAlready = await AsyncStorage.getItem('userEmail');
        if(userAlready){
            Alert.alert("Logout first ")
            
        }
        else{
            await AsyncStorage.setItem("isGuest", "true");
            console.log(true);
            router.push("/home")
        }
  }
    const handleSignup = async (values) => {

        try {
            console.log("auth instance:", auth);
            const userCredentials = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            )
            console.log("userCredentials:", userCredentials);
            const user = userCredentials.user;
            await setDoc(doc(db, "users", user.uid), {
                email: values.email,
                createdAt: new Date()

            });
            
            
            
            await AsyncStorage.setItem("userEmail", values.email);
            await AsyncStorage.setItem("isGuest", "false");
            
            console.log("user",user, AsyncStorage.getItem("userEmail"));
            router.push("/home")


        }
        catch (error) {
            console.log("error in signup",error);
            
            if (error.code === "auth/email-already-in-use") {
                Alert.alert(
                    "Signup failed!",
                    "This email is already in use. Please use different email.", [{ text: "Ok" }]
                )
            }
            else {

                Alert.alert(
                    "Signup error!",
                    "An unexpected error occured. Please try again later.", [{ text: "Ok" }]
                )
            }
        }
    }
    return (
        <SafeAreaView className="bg-[#2b2b2b]">
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <View className="m-2 flex justify-center items-center ">
                    <Image source={logo} style={{ width: 290, height: 200 }} />
                    <Text className='text-lg text-center text-white font-bold mb-10'>Let's get you started</Text>


                    <View className='w-5/6'>
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={validationSchema}
                            onSubmit={handleSignup}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors,
                                touched
                            }) => (
                                <View className='w-full'>
                                    <Text className='text-[#f49b33] mt-4 mb-2'>Email</Text>
                                    <TextInput
                                        className='h-10 border border-white text-white rounded px-2'
                                        keyboardType="email-address"
                                        onChangeText={handleChange("email")}
                                        value={values.email}
                                        onBlur={handleBlur("email")}
                                    />
                                    {
                                        touched.email
                                        &&
                                        errors.email
                                        &&
                                        (
                                            <Text className='text-red-500 text-xs mb-2'>{errors.email}</Text>
                                        )}

                                    <Text className='text-[#f49b33] mt-4 mb-2'>Password</Text>
                                    <TextInput
                                        className='h-10 border border-white text-white rounded px-2'
                                        secureTextEntry
                                        onChangeText={handleChange("password")}
                                        value={values.password}
                                        onBlur={handleBlur("password")}
                                    />
                                    {
                                        touched.password
                                        &&
                                        errors.password
                                        &&
                                        (
                                            <Text className='text-red-500 text-xs mb-2'>{errors.password}</Text>
                                        )}
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10">
                                        <Text className="text-lg font-semibold text-center">Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </Formik>
                        <View className='flex justify-center items-center'>

                            <TouchableOpacity className="flex flex-row items-center justify-center mt-5 p-2" onPress={() => { router.push("/signin") }}>
                                <Text className="text-white font-semibold  ">
                                    Already a User? {" "}
                                </Text>
                                <Text className="text-lg font-semibold underline text-[#f49b33] text-center">Sign in</Text>
                            </TouchableOpacity>
                            <Text className="text-center text-lg font-semibold mb-4 text-white">
                                <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" /> or {" "}
                                <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />
                            </Text>
                            <TouchableOpacity className="flex flex-row items-center justify-center mb-5 p-2" onPress={handleGuest}>
                                <Text className="text-white font-semibold  ">
                                    Try as a{" "}
                                </Text>
                                <Text className="text-lg font-semibold underline text-[#f49b33] text-center">{""}guest user</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>




                <View className="flex-1">

                    <Image source={frame} className="w-full h-full " resizeMode="contain" />
                </View>
                <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />


            </ScrollView>
        </SafeAreaView>
    )
}

export default Signup;