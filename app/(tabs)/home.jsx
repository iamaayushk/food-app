import { View, Text, Image, Platform, ScrollView, ImageBackground, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from '../../assets/images/dinetimelogo.png';
import { BlurView } from 'expo-blur';
import banner from '../../assets/images/homeBanner.png'
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
// import {restaurants} from '../../store/restaurants';
// import uploadData from '../../config/bulkupload';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const Home = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([])
  const temp = async()=>{
    const email= await AsyncStorage.getItem("userEmail")
    const value = await AsyncStorage.getItem("isGuest")
    console.log(value, email);
    

  }
 


  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={()=>
      router.push(`/restaurant/${item.name}`)
    } className="bg-[#5f5f5f] max-h-64 max-w-xs flex justify-center rounded-lg p-4 mx-4 shadow-md">
      <Image
        resizeMode="cover"
        source={{ uri: item.image }}
        className="w-50 h-28 mt-2 mb-1 rounded-lg"
      />
      <Text className="text-white text-lg font-bold mb-2">{item.name}</Text>
      <Text className="text-white text-base mb-2">{item.address}</Text>
      <Text className="text-white text-base mb-2"> Open: {item.opening} - Close: {item.closing}</Text>


    </TouchableOpacity>
  );
  const getRestaurants = async () => {
    const q = query(collection(db, "restaurants"));
    const res = await getDocs(q);

    res.forEach((item) => {
      setRestaurants((prev) => [...prev, item.data()]);
    })
  }
  useEffect(() => {

    getRestaurants();
    temp();


  }, [])

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b" },
        Platform.OS == "android" && { paddingBottom: 55 },
        Platform.OS == "ios" && { paddingBottom: 20 },
      ]}>
      <View className='flex items-center'>
        <View className='bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg items-center justify-center'>
          <View className='flex flex-row'>
            <Text
              className={`text-base h-10 ${Platform.OS == 'ios' ? "pt-[8px]" : "pt-1"} 
        align-middle text-white`}>
              Welcome to{" "}
            </Text>
            <Image resizeMode='cover ' className='w-20 h-12' source={logo} />
          </View>
        </View>
      </View>
      <ScrollView stickyHeaderIndices={[0]}>
        <ImageBackground source={banner} resizeMode='cover' className='mb-4 bg-[#2b2b2b] w-full h-52 items-center justify-center'>
          <BlurView intensity={Platform.OS === "android" ? 70 : 25} tint='dark' className=' p-4 shadow-lg'>
            <Text className='text-center text-3xl font-bold text-white'>Dining time with family</Text>
          </BlurView>
        </ImageBackground>
        <View className="p-4 bg-[#2b2b2b] flex-row items-center">
          <Text className="text-3xl text-white mr-2 font-semibold">
            Special Discount %
          </Text>

        </View>
        {
          restaurants.length > 0 ? (
            <FlatList
              data={restaurants}
              renderItem={renderItem}
              horizontal
              contentContainerStyle={{ padding: 16 }}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true} />
          ) : (
            <ActivityIndicator animating color={"#fb9b33"} />
          )}

        <View className="p-4 bg-[#2b2b2b] flex-row items-center">
          <Text className="text-3xl text-[#fb9b33] mr-2 font-semibold">
            Our Restaurants
          </Text>

        </View>
        {
          restaurants.length > 0 ? (
            <FlatList
              data={restaurants}
              renderItem={renderItem}
              horizontal
              contentContainerStyle={{ padding: 16 }}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true} />
          ) : (
            <ActivityIndicator animating color={"#fb9b33"} />
          )}



      </ScrollView>

    </SafeAreaView>
  );
}

export default Home;