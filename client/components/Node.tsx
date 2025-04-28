import React, { useEffect } from "react";
import { Text, Pressable, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

interface NodeProps {
  label: string;
  x: number;
  y: number;
  onPress: () => void;
  expanded: boolean;
}

const Node: React.FC<NodeProps> = ({ label, x, y, onPress, expanded }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20); // Start slightly offset

  useEffect(() => {
    if (expanded) {
      opacity.value = withTiming(1, { duration: 500 });
      translateY.value = withTiming(0, { duration: 500 });
    } else {
      opacity.value = withTiming(0, { duration: 500 });
      translateY.value = withTiming(20, { duration: 500 });
    }
  }, [expanded]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ position: "absolute", left: x, top: y }, animatedStyle]}>
      <Pressable onPress={onPress}>
        <Svg height="80" width="80">
          <Circle cx="40" cy="40" r="30" stroke="black" strokeWidth="2.5" fill="#61dafb" />
        </Svg>
        <View style={{ position: "absolute", top: 25, left: 15 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>{label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default Node;