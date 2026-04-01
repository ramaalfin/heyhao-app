import React, { useEffect, useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import AwareView from "@components/AwareView";
import useGroup from "@hooks/useGroup";
import type { Group, Person } from "@services/api/group/types";
import { HOME_SCREENS } from "@utils/screens";
import type { HomeStackParams } from "@navigation/stacks/HomeStack";

type NavigationProp = NativeStackNavigationProp<HomeStackParams>;

// Kategori statis — bisa dijadikan API endpoint nanti
const CATEGORIES = [
  { id: "1", name: "Programmer", icon: "code" },
  { id: "2", name: "Design", icon: "brush" },
  { id: "3", name: "Marketing", icon: "trending-up" },
  { id: "4", name: "Business", icon: "business" },
];

const DiscoverScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { getGroups, getPeoples, isLoading, error } = useGroup();

  const [tab, setTab] = useState<"GROUP" | "PEOPLE">("GROUP");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [peoples, setPeoples] = useState<Person[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [groupsData, peoplesData] = await Promise.all([
        getGroups(),
        getPeoples(),
      ]);
      setGroups(groupsData);
      setPeoples(peoplesData);
    } catch {
      // Pesan error ditampilkan via state `error` dari useGroup
    }
  }, [getGroups, getPeoples]);

  useEffect(() => {
    let isMounted = true;
    fetchData().then(() => {
      if (!isMounted) return;
    });
    return () => { isMounted = false; };
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleGroupPress = (groupId: string) => {
    navigation.navigate(HOME_SCREENS.GROUP_DETAIL_SCREEN, { groupId });
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPeoples = peoples.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AwareView backgroundColor="bg-white">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="px-4 pt-6 pb-4 border-b border-heyhao-border">
          <Text className="text-2xl font-black text-heyhao-black mb-4">Jelajahi 🚀</Text>

          {/* Search Bar */}
          <View className="bg-heyhao-grey rounded-full px-4 py-3 flex-row items-center mb-4">
            <Icon name="search" size={20} color="#6a7686" />
            <TextInput
              placeholder="Cari grup atau pengguna..."
              value={search}
              onChangeText={setSearch}
              className="flex-1 ml-2 text-heyhao-black"
              placeholderTextColor="#6a7686"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Icon name="close" size={20} color="#6a7686" />
              </TouchableOpacity>
            )}
          </View>

          {/* Kategori */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
                  selectedCategory === cat.id
                    ? "bg-heyhao-blue border-heyhao-blue"
                    : "bg-white border-heyhao-border"
                }`}>
                <Icon
                  name={cat.icon}
                  size={16}
                  color={selectedCategory === cat.id ? "white" : "#165dff"}
                />
                <Text
                  className={`ml-2 text-xs font-bold ${
                    selectedCategory === cat.id ? "text-white" : "text-heyhao-blue"
                  }`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Group / People */}
        <View className="flex-row p-4 gap-2">
          <TouchableOpacity
            onPress={() => setTab("GROUP")}
            className={`flex-1 py-3 items-center rounded-xl border ${
              tab === "GROUP" ? "bg-heyhao-blue border-heyhao-blue" : "bg-white border-heyhao-border"
            }`}>
            <Text className={`font-bold text-sm ${tab === "GROUP" ? "text-white" : "text-heyhao-secondary"}`}>
              Grup ({filteredGroups.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("PEOPLE")}
            className={`flex-1 py-3 items-center rounded-xl border ${
              tab === "PEOPLE" ? "bg-heyhao-blue border-heyhao-blue" : "bg-white border-heyhao-border"
            }`}>
            <Text className={`font-bold text-sm ${tab === "PEOPLE" ? "text-white" : "text-heyhao-secondary"}`}>
              Pengguna ({filteredPeoples.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error dari backend */}
        {error && (
          <View className="mx-4 mb-2 bg-red-50 border border-red-200 rounded-2xl p-4 flex-row items-start">
            <Icon name="error-outline" size={20} color="#ef4444" />
            <Text className="text-red-600 text-sm ml-2 flex-1">{error}</Text>
          </View>
        )}

        {/* Konten */}
        {isLoading && groups.length === 0 && peoples.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#165dff" />
          </View>
        ) : (
          <View className="flex-1">
            {tab === "GROUP" ? (
              filteredGroups.length > 0 ? (
                <FlatList
                  data={filteredGroups}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleGroupPress(item.id)}
                      className="bg-white border border-heyhao-border rounded-2xl overflow-hidden mx-4 mb-4 active:bg-heyhao-grey">
                      <Image source={{ uri: item.photo_url }} className="w-full h-40" resizeMode="cover" />
                      <View className="p-4">
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className="text-heyhao-black font-bold text-base flex-1" numberOfLines={1}>
                            {item.name}
                          </Text>
                          <View className={`px-2 py-1 rounded-full ml-2 ${item.type === "PAID" ? "bg-heyhao-orange/10" : "bg-heyhao-green/10"}`}>
                            <Text className={`text-xs font-semibold ${item.type === "PAID" ? "text-heyhao-orange" : "text-heyhao-green"}`}>
                              {item.type}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-heyhao-secondary text-xs mb-3" numberOfLines={2}>
                          {item.about}
                        </Text>
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <Icon name="people" size={16} color="#6a7686" />
                            <Text className="text-heyhao-secondary text-xs ml-1">
                              {item.room?._count?.members || 0} anggota
                            </Text>
                          </View>
                          <TouchableOpacity className="bg-heyhao-blue rounded-full px-4 py-2">
                            <Text className="text-white text-xs font-bold">Lihat</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={{ paddingTop: 4, paddingBottom: 16 }}
                  showsVerticalScrollIndicator={false}
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#165dff" />}
                />
              ) : (
                <View className="flex-1 items-center justify-center px-4">
                  <Icon name="search-off" size={64} color="#d1d5db" />
                  <Text className="text-heyhao-black font-bold text-lg mt-4">Grup Tidak Ditemukan</Text>
                  <Text className="text-heyhao-secondary text-center mt-2">
                    {search ? `Tidak ada grup yang cocok dengan "${search}"` : "Belum ada grup yang tersedia"}
                  </Text>
                </View>
              )
            ) : filteredPeoples.length > 0 ? (
              <FlatList
                data={filteredPeoples}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity className="bg-white border border-heyhao-border rounded-2xl p-4 mx-4 mb-3 flex-row items-center active:bg-heyhao-grey">
                    <View className="w-14 h-14 rounded-full bg-heyhao-blue items-center justify-center mr-3">
                      {item.photo_url ? (
                        <Image
                          source={{ uri: item.photo_url }}
                          className="w-14 h-14 rounded-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <Text className="text-white font-bold text-xl">
                          {item.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-heyhao-black font-bold text-base" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-heyhao-secondary text-xs mt-1">
                        Bergabung {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </Text>
                    </View>
                    <TouchableOpacity className="bg-heyhao-blue rounded-full p-2">
                      <Icon name="person-add" size={20} color="white" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingTop: 4, paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#165dff" />}
              />
            ) : (
              <View className="flex-1 items-center justify-center px-4">
                <Icon name="person-search" size={64} color="#d1d5db" />
                <Text className="text-heyhao-black font-bold text-lg mt-4">Pengguna Tidak Ditemukan</Text>
                <Text className="text-heyhao-secondary text-center mt-2">
                  {search ? `Tidak ada pengguna yang cocok dengan "${search}"` : "Belum ada pengguna yang tersedia"}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </AwareView>
  );
};

export default DiscoverScreen;
