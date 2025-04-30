// Import necessary modules and components
import * as React from "react";
import { View, Text, FlatList, Platform, Dimensions } from "react-native";
import { Card, Title, ActivityIndicator, useTheme } from "react-native-paper";

// Define props expected by the component
interface OutputDisplayProps {
  title: string;         // Section title to be displayed
  data: string[];        // List of string items to display
  loading?: boolean;     // Optional: indicates if data is loading
  textColor?: string;    // Optional: allows overriding text color
}

// Export the OutputDisplay component
export default function OutputDisplay({ 
  title, 
  data, 
  loading = false,        // Default loading to false
  textColor
}: OutputDisplayProps) {

  const theme = useTheme();             // Get current theme (light/dark)
  const isDark = theme.dark;            // Boolean to check if theme is dark

  const screenHeight = Dimensions.get("window").height;   // Get screen height
  const cardBackgroundColor = isDark ? "#333333" : "#f5f5f5"; // Background color changes with theme
  const finalTextColor = textColor ? textColor : (isDark ? "#ffffff" : "#000000"); // Final color logic for text

  const maxHeight = screenHeight * 0.80;  // Limit max height of the scroll area to 80% of screen

  return (
    <View className="w-full" style={{ flexGrow: 1 }}>
      {/* Outer card containing all content */}
      <Card className="m-2" style={{ flexGrow: 1 }}>
        <Card.Content style={{ paddingBottom: 0 }}>
          {/* Title at the top of the card */}
          <Title style={{ color: finalTextColor, marginBottom: 10 }}>
            {title}
          </Title>

          {/* Show loading spinner if loading is true */}
          {loading ? (
            <View 
              style={{ 
                height: maxHeight, 
                justifyContent: "center", 
                alignItems: "center" 
              }}
            >
              <ActivityIndicator size="large" color={finalTextColor} />
            </View>
          ) : (
            // Otherwise, display a scrollable list of results
            <FlatList
              data={data}  // The list of strings to show
              keyExtractor={(item, index) => index.toString()} // Unique key per item
              renderItem={({ item, index }) => (
                <Card 
                  style={{
                    backgroundColor: cardBackgroundColor,  // Card color based on theme
                    marginVertical: 4,                     // Space between list items
                    padding: 10,                           // Inner padding
                    borderRadius: 8,                       // Rounded corners
                    elevation: 2,                          // Shadow effect
                  }}
                >
                  <Text 
                    style={{ 
                      fontSize: 14, 
                      fontWeight: "600", 
                      color: finalTextColor                // Adjust text color for theme
                    }}
                  >
                    {index + 1}. {item}                    // Numbered item
                  </Text>
                </Card>
              )}
              scrollEnabled                              // Allow scrolling
              showsVerticalScrollIndicator               // Show scrollbar
              contentContainerStyle={{
                paddingBottom: 80,                        // Space at the bottom
              }}
              style={{
                maxHeight: maxHeight,                     // Limit list height
              }}
            />
          )}
        </Card.Content>
      </Card>
    </View>
  );
}