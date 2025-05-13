import '../config/firebaseConfig'
import { Stack } from "expo-router";
import '../global.css'
import {app} from '../config/firebaseConfig';
// import { getApps } from 'firebase/app';
export default function RootLayout() {
  console.log("Firebase initialized: ", app.name);
  // console.log("Firebase apps initialized: ", getApps());
  console.log("Firebase app: ", app);

  return (
  <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name="index"/>
    <Stack.Screen name="(tabs)"/>
  </Stack>
  )
}
