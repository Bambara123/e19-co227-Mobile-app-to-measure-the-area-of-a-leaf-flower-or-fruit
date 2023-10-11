import React from "react";
import { useState, useEffect } from "react";

import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  ActivityIndicator,
} from "react-native";

import { db } from "../config";
import { ref, get, child } from "firebase/database";

// for pdf
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import logo_black from "../assets/images";
import qrImge1 from "../assets/qrImage";

import Screen from "./Screen";
import AppButton from "../components/AppButton";
import DetailsCard from "../components/DetailsCard";
import ImageButton from "../components/ImageButton";
import AppText from "../components/AppText";
import colors from "../config/colors";

function ReportScreen(props) {
  // for pdf

  let logoImagePath = logo_black;
  let qrImage = qrImge1;

  let report_id = "ABC-2344";
  let name = "Bamboosa aridinarifolia";
  let area = "23.45 cm ";

  let html = `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>PDF Report</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 20px;
          }
          .header {
              text-align: center;
              margin-bottom: 20px;
          }
          .logo {
              max-width: 100px;
          }
          .title {
              font-size: 20px;
              margin-bottom: 10px;
          }
          .info {
              font-size: 16px;
              margin-bottom: 10px;
          }
          .data {
              font-size: 14px;
              margin-bottom: 5px;
          }
          .qr-code {
              text-align: center;
              margin-top: 20px;
          }
          .promotion {
              font-size: 14px;
              text-align: center;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="header">
          <img src=${logoImagePath} alt="Your App Logo" class="logo">
          <h1 class="title">AgroCam</h1>
      </div>
      <div class="content">

          <p class="info">Report Information:</p>
          <p class="data"><strong>Report ID:</strong> ${report_id}</p>
          <p class="data"><strong>Name:</strong> ${name}</p>
          <p class="data"><strong>Area of Leaf:</strong> ${area}</p>
          <p class="data"><strong>Longitude:</strong> ${"53.44"}</p>
          <p class="data"><strong>Latitude:</strong> ${"78.30"}</p>
         
      </div>
      <div class="qr-code">
          <img src=${qrImage} alt="QR Code" width="100">
      </div>
      <div class="promotion">
          <p>Scan the QR code to learn more about our app!</p>
      </div>
  </body>
  </html>
  `;

  const generatePdf = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri);
  };

  const [isLoading, setIsLoading] = useState(true);

  specificId = "-NfuNe5HVzcnQOdBQ7Dw"; //  form clicked flat list item.
  // or get from the add data screen before adding

  const postsRef0 = ref(db, "data");
  const postsRef = child(postsRef0, specificId);

  const [data, setData] = useState("");

  // fetch dta from firebase
  useEffect(() => {
    get(postsRef)
      .then((snapshot) => {
        const fetchedData = snapshot.val();
        setData(fetchedData);
        console.log(fetchedData);
        setIsLoading(false);
      })

      .catch((error) => {
        console.error("Error" + error);
      });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.indicatorView}>
        <ActivityIndicator
          size="large"
          color={colors.color2}
        ></ActivityIndicator>
      </View>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.container2}>
          <ImageButton
            style={styles.imageBtn}
            image={require("../assets/back-to.png")}
            size={45}
            onPress={() => console.log("back pressed")}
          ></ImageButton>
          <View style={styles.head}>
            <AppText>Report</AppText>
          </View>
        </View>

        <View style={styles.container3}>
          <DetailsCard data={data} style={styles.detailsCard} />
          <AppButton
            style={{ marginTop: 15 }}
            title={"Share"}
            onPress={() => generatePdf()}
          ></AppButton>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  indicatorView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
    backgroundColor: colors.color,
  },

  detailsCard: {
    backgroundColor: colors.color3,
  },

  container2: {
    flexDirection: "row",
    alignItems: "center",
  },
  container3: {
    alignItems: "center",
    marginTop: 10,
    flex: 1,
  },

  imageBtn: {},

  head: {
    borderRadius: 30,
    backgroundColor: colors.colorTwo,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flex: 1,
  },
});

export default ReportScreen;
