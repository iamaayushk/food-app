import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from "@react-native-community/datetimepicker"
// import { s } from 'framer-motion/client';

const DatePickerComponent = ({date,setDate}) => {
    const [show, setShow] = useState(false);
    const handlePress=()=>{
        setShow(true)
}
    const onChange=(event, selectedDate)=>{
        const currentDate = selectedDate || date;
        setShow(false)
        setDate(currentDate)
}
  return (
    <View className="flex flex-row">
        <TouchableOpacity 
        onPress={handlePress}
        className={`rounded-lg text-white text-base ${Platform.OS==="android"&& "px-2 py-1 justify-center bg-[#474747]"}`} >
            {Platform.OS==="android" && <Text className="px-2 py-2 bg-[#474747] text-white">{date.toLocaleDateString()}</Text>}
            {Platform.OS==="android" && show && (
    <DateTimePicker 
        textColor='#f49b33' 
        accentColor='#f49b33' 
        value={date} 
        mode='date' 
        onChange={onChange}
        display='default' 
        minimumDate={new Date()} 
        maximumDate={new Date(new Date().setDate(new Date().getDate()+7))}
         />
            )}
            {
                Platform.OS==="ios" && (

                    <DateTimePicker 
        textColor='#f49b33' 
        accentColor='#f49b33' 
        value={date} 
        mode='date' 
        onChange={onChange}
        display='default' 
        minimumDate={new Date()} 
        maximumDate={new Date(new Date().setDate(new Date().getDate()+7))}
         />
            )}
        </TouchableOpacity>
    </View>
  )
}

export default DatePickerComponent