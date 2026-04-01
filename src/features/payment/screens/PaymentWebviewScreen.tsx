import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PAYMENT_SCREENS } from '@utils/screens';
import type { SignedInStackParams } from '@navigation/stacks/SignedInStack';
import HeaderBackButton from '@components/Header/HeaderBackButton';

type NavigationProp = NativeStackNavigationProp<SignedInStackParams>;

const PaymentWebviewScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  // Safe cast since we will define it in SignedInStackParams
  const { paymentUrl, orderId, amount } = route.params as { paymentUrl: string; orderId: string; amount: number };

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    
    // Asumsi url redirect mengandung 'finish' atau 'success' (sesuai backend process.env.SUCCESS_TRANSACTION_URL)
    if (url.includes('finish') || url.includes('success')) {
      // Gunakan replace agar tidak bisa diswipe back ke webview lagi
      (navigation as any).replace(PAYMENT_SCREENS.SUCCESS, { orderId, amount, date: new Date().toISOString() });
    } 
    // jika dibatalkan/error di side midtrans
    else if (url.includes('error') || url.includes('failed') || url.includes('unfinish')) {
      navigation.goBack();
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header Kecil untuk bisa Back ke aplikasi manual */}
      <View className="pt-12 pb-2 px-4 border-b border-heyhao-border flex-row items-center bg-white z-10">
         <HeaderBackButton />
      </View>
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <View className="absolute inset-0 items-center justify-center bg-white z-0">
            <ActivityIndicator size="large" color="#165dff" />
          </View>
        )}
      />
    </View>
  );
};

export default PaymentWebviewScreen;
