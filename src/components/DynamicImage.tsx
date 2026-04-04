import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { colors } from "../theme";

interface DynamicImageProps {
  uri: string;
  /** Fallback aspect ratio (width/height) shown while image metadata loads */
  defaultAspectRatio?: number;
  backgroundColor?: string;
  style?: object;
}

/**
 * Fills 100% of its parent's width and sets its own height to match
 * the image's natural aspect ratio. Height updates once the image
 * metadata arrives, so every card sizes itself to its own image.
 */
export function DynamicImage({
  uri,
  defaultAspectRatio = 4 / 3,
  backgroundColor = colors.background.paper,
  style,
}: DynamicImageProps) {
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio);

  const height = measuredWidth > 0 ? measuredWidth / aspectRatio : undefined;

  return (
    <View
      style={[{ width: "100%", height, backgroundColor }, style]}
      onLayout={(e) => setMeasuredWidth(e.nativeEvent.layout.width)}
    >
      {measuredWidth > 0 && (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFillObject}
          contentFit="contain"
          transition={300}
          onLoad={(e) => {
            const { width, height: h } = e.source;
            if (width && h) setAspectRatio(width / h);
          }}
        />
      )}
    </View>
  );
}
