import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

export default function AlertModal({ visible, onSnooze, onClose }) {
  return (
    <Modal  
    visible={visible}
  transparent
  animationType="fade"
  statusBarTranslucent={true}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Time for a break!</Text>

          <Text style={styles.desc}>
            You've been using the app for 15 minutes.
            {"\n"}Consider taking a short break.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.snoozeBtn} onPress={onSnooze}>
              <Text style={styles.snoozeText}>Snooze</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",
  alignItems: "center",
},
  box: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  desc: {
    textAlign: "center",
    color: "#555",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  snoozeBtn: {
    borderColor: "#87A347",
    borderWidth: 2,
    paddingVertical: 10,
    borderRadius: 30,
    width: "48%",
    alignItems: "center",
  },
  snoozeText: {
    color: "#87A347",
    fontWeight: "bold",
  },
  closeBtn: {
    backgroundColor: "#87A347",
    paddingVertical: 10,
    borderRadius: 30,
    width: "48%",
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
});
