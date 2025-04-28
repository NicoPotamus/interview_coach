import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, Text, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { parseUrl,  type skillStat } from "@/models/scraper";
import OutputDisplay from "@/app/protected/OutputDisplay";

export default function JobPostings() {
  const [jobUrl, setJobUrl] = React.useState("");
  const [output, setOutput] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleUrlParse = React.useCallback(async () => {
    if (!jobUrl) return;

    setLoading(true);
    try {
      const response = await parseUrl(jobUrl);
      console.log("Response from URL parser:", response);
      const formattedSkills = response
        ? response.map(
            (entry: skillStat) =>
              `${entry.skill} - Identified in ${entry.frequency} job postings`
          )
        : [];
      setOutput(formattedSkills);
    } catch (error) {
      console.error("Error parsing URL:", error);
      setOutput(["Error parsing job posting. Please check the URL and try again."]);
    } finally {
      setLoading(false);
    }
  }, [jobUrl]);

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>LinkedIn Job Skills Parser</Title>

      <Card style={styles.searchCard}>
        <Card.Content>
          <TextInput
            label="LinkedIn Job URL"
            value={jobUrl}
            onChangeText={setJobUrl}
            style={styles.searchInput}
            placeholder="Paste LinkedIn job URL here"
          />
          <Button
            mode="contained"
            onPress={handleUrlParse}
            style={styles.searchButton}
            loading={loading}
            disabled={loading || !jobUrl.trim()}
          >
            Parse Skills
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