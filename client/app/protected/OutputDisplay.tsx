import * as React from "react";
import { View, Text, FlatList, Platform } from "react-native";
import { Card, Title, ActivityIndicator } from "react-native-paper";

interface OutputDisplayProps {
  title: string;
  data: string[];
  loading?: boolean;
}

export default function OutputDisplay({ title, data, loading = false }: OutputDisplayProps) {
  return (
    <View 
      className="w-full" 
      style={{ 
        height: Platform.OS === 'web' ? 300 : undefined,
        minHeight: Platform.OS === 'web' ? 300 : undefined
      }}
    >
      <Card className="m-2 h-full">
        <Card.Content className="h-full flex flex-col">
          <Title className="text-xl font-bold mb-2">{title}</Title>
          {loading ? (
            <View className="flex items-center justify-center py-4">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text className="text-sm py-1 leading-5">
                  {`\u2022 ${item}`}
                </Text>
              )}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              style={{ 
                height: Platform.OS === 'web' ? 250 : undefined,
                overflow: Platform.OS === 'web' ? 'scroll' : undefined
              }}
            />
          )}
        </Card.Content>
      </Card>
    </View>
  );
}