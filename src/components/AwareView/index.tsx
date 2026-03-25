import React from "react";
import {KeyboardAvoidingView, Platform, SafeAreaView} from "react-native";

import {AwareViewProps} from "./types";

const AwareView: React.FC<AwareViewProps> = ({
	children,
	backgroundColor = "bg-white",
}) => {
	return (
		<SafeAreaView className={`${backgroundColor} flex-1`}>
			<KeyboardAvoidingView
				className={`${backgroundColor} w-full flex-1`}
				behavior={Platform.OS === "android" ? "height" : "padding"}>
				{children}
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default AwareView;
