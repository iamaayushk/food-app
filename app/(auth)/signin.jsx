import { View, Text, SafeAreaView, TouchableOpacity, StatusBar, ScrollView, Image, TextInput, Alert } from 'react-native'
import React from 'react'
import logo from '../../assets/images/dinetimelogo.png';
import frame from '../../assets/images/Frame.png';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import validationSchema from '../../utils/authSchema';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Signin = () => {
    
    const router = useRouter();
    const auth = getAuth();
    const db = getFirestore();
    
    const handleSignin = async (values) => {

        try {
            console.log("auth instance:", auth);
            const userCredentials = await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
            )
            const user = userCredentials.user;
            const userDoc= await getDoc(doc(db, "users", user.uid));
            if(userDoc.exists()){
                console.log("USer data :", userDoc.data());
                await AsyncStorage.setItem("userEmail", values.email);
                await AsyncStorage.setItem("isGuest", "false");

                router.push("/home")
                
            }
            else{
                console.log("no such document");
                
            }
            // console.log(user,AsyncStorage.getItem("userEmail"));

        }
        catch (error) {
            console.log(error);
            
            if (error.code === "auth/invalid-credential") {
                Alert.alert(
                    "Signin Failed!",
                    "Incorrect credentials. Please try again.", [{ text: "Ok" }]
                )
            }
            else {

                Alert.alert(
                    "Signin error!",
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
                            onSubmit={handleSignin}
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
                                        <Text className="text-lg font-semibold text-center">Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </Formik>
                        <View>
                            <TouchableOpacity className="flex flex-row items-center justify-center my-5 p-2" onPress={() => { router.push('/signup') }}>
                                <Text className="text-white font-semibold  ">
                                    Don't have account? {" "}
                                </Text>
                                <Text className="text-lg font-semibold underline text-[#f49b33] text-center">Sign up</Text>
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

export default Signin;