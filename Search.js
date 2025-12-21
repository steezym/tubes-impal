import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import SearchIcon from './assets/icons/searchIcon.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ').filter(Boolean);
  const first = parts[0]?.charAt(0).toUpperCase() || '';
  const second = parts[1]?.charAt(0).toUpperCase() || '';
  return (first + second).slice(0, 2);
};

export default function Search() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);

  const API_URL = 'http://10.0.2.2:4000'; // Ubah sesuai dengan IPv4 di ipconfig cmd

    // get user from async storage
  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await AsyncStorage.getItem('user');
        if (data) setUser(JSON.parse(data));
      } catch (e) {
        console.log('getUser error', e);
      }
    };
    getUser();
  }, []);
  
  const getQuery = async(query) => {
    try{
      const res = await axios.get(`${API_URL}/search`,{
        params: {query},
      });
      setResult(res.data.data)
    } catch (err){
      console.log(err);
    }
  }



  const renderUser = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (!user?.id) return;
        navigation.navigate("Profile", {
          me: user.id,
          other: item.user_id,
          otherName: item.name,
        })
      }}
    >
      <View style={styles.card}>
        <View style={[styles.avatar, { backgroundColor: '#87A347' }]}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.content}>
      <View style={styles.searchabar}>
        <TextInput
        placeholder="Cari"
        placeholderTextColor={'#949494ff'}
        onChangeText={query => {
          setQuery(query);
        }} style={styles.input}
        />
        <TouchableOpacity 
          style={styles.iconWrapper}
          onPress={() => getQuery(query)}
        >
          <SearchIcon/>
        </TouchableOpacity>
      </View>
      <FlatList 
        data={result}
        renderItem={renderUser}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content:{
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  header:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input:{
    width: '95%',
    color: '#000000ff',
  },
  iconWrapper: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -9 }],
  },
  searchabar:{
    width: '100%',
    height: 50,
    backgroundColor: '#ffffffff',
    borderWidth: 1,
    borderColor: '#424242ff', 
    color: '#000000ff',
    fontSize: 14,
    fontFamily: 'Inter_Medium',
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 2,
    paddingVertical: 10,
    borderColor: "#b1b1b1ff",
    borderBottomWidth: .3,
  },
  avatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 8 
  },
  avatarText: { 
    color: '#fff', 
    fontWeight: '700' 
  },
}

)