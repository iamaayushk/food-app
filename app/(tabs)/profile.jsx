import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {getAuth, signOut} from "firebase/auth";
import { getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
const profile = () => {
  const auth = getAuth();
  const [userEmail, setUserEmail] = useState(null);
  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail")
      setUserEmail(email)
    }
    fetchUserEmail();
  }, [])
  const router = useRouter();
  const handleLogout = async() => {
    try{
      await signOut(auth);
      await AsyncStorage.removeItem("userEmail");
      setUserEmail(null)
      Alert.alert("Logged out", "You have been logged out successfully");
      router.push("/signin");
    }
    catch(error){
      Alert.alert("Logged out error", "Error while logging out");

    }
  }
  const handleSignup = ()=>{
    router.push("/signup")
  }
  return (
    <View className="flex-1 justify-center items-center bg-[#2b2b2b]">
      <Text className="text-xl text-[#f4b933] font-semibold mb-4"> User Profile</Text>
      {
        userEmail ? (<>
          <Text className="text-white text-lg mb-6">Email: {userEmail}</Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10">
            <Text className="text-lg font-semibold text-center">Logout</Text>
          </TouchableOpacity>
        </>) : (<>
          <TouchableOpacity
            onPress={handleSignup}
            className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10">
            <Text className="text-lg font-semibold text-center">Sign Up</Text>
          </TouchableOpacity>
        </>)
      }
    </View>
  )
}

export default profile;