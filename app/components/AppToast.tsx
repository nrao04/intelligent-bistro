import Toast, {
  BaseToast,
  type BaseToastProps,
} from "react-native-toast-message";

import { colors, spacing, typography } from "../lib/theme";

function SuccessToast(props: BaseToastProps) {
  return (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.accent,
        backgroundColor: colors.surfaceRaised,
        borderLeftWidth: spacing.xs,
      }}
      contentContainerStyle={{ paddingHorizontal: spacing.lg }}
      text1Style={{
        ...typography.bodyMedium,
        color: colors.textPrimary,
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
