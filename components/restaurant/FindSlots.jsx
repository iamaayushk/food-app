import { View, Text, TouchableOpacity, Alert, Modal, TextInput } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from '@firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {Formik} from "formik";
import validationSchema from '../../utils/guestFromSchema';
import Ionicons from "@expo/vector-icons/Ionicons"
const FindSlots = ({ date, selectedNumber, setSelectedSlot, selectedSlot, slots, restaurant }) => {
    const [slotsVisible, setSlotsVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const handleFormSubmit= async(values)=>{
        try{
                await addDoc(collection(db, "bookings"),{
                    ...values,
                    slot: selectedSlot,
                    date: date.toISOString(),
                    guests: selectedNumber,
                    restaurant:restaurant
                });
                alert("Booking successful")
                
            }
            catch(error){
                console.log(error);
                
            }
    }
    const handlePress = () => {
        setSlotsVisible(!slotsVisible);
    }
    const handleSlotPress = (slot) => {
        let prevSlot = selectedSlot;
        if (prevSlot == slot) {
            setSelectedSlot(null)
        }
        else {
            setSelectedSlot(slot);
        }
    }
    const handleCloseModel = ()=>{
        setModalVisible(false);
    }

    const handleBooking = async()=>{
        const userEmail = await AsyncStorage.getItem("userEmail");
        const guestStatus = await AsyncStorage.getItem("isGuest");
        if(userEmail){
            try{
                await addDoc(collection(db, "bookings"),{
                    email: userEmail,
                    slot: selectedSlot,
                    date: date.toISOString(),
                    guests: selectedNumber,
                    restaurant:restaurant
                });
                alert("Booking successful")
            }
            catch(error){
                console.log(error);
            }
{

}        }
else if(guestStatus === "true"){
    setFormVisible(true);
    setModalVisible(true);
}
    }
    return (

        <View className="flex-1">
            <View className={`flex ${selectedSlot != null && "flex-row"}`}>
                <View className={`${selectedSlot != null && "flex-1"}`}>
                    <TouchableOpacity onPress={handlePress}>
                        <Text className="text-center text-lg font-semibold bg-[#f4b933] p-2 my-3 mx-2 rounded-lg">
                            Find Slots
                        </Text>
                    </TouchableOpacity>
                </View>
                {selectedSlot != null && (
                    <View className="flex-1">

                        <TouchableOpacity onPress={handleBooking}>
                            <Text className="text-center text-white text-lg font-semibold bg-[#f4b933] p-2 my-3 mx-2 rounded-lg">
                                Book Slot 
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>
            {slotsVisible && (
                <View className="flex-wrap flex-row mx-2 p-2 bg-[#474747] rounded-lg">
                    {slots.map((slot, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`m-2 p-4 bg-[#f4b933] rounded-lg items-center justify-center ${selectedSlot && selectedSlot != slot ? "opacity-50" : ""} `}
                            onPress={()=>handleSlotPress(slot)}
                            disabled={
                                selectedSlot == slot || selectedSlot == null ? false : true
                            }
                           
                        >
                            <Text className="text-white font-bold" >
                                {slot}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <Modal visible={modalVisible} transparent={true} animationType='slide'
            style={{flex:1, justifyContent:"flex-end", margin:0, borderTopLeftRadius:20, borderTopRightRadius:20}}
            >
                <View className="flex-1 bg-[#00000080] justify-end"> 
                <View className="bg-[#474747] m-4 rounded-t-lg p-4 pb-6" >
                    {formVisible &&  (<Formik
                            initialValues={{ fullName: "", phoneNumber: "" }}
                            validationSchema={validationSchema}
                            onSubmit={handleFormSubmit}
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
                                    <View>
                                        <Ionicons name= "close-sharp" size={30} color={"#f4b933"} onPress={handleCloseModel}/>
                                    </View>
                                    <Text className='text-[#f49b33] mt-4 mb-2'>Name</Text>
                                    <TextInput
                                        className='h-10 border border-white text-white rounded px-2'
                                        onChangeText={handleChange("fullName")}
                                        value={values.fullName}
                                        onBlur={handleBlur("fullName")}
                                    />
                                    {
                                        touched.fullName
                                        &&
                                        errors.fullName
                                        &&
                                        (
                                            <Text className='text-red-500 text-xs mb-2'>{errors.fullName}</Text>
                                        )}

                                    <Text className='text-[#f49b33] mt-4 mb-2'>Phone Number</Text>
                                    <TextInput
                                        className='h-10 border border-white text-white rounded px-2'
                                        onChangeText={handleChange("phoneNumber")}
                                        value={values.phoneNumber}
                                        onBlur={handleBlur("phoneNumber")}
                                    />
                                    {
                                        touched.phoneNumber
                                        &&
                                        errors.phoneNumber
                                        &&
                                        (
                                            <Text className='text-red-500 text-xs mb-2'>{errors.phoneNumber}</Text>
                                        )}
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10">
                                        <Text className="text-lg font-semibold text-center">Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </Formik>) } 
                </View>    
                </View>
                     
            </Modal>
        </View>
    )
}

export default FindSlots