import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { Asset } from "react-native-image-picker";

import AwareView from "@components/AwareView";
import Button from "@components/Button";
import TextInput from "@components/TextInput";
import CurrencyInput from "@components/CurrencyInput";
import HeaderBackButton from "@components/Header/HeaderBackButton";
import useGroup from "@hooks/useGroup";
import { photoUploader } from "@services/media/photoUploader";
import apiClient from "@services/api/client/apiClient";

const ManageGroupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as { groupId?: string; initialData?: any } | undefined;
  const groupId = params?.groupId;
  const initialData = params?.initialData;

  const {
    createFreeGroup,
    updateFreeGroup,
    createPaidGroup,
    updatePaidGroup,
    isLoading
  } = useGroup();

  const [type, setType] = useState<"FREE" | "PAID">(initialData?.type || "FREE");
  const [name, setName] = useState(initialData?.name || "");
  const [about, setAbout] = useState(initialData?.about || "");
  const [photo, setPhoto] = useState<Asset | null>(null);

  // Paid fields
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [benefit, setBenefit] = useState(initialData?.benefit?.join(", ") || "");
  const [assets, setAssets] = useState<Asset[]>([]);

  const isEdit = !!groupId;

  useEffect(() => {
    if (isEdit && !initialData) {
      const fetchGroup = async () => {
        try {
          const data = await apiClient.group.getGroupById(groupId!);
          setType(data.type);
          setName(data.name);
          setAbout(data.about);
          setPrice(data.price?.toString() || "");
          setBenefit(data.benefit?.join(", ") || "");
        } catch (err) {
          Alert.alert("Error", "Gagal memuat data grup");
          navigation.goBack();
        }
      };
      fetchGroup();
    }
  }, [groupId, isEdit, initialData]);

  const handleSelectPhoto = async () => {
    try {
      const selected = await photoUploader.selectFromGallery();
      if (selected) {
        setPhoto(selected);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Gagal memilih foto");
    }
  };

  const handleAddAsset = async () => {
    try {
      const selected = await photoUploader.selectFromGallery({ mediaType: "mixed" });
      if (selected) {
        setAssets([...assets, selected]);
      }
    } catch (err: any) {
      Alert.alert("Error", "Gagal menambah aset");
    }
  };

  const removeAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const handleCreateGroup = async () => {
    if (!photo && !isEdit) {
      Alert.alert("Peringatan", "Foto grup wajib diisi");
      return;
    }

    try {
      if (type === "FREE") {
        if (isEdit) {
          await updateFreeGroup(groupId!, { name, about, photo });
        } else {
          await createFreeGroup({ name, about, photo: photo! });
        }
      } else {
        const benefitList = benefit.split(",").map((b: string) => b.trim()).filter((b: string) => b !== "");
        if (benefitList.length === 0) {
          Alert.alert("Peringatan", "Keuntungan (benefit) wajib diisi untuk grup berbayar");
          return;
        }

        if (isEdit) {
          await updatePaidGroup(groupId!, {
            name,
            about,
            photo,
            price,
            benefit: benefitList,
            assets
          });
        } else {
          if (assets.length === 0) {
            Alert.alert("Peringatan", "Aset minimal 1 file wajib diunggah untuk grup berbayar");
            return;
          }
          await createPaidGroup({
            name,
            about,
            photo: photo!,
            price,
            benefit: benefitList,
            assets
          });
        }
      }

      Alert.alert("Sukses", `Grup berhasil ${isEdit ? "diperbarui" : "dibuat"}!`);
      // navigate to my group screen
      navigation.navigate("MY_GROUPS" as never);
    } catch (err: any) {
      // Error sudah ditangani di hook/parsed
      Alert.alert(`Gagal ${isEdit ? "Memperbarui" : "Membuat"} Grup`, err.message || "Terjadi kesalahan");
    }
  };

  return (
    <AwareView backgroundColor="bg-white">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="px-4 pt-4 pb-4 border-b border-heyhao-border flex-row items-center">
          <HeaderBackButton />
          <Text className="text-2xl font-black text-heyhao-black ml-2">
            {isEdit ? "Edit Grup" : "Buat Grup"}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="p-6">
            {/* Type Selector - Hidden on Edit */}
            {!isEdit && (
              <View className="flex-row bg-heyhao-grey rounded-2xl p-1 mb-8">
                <TouchableOpacity
                  onPress={() => setType("FREE")}
                  className={`flex-1 py-3 rounded-xl items-center ${type === "FREE" ? "bg-white shadow-sm" : ""}`}
                >
                  <Text className={`font-bold ${type === "FREE" ? "text-heyhao-blue" : "text-heyhao-secondary"}`}>Gratis</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setType("PAID")}
                  className={`flex-1 py-3 rounded-xl items-center ${type === "PAID" ? "bg-white shadow-sm" : ""}`}
                >
                  <Text className={`font-bold ${type === "PAID" ? "text-heyhao-orange" : "text-heyhao-secondary"}`}>Berbayar (VIP)</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Photo Selection */}
            <View className="items-center mb-8">
              <TouchableOpacity
                onPress={handleSelectPhoto}
                className="w-32 h-32 rounded-3xl bg-heyhao-grey items-center justify-center border-2 border-dashed border-heyhao-border"
              >
                {photo ? (
                  <Image source={{ uri: photo.uri }} className="w-full h-full rounded-3xl" />
                ) : (
                  <>
                    <Icon name="add-a-photo" size={32} color="#6a7686" />
                    <Text className="text-heyhao-secondary text-[10px] mt-2 font-bold">Foto Grup</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Basic Info */}
            <View className="gap-5 mb-8">
              <View>
                <Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Nama Grup</Text>
                <TextInput
                  onChangeText={setName}
                  value={name}
                  placeholder="Contoh: Belajar React Native"
                  backgroundColor="bg-heyhao-grey"
                  inputStyle="h-14 rounded-2xl px-4"
                  editable={!isLoading}
                />
              </View>

              <View>
                <Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Deskripsi</Text>
                <TextInput
                  onChangeText={setAbout}
                  value={about}
                  placeholder="Jelaskan tentang apa grup ini..."
                  backgroundColor="bg-heyhao-grey"
                  multiline
                  textAlignVertical="top"
                  numberOfLines={4}
                  inputStyle="h-32 rounded-2xl px-4 pt-4"
                  editable={!isLoading}
                />
              </View>

              {/* Paid Only Fields */}
              {type === "PAID" && (
                <View className="space-y-5">
                  <View>
                    <Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Harga (Rupiah)</Text>
                    <CurrencyInput
                      onChangeRaw={setPrice}
                      value={price}
                      placeholder="Contoh: 50.000"
                      backgroundColor="bg-heyhao-grey"
                      borderColor="border-transparent"
                      inputStyle="h-14 rounded-2xl px-4"
                      editable={!isLoading}
                    />
                  </View>

                  <View>
                    <Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Benefit (Pisahkan dengan koma)</Text>
                    <TextInput
                      onChangeText={setBenefit}
                      value={benefit}
                      placeholder="Materi Eksklusif, Live Q&A, Networking..."
                      backgroundColor="bg-heyhao-grey"
                      multiline
                      inputStyle="h-24 rounded-2xl px-4 pt-4"
                      editable={!isLoading}
                    />
                  </View>

                  <View>
                    <View className="flex-row items-center justify-between mb-2 ml-1">
                      <Text className="text-heyhao-black font-bold text-sm">Aset Grup (File/Digital)</Text>
                      <TouchableOpacity onPress={handleAddAsset}>
                        <Text className="text-heyhao-blue text-xs font-bold">+ Tambah</Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap gap-2">
                      {assets.map((asset, index) => (
                        <View key={index} className="bg-heyhao-blue/10 px-3 py-2 rounded-xl flex-row items-center border border-heyhao-blue/20">
                          <Icon name="insert-drive-file" size={14} color="#165dff" />
                          <Text className="text-heyhao-blue text-xs font-medium mx-2" numberOfLines={1} style={{ maxWidth: 100 }}>
                            {asset.fileName || "File"}
                          </Text>
                          <TouchableOpacity onPress={() => removeAsset(index)}>
                            <Icon name="close" size={14} color="#6a7686" />
                          </TouchableOpacity>
                        </View>
                      ))}
                      {assets.length === 0 && (
                        <Text className="text-heyhao-secondary text-xs italic ml-1">Belum ada aset ditambahkan</Text>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Submit Button */}
            <Button
              onPress={handleCreateGroup}
              label={isLoading ? "Memproses..." : `${isEdit ? "Update" : "Buat"} Grup ${type === "PAID" ? "VIP" : "Gratis"}`}
              buttonBackground={type === "PAID" ? "bg-heyhao-orange" : "bg-heyhao-blue"}
              borderRadius="rounded-2xl"
              buttonHeight="h-14"
              isDisabled={!name || !about || (!photo && !isEdit) || isLoading}
            />

            <View className="mt-8 p-4 bg-heyhao-grey rounded-2xl flex-row items-start">
              <Icon name="info" size={20} color="#6a7686" />
              <Text className="text-heyhao-secondary text-xs ml-3 flex-1 leading-relaxed">
                Grup VIP memungkinkan Anda menjual konten eksklusif. Pastikan aset yang diunggah valid dan bermanfaat bagi anggota.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </AwareView>
  );
};

export default ManageGroupScreen;
