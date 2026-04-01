import React, { useEffect, useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import AwareView from "@components/AwareView";
import HeaderBackButton from "@components/Header/HeaderBackButton";
import useGroup from "@hooks/useGroup";
import type { Group } from "@services/api/group/types";
import { HOME_SCREENS } from "@utils/screens";
import type { HomeStackParams } from "@navigation/stacks/HomeStack";

type NavigationProp = NativeStackNavigationProp<HomeStackParams>;

const AllGroupsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { getGroups, getOwnGroups, isLoading, error } = useGroup();

  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [suggestedGroups, setSuggestedGroups] = useState<Group[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "suggested">("all");

  const fetchData = useCallback(async () => {
    try {
      const [groups, ownGroups] = await Promise.all([
        getGroups(),
        getOwnGroups(),
      ]);
      setAllGroups(groups);
      const ownGroupIds = new Set(ownGroups.lists.map((g) => g.id));
      setSuggestedGroups(groups.filter((g) => !ownGroupIds.has(g.id)));
    } catch {
      // Pesan error ditampilkan via state `error` dari useGroup
    }
  }, [getGroups, getOwnGroups]);

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

  const displayGroups = activeTab === "all" ? allGroups : suggestedGroups;

  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      onPress={() => handleGroupPress(item.id)}
      className="bg-white border border-heyhao-border rounded-2xl p-4 mb-3 active:bg-heyhao-grey">
      <View className="flex-row items-center">
        <View className="w-16 h-16 rounded-xl mr-3 bg-heyhao-grey/50">
          <Image
            source={{ uri: item.photo_url }}
            className="w-16 h-16 rounded-xl"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1">
          <Text className="text-heyhao-black font-bold text-base" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-heyhao-secondary text-xs mt-1" numberOfLines={2}>
            {item.about}
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="flex-row items-center mr-4">
              <Icon name="people" size={14} color="#6a7686" />
              <Text className="text-heyhao-secondary text-xs ml-1">
                {item.room?._count?.members || 0} anggota
              </Text>
            </View>
            <View className={`px-2 py-1 rounded-full ${item.type === "PAID" ? "bg-heyhao-orange/10" : "bg-heyhao-green/10"}`}>
              <Text className={`text-xs font-semibold ${item.type === "PAID" ? "text-heyhao-orange" : "text-heyhao-green"}`}>
                {item.type}
              </Text>
            </View>
          </View>
        </View>
        <Icon name="chevron-right" size={24} color="#6a7686" />
      </View>
    </TouchableOpacity>
  );

  return (
    <AwareView backgroundColor="bg-white">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="px-4 pt-6 pb-4 border-b border-heyhao-border">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <HeaderBackButton />
              <Text className="text-2xl font-black text-heyhao-black ml-2">Grup</Text>
            </View>
            <TouchableOpacity className="bg-heyhao-blue rounded-full p-2">
              <Icon name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Tab Selector */}
          <View className="flex-row bg-heyhao-grey rounded-xl p-1">
            <TouchableOpacity
              onPress={() => setActiveTab("all")}
              className={`flex-1 py-2 rounded-lg ${activeTab === "all" ? "bg-white" : ""}`}>
              <Text className={`text-center font-semibold text-sm ${activeTab === "all" ? "text-heyhao-blue" : "text-heyhao-secondary"}`}>
                Semua ({allGroups.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("suggested")}
              className={`flex-1 py-2 rounded-lg ${activeTab === "suggested" ? "bg-white" : ""}`}>
              <Text className={`text-center font-semibold text-sm ${activeTab === "suggested" ? "text-heyhao-blue" : "text-heyhao-secondary"}`}>
                Saran ({suggestedGroups.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error dari backend */}
        {error && (
          <View className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex-row items-start">
            <Icon name="error-outline" size={20} color="#ef4444" />
            <Text className="text-red-600 text-sm ml-2 flex-1">{error}</Text>
          </View>
        )}

        {/* Daftar Grup */}
        {isLoading && displayGroups.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#165dff" />
          </View>
        ) : displayGroups.length > 0 ? (
          <FlatList
            data={displayGroups}
            keyExtractor={(item) => item.id}
            renderItem={renderGroupItem}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#165dff" />
            }
          />
        ) : (
          <View className="flex-1 items-center justify-center px-4">
            <Icon name="groups" size={64} color="#d1d5db" />
            <Text className="text-heyhao-black font-bold text-lg mt-4">
              {activeTab === "all" ? "Belum Ada Grup" : "Tidak Ada Saran"}
            </Text>
            <Text className="text-heyhao-secondary text-center mt-2">
              {activeTab === "all"
                ? "Belum ada grup yang tersedia saat ini"
                : "Semua grup yang tersedia sudah kamu ikuti"}
            </Text>
          </View>
        )}
      </View>
    </AwareView>
  );
};

export default AllGroupsScreen;
