import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Props = {
  minWidth?: number;
  maxWidth?: number;
  initialOpen?: boolean;
  animationDuration?: number;
  children?: React.ReactNode;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  style?: object;
};

const ResizableSidebar = ({
  minWidth = 56,
  maxWidth = Math.min(320, SCREEN_WIDTH * 0.85),
  initialOpen = false,
  animationDuration = 220,
  children,
  open: controlledOpen,
  onToggle,
  style,
}: Props) => {
  const progress = useRef(new Animated.Value(initialOpen ? 1 : 0)).current;
  const [open, setOpen] = useState(initialOpen);

  // Decide whether sidebar is controlled externally
  const isControlled = controlledOpen !== undefined;
  const sidebarOpen = controlledOpen !== undefined ? controlledOpen : open;

  // Compute width based on open state
  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: sidebarOpen ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  }, [sidebarOpen]);

  // Toggle handler
  const toggle = () => {
    if (isControlled) {
      onToggle?.(!controlledOpen);
    } else {
      const toValue = open ? 0 : 1;
      Animated.timing(progress, {
        toValue,
        duration: animationDuration,
        useNativeDriver: false,
      }).start(() => setOpen(!open));
      onToggle?.(!open);
    }
  };

  // PanResponder for drag resizing (same as before)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 6,
      onPanResponderGrant: () => {
        progress.setOffset((progress as any)._value ?? 0);
        progress.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        const range = maxWidth - minWidth;
        const delta = gestureState.dx / (range || 1);
        progress.setValue(delta);
      },
      onPanResponderRelease: (_e, _g) => {
        progress.flattenOffset();
        progress.stopAnimation((value: number) => {
          let toValue = value;
          if (value < 0.15) toValue = 0;
          else if (value > 0.85) toValue = 1;
          Animated.timing(progress, {
            toValue,
            duration: 120,
            useNativeDriver: false,
          }).start(() => {
            if (!isControlled) setOpen(toValue === 1);
            onToggle?.(toValue === 1);
          });
        });
      },
    })
  ).current;

  const widthInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [minWidth, maxWidth],
    extrapolate: "clamp",
  });

  const animatedStyle = { width: widthInterpolate };

  return (
    <>
      <Animated.View style={[styles.sidebar, animatedStyle, style]}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={toggle} style={styles.hamburger}>
            <View style={styles.hamLine} />
            <View style={[styles.hamLine, { width: 18 }]} />
            <View style={styles.hamLine} />
          </TouchableOpacity>
          <View style={styles.resizeWrapper} {...panResponder.panHandlers}>
            <View style={styles.resizeBar} />
          </View>
        </View>
        {sidebarOpen && (
          <View style={styles.content}>
            {children ?? (
              <>
                <Text style={styles.title}>Menu</Text>
                <Text style={styles.item}>• Home</Text>
                <Text style={styles.item}>• Profile</Text>
                <Text style={styles.item}>• Settings</Text>
                <Text style={styles.item}>• Logout</Text>
              </>
            )}
          </View>
        )}
      </Animated.View>
    </>
  );
};

export default ResizableSidebar;

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#8A1717",
    paddingTop: Platform.OS === "ios" ? 48 : 16,
    zIndex: 50,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    height: 48,
  },
  hamburger: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  hamLine: {
    height: 3,
    width: 26,
    backgroundColor: "#fff",
    marginVertical: 2,
    borderRadius: 2,
  },
  resizeWrapper: {
    // place the resize handle to the right inside the sidebar top row
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  resizeBar: {
    width: 4,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 4,
  },
  content: {
    padding: 12,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
  },
  item: {
    color: "#e2e8f0",
    paddingVertical: 8,
  },
  mainContainer: {
    flex: 1,
    marginLeft: 0,
  },
});
