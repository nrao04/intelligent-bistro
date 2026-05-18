import Toast, {
  BaseToast,
  type BaseToastProps,
} from "react-native-toast-message";

function SuccessToast(props: BaseToastProps) {
  return (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#f59e0b",
        backgroundColor: "#262626",
        borderLeftWidth: 4,
      }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
      }}
    />
  );
}

const toastConfig = {
  success: SuccessToast,
};

export function AppToast() {
  return <Toast config={toastConfig} position="bottom" bottomOffset={96} />;
}
