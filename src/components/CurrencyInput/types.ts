import { TextInputProps } from "react-native";

export interface CurrencyInputProps extends Omit<TextInputProps, "onChangeText" | "value"> {
  value: string; // Raw digit string
  onChangeRaw: (value: string) => void;
  backgroundColor?: string;
  borderColor?: string;
  borderLess?: boolean;
  inputStyle?: string;
}
