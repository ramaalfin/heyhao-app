import React, { useMemo } from "react";
import { TextInput as RNInput, View } from "react-native";
import { CurrencyInputProps } from "./types";

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChangeRaw,
  backgroundColor = "bg-white",
  borderLess = false,
  borderColor = "border-gray-400",
  inputStyle = "h-12 rounded-lg px-4 justify-center items-center flex-row",
  ...props
}) => {
  const displayValue = useMemo(() => {
    if (!value) return "";

    try {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(parseInt(value));
    } catch {
      return value;
    }
  }, [value]);

  const handleChangeText = (text: string) => {
    // Regex hanya menerima angka
    const cleanNumber = text.replace(/[^0-9]/g, "");
    onChangeRaw(cleanNumber);
  };

  const borderStyle = borderLess ? "border-none" : "border";

  return (
    <View
      className={`${inputStyle} ${backgroundColor} ${borderStyle} ${borderColor} w-full`}>
      <RNInput
        onChangeText={handleChangeText}
        value={displayValue}
        keyboardType="numeric"
        className="flex-1 h-full font-bold text-heyhao-black"
        placeholderTextColor="#6a7686"
        {...props}
      />
    </View>
  );
};

export default CurrencyInput;
