import { View, Text, Platform, ScrollView, FlatList, Dimensions, Image, Animated, Linking } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import DatePickerComponent from '../../components/restaurant/DatePickerComponent';
import GuestPickerComponent from '../../components/restaurant/GuestPickerComponent';
import FindSlots from '../../components/restaurant/FindSlots';


const Restaurant = () => {
    const {restaurant} = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [restaurantData, setRestaurantData] = useState({});
    const [carouselData, setCarouselData] = useState({});
    const [slotsData, setSlotsData] = useState({});
    const flatListRef = useRef(null);
    const windowWidth = Dimensions.get("window").width;
    const [date, setDate] = useState(new Date())
    const [selectedNumber, setSelectedNumber] = useState(2)
    const [selectedSlot, setSelectedSlot]= useState(null);
    const handleNextImage= ()=>{
        const carouselLength = carouselData[0]?.images.length;
        if(currentIndex< carouselLength-1){
            const nextIndex= currentIndex+1;
            setCurrentIndex(nextIndex);
            flatListRef.current.scrollToIndex({index:nextIndex, animated:true});
        }
        if(currentIndex == carouselLength-1){
            const nextIndex=0;
            setCurrentIndex(nextIndex);
            flatListRef.current.scrollToIndex({index:nextIndex, animated:true});
        }
    };

    const handlePrevImage= ()=>{
        const carouselLength = carouselData[0]?.images.length;
        if(currentIndex>0){
            const prevIndex= currentIndex-1;
            setCurrentIndex(prevIndex);
            flatListRef.current.scrollToIndex({index:prevIndex, animated:true});
        }
        if(currentIndex == 0){
            const prevIndex=carouselLength-1; 
            setCurrentIndex(prevIndex);
            flatListRef.current.scrollToIndex({index:prevIndex, animated:true});
        }
    };
    const carouselItem = ({item})=>{
        return(
            <View 
            style={{
                width:windowWidth-2 }} 
                className="h-64 relative ">
                <View 
                style={{
                    position:"absolute", 
                    top:"50%",
                    backgroundColor:"rgba(0,0,0,0.1)", 
                    borderRadius:50, 
                    padding:5, 
                    zIndex:10, 
                    right:"6%"}}>
                <Ionicons 
                onPress={handleNextImage}
                name="arrow-forward" 
                size={24} 
                color="white" />
                </View>
                <View 
                style={{
                    position:"absolute", 
                    top:"50%",
                    backgroundColor:"rgba(0,0,0,0.1)", 
                    borderRadius:50, 
                    padding:5, 
                    zIndex:10, 
                    left:"2%"}}>
                <Ionicons 
                onPress={handlePrevImage}
                name="arrow-back" 
                size={24} 
                color="white" />  
                </View>
                <View style={{position:"absolute",display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'row', left:"50%",transform:[{translateX:-50}], zIndex:10, bottom:15}}>
                   {
                    carouselData[0].images?.map((_,i)=>(
                     <View key={i} className={`bg-white h-2 w-2 ${i == currentIndex && "h-3 w-3"} p-1 mx-1 rounded-full`}/>

                    ))
                   }
                </View>
                <Image 
                source={{uri:item}} 
                style={{
                    opacity:0.8, 
                    backgroundColor:"black", 
                    marginRight:20, 
                    marginLeft:5,
                borderRadius:25}}
                className="h-64"
                    />
            </View>
        )
    }

    const getRestaurantData = async()=>{
        try{
            const restaurantQuery = query(collection(db,"restaurants"), where("name","==",restaurant))
            const restaurantSnapshot = await getDocs(restaurantQuery);
            if(restaurantSnapshot.empty){
                console.log("No matching restaurant found");
                return;
                
            }
            for(const doc of restaurantSnapshot.docs){
                const restaurantData = doc.data();
                setRestaurantData(restaurantData);

                const carosuelQuery = query(
                    collection(db,"carousel"), where("res_id","==", doc.ref)
                );
            const carouselSnapshot = await getDocs(carosuelQuery);
            const carouselImages = [];
            if(carouselSnapshot.empty){
                console.log("No matching carousole found");
                return;
                
            }
            carouselSnapshot.forEach((carouselDoc)=>{
                carouselImages.push(carouselDoc.data());
            })
            setCarouselData(carouselImages);
             
            const slotsQuery = query(
                    collection(db,"slots"), where("ref_id","==", doc.ref)
                );
            const slotsSnapshot = await getDocs(slotsQuery);
            const slots = [];
            if(slotsSnapshot.empty){
                console.log("No matching slots found");
                return;
                
            }
            slotsSnapshot.forEach((slotDoc)=>{
                slots.push(slotDoc.data());
            })
            setSlotsData(slots[0]?.slot);
              
            
            }
        }
        catch(error){
            console.log("Error fetching data", error);
            
        }
    }
    const handleLocation= async()=>{
        const url = ""
        const supported =  await Linking.canOpenURL(url);
        if(supported){
            await Linking.openURL(url);
        }
        else{
            console.log("invalid url");
            
        }
    }
    useEffect(() => {
      getRestaurantData();
    }, [])
    

    
  return (
    
    <SafeAreaView 
     style={[
            { backgroundColor: "#2b2b2b" },
            Platform.OS == "android" && { paddingBottom: 55 },
            Platform.OS == "ios" && { paddingBottom: 20 },
          ]}>
            <ScrollView className="h-full">
                <View className='flex-1 my-2 p-2'>
                <Text className='text-xl text-[#f49b33] mr-2 font-semibold' >{restaurant}</Text>

                <View className='border-b border-[#f49b33]'/>
                </View>
                <View className='h-64 max-w-[98%] mx-2 rounded-[25px]'>
                <FlatList 
                ref={flatListRef}
                data={carouselData[0]?.images}
                renderItem={carouselItem}
                horizontal
                scrollEnabled={false}
                style={{borderRadius:25}}
                showsHorizontalScrollIndicator={false}
                /> 
                </View>
                <View className="flex-1 flex-row mt-2 p-2">
                    <Ionicons 
                onPress={handleNextImage}
                name="location-sharp" 
                size={24} 
                color="#f4b933" />
                <Text className="max-w-[75%] text-white">
                    {restaurantData?.address} |{"  "}

                <Text onPress={handleLocation} className="underline flex items-center text-[#f49b33] font-semibold italic mt-1">
                    Get Direction
                </Text>
                </Text>
                </View>

                 <View className="flex-1 flex-row mt-2 p-2">
                    <Ionicons 
                onPress={handleNextImage}
                name="time" 
                size={24} 
                color="#f4b933" />
                <Text className="max-w-[75%] mx-2 text-white">
                    {restaurantData?.opening} - {restaurantData?.closing}

                
                </Text>
                </View>
        <View className="flex-1 border m-2 p-2 border-[#f4b933] rounded-lg">

            <View className="flex-1 flex-row m-2 p-2 border-[#f49b33] rounded-lg justify-end items-center">
                <View className="flex-1 flex-row">
                    <Ionicons name='calendar' size={20} color='#f4b933'/>
                    <Text className="text-white mx-2 text-base">
                        Select booking date
                    </Text>
                </View>
                <DatePickerComponent date={date} setDate={setDate} />
                
            </View>

            <View className="flex-1 bg-[#474747] flex-row m-2 p-2 border-[#f49b33] rounded-lg justify-end items-center">
                <View className="flex-1 flex-row">
                    <Ionicons name='people' size={20} color='#f4b933'/>
                    <Text className="text-white mx-2 text-base">
                        Select Number of People
                    </Text>
                </View>
                <GuestPickerComponent selectedNumber={selectedNumber} setSelectedNumber={setSelectedNumber} />
                 
            </View>
            </View>
            <View className="flex-1">
                <FindSlots
                    restaurant={restaurant} 
                    date={date}
                    selectedNumber={selectedNumber}
                    slots={slotsData} 
                    selectedSlot={selectedSlot} 
                    setSelectedSlot={setSelectedSlot} 
                />
            </View>
            </ScrollView>
    </SafeAreaView>
  )
}

export default Restaurant;
