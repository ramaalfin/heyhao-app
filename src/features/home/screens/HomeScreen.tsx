import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Avatar from "@components/Avatar";
import AwareView from "@components/AwareView";
import useGroup from "@hooks/useGroup";
import useAuth from "@hooks/useAuth";
import type { Group, OwnGroupResponse } from "@services/api/group/types";
import { HOME_SCREENS } from "@utils/screens";
import type { HomeStackParams } from "@navigation/stacks/HomeStack";

type NavigationProp = NativeStackNavigationProp<HomeStackParams>;

const HomeScreen = () => {
	const navigation = useNavigation<NavigationProp>();
	const { user } = useAuth();
	const { getOwnGroups, getGroups, isLoading, error } = useGroup();

	const [ownGroups, setOwnGroups] = useState<OwnGroupResponse | null>(null);
	const [discoverGroups, setDiscoverGroups] = useState<Group[]>([]);
	const [suggestedGroups, setSuggestedGroups] = useState<Group[]>([]);

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			try {
				const [own, discover] = await Promise.all([
					getOwnGroups(),
					getGroups(),
				]);

				if (!isMounted) return;

				setOwnGroups(own);
				setDiscoverGroups(discover);

				// Filter group yang belum diikuti user
				const ownGroupIds = new Set(own.lists.map(g => g.id));
				setSuggestedGroups(discover.filter(g => !ownGroupIds.has(g.id)));
			} catch {
				// Pesan error sudah disimpan di state `error` oleh useGroup
			}
		};

		fetchData();

		return () => { isMounted = false; };
	}, [getOwnGroups, getGroups]);

	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				className="w-full h-full bg-white">
				{/* Header */}
				<View className="px-4 pt-6 pb-6 flex-row items-center justify-between border-b border-heyhao-border">
					<View className="flex-row items-center">
						<Avatar username={user?.name || "User"} size={40} />
						<View className="ml-3">
							<Text className="text-xl font-black text-heyhao-black">Hey, {user?.name?.split(" ")[0] || "User"} 👋</Text>
							<Text className="text-xs text-heyhao-secondary font-medium">Community Hub</Text>
						</View>
					</View>
					<TouchableOpacity className="bg-heyhao-grey p-3 rounded-full">
						<Icon name="notifications-none" size={24} color="#165dff" />
					</TouchableOpacity>
				</View>

				{/* Tampilkan error dari backend jika ada */}
				{error && (
					<View className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex-row items-start">
						<Icon name="error-outline" size={20} color="#ef4444" />
						<Text className="text-red-600 text-sm ml-2 flex-1">{error}</Text>
					</View>
				)}

				{/* Quick Stats */}
				<View className="px-4 py-6 flex-row justify-between">
					<View className="flex-1 bg-heyhao-blue/10 rounded-2xl p-4 mr-3 items-center">
						<Icon name="groups" size={28} color="#165dff" />
						<Text className="text-heyhao-black font-bold text-lg mt-2">{ownGroups?.lists.length || 0}</Text>
						<Text className="text-heyhao-secondary text-xs font-medium">Groups</Text>
					</View>
					<View className="flex-1 bg-heyhao-green/10 rounded-2xl p-4 mr-3 items-center">
						<Icon name="people" size={28} color="#30b22d" />
						<Text className="text-heyhao-black font-bold text-lg mt-2">{ownGroups?.total_members || 0}</Text>
						<Text className="text-heyhao-secondary text-xs font-medium">Connections</Text>
					</View>
					<View className="flex-1 bg-heyhao-orange/10 rounded-2xl p-4 items-center">
						<Icon name="chat" size={28} color="#f97316" />
						<Text className="text-heyhao-black font-bold text-lg mt-2">0</Text>
						<Text className="text-heyhao-secondary text-xs font-medium">Unread</Text>
					</View>
				</View>

				{/* Recent Groups */}
				<View className="px-4 py-4">
					<View className="flex-row items-center justify-between mb-4">
						<Text className="text-lg font-bold text-heyhao-black">Your Groups</Text>
						<TouchableOpacity onPress={() => navigation.navigate(HOME_SCREENS.ALL_GROUPS_SCREEN)}>
							<Text className="text-heyhao-blue font-semibold text-sm">See All Groups</Text>
						</TouchableOpacity>
					</View>

					{isLoading && !ownGroups ? (
						<ActivityIndicator size="large" color="#165dff" className="my-8" />
					) : ownGroups?.lists && ownGroups.lists.length > 0 ? (
						<FlatList
							data={ownGroups.lists.slice(0, 3)}
							keyExtractor={(item) => item.id}
							scrollEnabled={false}
							renderItem={({ item }) => (
								<TouchableOpacity 
									onPress={() => navigation.navigate(HOME_SCREENS.GROUP_DETAIL_SCREEN, { groupId: item.id })}
									className="bg-white border border-heyhao-border rounded-2xl p-3 mb-3 flex-row items-center active:bg-heyhao-grey"
								>
									<View className="w-14 h-14 rounded-xl mr-3 bg-heyhao-grey/50">
										<Image
											source={{ uri: item.photo_url }}
											className="w-14 h-14 rounded-xl"
											resizeMode="cover"
										/>
									</View>
									<View className="flex-1">
										<Text className="text-heyhao-black font-bold text-sm" numberOfLines={1}>{item.name}</Text>
										<Text className="text-heyhao-secondary text-xs mt-1">{item.total_members.toLocaleString()} members • {item.type}</Text>
									</View>
									<Icon name="chevron-right" size={20} color="#6a7686" />
								</TouchableOpacity>
							)}
						/>
					) : (
						<View className="py-8 items-center bg-heyhao-grey rounded-3xl">
							<Text className="text-heyhao-secondary font-medium">You haven't joined any groups yet</Text>
						</View>
					)}
				</View>

				{/* Suggested Connections */}
				<View className="px-4 py-4">
					<Text className="text-lg font-bold text-heyhao-black mb-4">Suggested Groups</Text>

					{isLoading && suggestedGroups.length === 0 ? (
						<ActivityIndicator size="large" color="#165dff" className="my-8" />
					) : suggestedGroups.length > 0 ? (
						<FlatList
							data={suggestedGroups.slice(0, 3)}
							keyExtractor={(item) => item.id}
							scrollEnabled={false}
							renderItem={({ item }) => (
								<TouchableOpacity 
									onPress={() => navigation.navigate(HOME_SCREENS.GROUP_DETAIL_SCREEN, { groupId: item.id })}
									className="bg-heyhao-grey border border-heyhao-border rounded-2xl p-3 flex-row items-center mb-3"
								>
									<Image
										source={{ uri: item.photo_url }}
										className="w-12 h-12 rounded-full bg-white/50"
									/>
									<View className="flex-1 ml-3">
										<Text className="text-heyhao-black font-bold text-sm" numberOfLines={1}>{item.name}</Text>
										<Text className="text-heyhao-secondary text-xs mt-1">{item.type} Group • {item.room?._count?.members || 0} members</Text>
									</View>
									<TouchableOpacity className="bg-heyhao-blue rounded-full p-2">
										<Icon name="add" size={18} color="white" />
									</TouchableOpacity>
								</TouchableOpacity>
							)}
						/>
					) : (
						<View className="py-8 items-center bg-heyhao-grey rounded-3xl">
							<Text className="text-heyhao-secondary font-medium">No suggestions right now</Text>
						</View>
					)}
				</View>

				<View className="h-8" />
			</ScrollView>
		</AwareView>
	);
};

export default HomeScreen;
