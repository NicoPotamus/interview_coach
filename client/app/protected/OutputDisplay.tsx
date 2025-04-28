import * as React from "react";
import { View, Text, FlatList, Platform, Dimensions } from "react-native";
import { Card, Title, ActivityIndicator, useTheme } from "react-native-paper";

interface OutputDisplayProps {
  title: string;
  data: string[];
  loading?: boolean;
  textColor?: string;
}

export default function OutputDisplay({ 
  title, 
  data, 
  loading = false, 
  textColor
}: OutputDisplayProps) {
  const theme = useTheme();
  const isDark = theme.dark;

  const screenHeight = Dimensions.get("window").height;
  const cardBackgroundColor = isDark ? "#333333" : "#f5f5f5";  
  const finalTextColor = textColor ? textColor : (isDark ? "#ffffff" : "#000000");

  // const maxHeight = screenHeight * 0.5; // 50% of screen height
  const maxHeight = screenHeight * 0.80; // 50% of screen height


  return (
    <View className="w-full" style={{ flexGrow: 1 }}>
      <Card className="m-2" style={{ flexGrow: 1 }}>
        <Card.Content style={{ paddingBottom: 0 }}>
          <Title style={{ color: finalTextColor, marginBottom: 10 }}>
            {title}
          </Title>

          {loading ? (
            <View style={{ height: maxHeight, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color={finalTextColor} />
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <Card 
                  style={{
                    backgroundColor: cardBackgroundColor,
                    marginVertical: 4,
                    padding: 10,
                    borderRadius: 8,
                    elevation: 2,
                  }}
                >
                  <Text 
                    style={{ 
                      fontSize: 14, 
                      fontWeight: "600", 
                      color: finalTextColor 
                    }}
                  >
                    {index + 1}. {item}
                  </Text>
                </Card>
              )}
              scrollEnabled
              showsVerticalScrollIndicator
              contentContainerStyle={{
                paddingBottom: 80, // <-- 👈 give enough bottom padding for navbar
              }}
              style={{
                maxHeight: maxHeight,
              }}
            />
          )}
        </Card.Content>
      </Card>
    </View>
  );
}