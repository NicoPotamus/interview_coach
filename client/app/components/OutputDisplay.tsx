import * as React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Card, Title } from "react-native-paper";

interface OutputDisplayProps {
  title: string;
  data: string[];
  loading?: boolean;
}

export default function OutputDisplay({ title, data, loading = false }: OutputDisplayProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{title}</Title>
        <View style={styles.contentContainer}>
          {loading ? (
            <Text>Loading data...</Text>
          ) : data.length > 0 ? (
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.listItem}>{`\u2022 ${item}`}</Text>
              )}
            />
          ) : (
            <Text>No data available</Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
  },
  contentContainer: {
    marginTop: 10,
  },
  listItem: {
    marginVertical: 4,
    fontSize: 16,
  }
});