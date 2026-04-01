import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";

import AwareView from "@components/AwareView";
import HeaderBackButton from "@components/Header/HeaderBackButton";
import useGroup from "@hooks/useGroup";
import type { GroupDetail } from "@services/api/group/types";

const GroupDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params as { groupId: string };
  const { getGroupById, isLoading, error } = useGroup();

  const [group, setGroup] = useState<GroupDetail | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetch = async () => {
      try {
        const data = await getGroupById(groupId);
        if (isMounted) setGroup(data);
      } catch {
        // Pesan error ditampilkan via state `error` dari useGroup
      }
    };

    fetch();
    return () => { isMounted = false; };
  }, [groupId, getGroupById]);

  const handleJoinGroup = () => {
    // TODO: Implementasi join group
    console.log("Join group:", groupId);
  };

  // Loading state
  if (isLoading && !group) {
    return (
      <AwareView backgroundColor="bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#165dff" />
        </View>
      </AwareView>
    );
  }

  // Error state (gagal fetch dan tidak ada data)
  if (error && !group) {
    return (
      <AwareView backgroundColor="bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Icon name="error-outline" size={64} color="#d1d5db" />
          <Text className="text-heyhao-black font-bold text-lg mt-4 text-center">
            Gagal Memuat Grup
          </Text>
          <Text className="text-heyhao-secondary text-center mt-2">{error}</Text>
        </View>
      </AwareView>
    );
  }

  if (!group) return null;

  return (
    <AwareView backgroundColor="bg-white">
      <View className="flex-1 bg-white">
        {/* Hero Image */}
        <View className="relative">
          <Image source={{ uri: group.photo_url }} className="w-full h-64" resizeMode="cover" />
          <View className="absolute inset-0 bg-black/30" />

          {/* Tombol kembali */}
          <View className="absolute top-12 left-2 bg-white/90 rounded-full">
            <HeaderBackButton />
          </View>

          {/* Badge tipe grup */}
          <View className="absolute top-12 right-4">
            <View className={`px-3 py-1.5 rounded-full ${group.type === "PAID" ? "bg-heyhao-orange" : "bg-heyhao-green"}`}>
              <Text className="text-white text-xs font-bold">{group.type}</Text>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="px-4 py-6">
            {/* Nama & info dasar */}
            <Text className="text-2xl font-black text-heyhao-black mb-2">{group.name}</Text>
            <View className="flex-row items-center mb-4">
              <Icon name="people" size={18} color="#6a7686" />
              <Text className="text-heyhao-secondary text-sm ml-2">
                {group.room._count.members} anggota
              </Text>
              <View className="w-1 h-1 rounded-full bg-heyhao-secondary mx-3" />
              <Icon name="calendar-today" size={16} color="#6a7686" />
              <Text className="text-heyhao-secondary text-sm ml-2">
                {new Date(group.created_at).toLocaleDateString("id-ID")}
              </Text>
            </View>

            {/* Deskripsi */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-heyhao-black mb-2">Tentang</Text>
              <Text className="text-heyhao-secondary leading-6">{group.about}</Text>
            </View>

            {/* Keuntungan (khusus grup berbayar) */}
            {group.benefit && group.benefit.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-heyhao-black mb-3">Keuntungan</Text>
                {group.benefit.map((item, index) => (
                  <View key={index} className="flex-row items-start mb-3">
                    <View className="bg-heyhao-blue/10 rounded-full p-1 mr-3 mt-0.5">
                      <Icon name="check" size={16} color="#165dff" />
                    </View>
                    <Text className="flex-1 text-heyhao-secondary leading-6">{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Harga (khusus grup berbayar) */}
            {group.type === "PAID" && (
              <View className="bg-heyhao-grey rounded-2xl p-4 mb-6">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-heyhao-secondary text-sm mb-1">Harga Keanggotaan</Text>
                    <Text className="text-2xl font-black text-heyhao-black">
                      Rp {group.price.toLocaleString("id-ID")}
                    </Text>
                  </View>
                  <Icon name="payments" size={32} color="#165dff" />
                </View>
              </View>
            )}

            {/* Preview anggota */}
            {group.room.members && group.room.members.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-heyhao-black mb-3">Anggota</Text>
                <View className="flex-row items-center">
                  <View className="flex-row">
                    {group.room.members.slice(0, 5).map((member: any, index: number) => (
                      <View
                        key={index}
                        className="w-10 h-10 rounded-full bg-heyhao-blue items-center justify-center border-2 border-white"
                        style={{ marginLeft: index > 0 ? -12 : 0 }}>
                        <Text className="text-white font-bold text-sm">
                          {member.user?.name?.charAt(0) || "?"}
                        </Text>
                      </View>
                    ))}
                  </View>
                  {group.room._count.members > 5 && (
                    <Text className="text-heyhao-secondary text-sm ml-3">
                      +{group.room._count.members - 5} lainnya
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* CTA Join / Already Joined */}
        <View className="px-4 py-4 border-t border-heyhao-border bg-white">
          {group.is_join ? (
            <View className="bg-heyhao-green/10 rounded-2xl py-4 items-center flex-row justify-center">
              <Icon name="check-circle" size={20} color="#30b22d" />
              <Text className="text-heyhao-green font-bold text-base ml-2">Sudah Bergabung</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleJoinGroup}
              className="bg-heyhao-blue rounded-2xl py-4 items-center active:bg-heyhao-blue/90">
              <Text className="text-white font-bold text-base">
                {group.type === "PAID"
                  ? `Bergabung — Rp ${group.price.toLocaleString("id-ID")}`
                  : "Bergabung Sekarang"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </AwareView>
  );
};

export default GroupDetailScreen;
