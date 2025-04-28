import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, TextInput, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { quereyModel, type skillStat } from "@/app/models/scraper";
import OutputDisplay from "@/app/components/OutputDisplay";

export default function SkillAnalysis() {
  const [description, setDescription] = React.useState("");
  const [output, setOutput] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleAnalysis = React.useCallback(async () => {
    if (!description.trim()) return;
    
    setLoading(true);
    try {
      const response = await quereyModel(description);
      console.log("Response from model:", response);
      const formattedSkills = response
        ? response.map(
            (entry: skillStat) =>
              `${entry.skill} - Identified in ${entry.frequency} job postings`
          )
        : [];
      setOutput(formattedSkills);
    } catch (error) {
      console.error("Error analyzing skills:", error);
      setOutput(["Error analyzing job description. Please try again."]);
    } finally {
      setLoading(false);
    }
  }, [description]);

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Job Description Analysis</Title>

      <Card style={styles.searchCard}>
        <Card.Content>
          <TextInput
            label="Job Description"
            value={description}
            onChangeText={setDescription}
            style={styles.searchInput}
            placeholder="Paste job description here"
            multiline
            numberOfLines={4}
          />
          <Button
            mode="contained"
            onPress={handleAnalysis}
            style={styles.searchButton}
            loading={loading}
            disabled={loading || !description.trim()}
          >
            Analyze Skills
          </Button>
        </Card.Content>
      </Card>

      <OutputDisplay
        title="Required Skills"
        data={output}
        loading={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  searchCard: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 16,
  },
  searchButton: {
    marginTop: 8,
  }
});