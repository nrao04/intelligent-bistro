import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { View } from "react-native";

import { ChatBottomSheet } from "./ChatBottomSheet";
import { ChatFAB } from "./ChatFAB";

export function ChatOverlay() {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [messageCount, setMessageCount] = useState(0);

  return (
    <View pointerEvents="box-none" className="absolute inset-0">
      <ChatFAB
        showPulse={messageCount === 0}
        onPress={() => sheetRef.current?.present()}
      />
      <ChatBottomSheet
        ref={sheetRef}
        onMessageCountChange={setMessageCount}
      />
    </View>
  );
}
