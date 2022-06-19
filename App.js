import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import * as Location from "expo-location";
import Loading from "./Loading";
import Weather from "./Weather";
import axios from "axios";

const API_KEY = "4e7b62fab390c336faeab068d3a391dd";

export default class extends React.Component {
   state = {
      isLoading: true,
   };

   getWeather = async (latitude, longitude) => {
      const {
         data: {
            main: { temp },
            weather,
         },
      } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);

      this.setState({ isLoading: false, temp: temp, condition: weather[0].main });
      console.log(weather);
   };

   getLocation = async () => {
      try {
         await Location.requestForegroundPermissionsAsync();
         const {
            coords: { latitude, longitude },
         } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
            maximumAge: 10000,
            timeout: 5000,
         });

         this.getWeather(latitude, longitude);

         // сделать запрос к апи
      } catch (error) {
         await Alert.alert("Не могу определить местоположение");
      }
   };

   componentDidMount() {
      this.getLocation();
   }

   render() {
      const { isLoading, temp, condition } = this.state;
      return isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition} />;
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 0,
   },
});
