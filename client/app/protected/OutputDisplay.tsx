import * as React from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import { Card, Title } from "react-native-paper";

interface OutputDisplayProps {
  title: string;
  data: string[];
  loading?: boolean;
}

export default function OutputDisplay({ title, data, loading = false }: OutputDisplayProps) {
  return (
    <ScrollView style={styles.scrollView}>
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
                scrollEnabled={false} // Disable FlatList scrolling since we're using ScrollView
                nestedScrollEnabled={true}
              />
            ) : (
              <Text>No data available</Text>
            )}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
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