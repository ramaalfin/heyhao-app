import React, {useEffect} from "react";
import {View} from "react-native";

import {ParamListBase} from "@react-navigation/native";
import {StackScreenProps} from "@react-navigation/stack";
import LottieView from "lottie-react-native";

import LandingAnimation from "@assets/lottie/landingAnimation.json";
import {NAVIGATOR_SIGNED_OUT_STACK} from "@utils/screens";

type Props = StackScreenProps<ParamListBase, "Landing Stack">;

const LandingScreen: React.FC<Props> = ({navigation}) => {
	useEffect(() => {
		setTimeout(() => {
			navigation.replace(NAVIGATOR_SIGNED_OUT_STACK);
		}, 3000); // Mocking data loading at landing screen
	}, [navigation]);

	return (
		<View className="flex-1 justify-center items-center bg-white">
			<LottieView
				source={LandingAnimation}
				style={{width: "70%", height: 156}}
				autoPlay
				loop
				resizeMode="cover"
			/>
		</View>
	);
};

export default LandingScreen;
