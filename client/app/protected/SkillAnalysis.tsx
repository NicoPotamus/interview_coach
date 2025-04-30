// Import necessary libraries and components
import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, TextInput, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// Import the model query function and skill type definition
import { quereyModel, type skillStat } from "@/models/scraper";

// Reusable component for displaying the extracted skills
import OutputDisplay from "@/app/protected/OutputDisplay";

// Define and export the SkillAnalysis component
export default function SkillAnalysis() {
  // State for storing user input: the job description
  const [description, setDescription] = React.useState("");

  // State for storing formatted output (parsed skills)
  const [output, setOutput] = React.useState<string[]>([]);

  // State to track if the app is currently fetching data
  const [loading, setLoading] = React.useState(false);

  // Callback function to analyze the job description for skills
  const handleAnalysis = React.useCallback(async () => {
    // Avoid submitting if the input is empty or just whitespace
    if (!description.trim()) return;
    
    setLoading(true); // Start loading indicator
    try {
      // Call the model with the input description
      const response = await quereyModel(description);
      console.log("Response from model:", response);

      // Format the returned skills into readable strings
      const formattedSkills = response
        ? response.map(
            (entry: skillStat) =>
              `${entry.skill} - Identified in ${entry.frequency} job postings`
          )
        : [];

      setOutput(formattedSkills); // Set formatted output to be displayed
    } catch (error) {
      // Handle any errors that occurred during fetch
      console.error("Error analyzing skills:", error);
      setOutput(["Error analyzing job description. Please try again."]);
    } finally {
      setLoading(false); // End loading indicator
    }
  }, [description]); // Dependency on `description` state

  return (
    <SafeAreaView style={styles.container}>
      {/* Page title */}
      <Title style={styles.title}>Job Description Analysis</Title>

      {/* Card containing the input and button */}
      <Card style={styles.searchCard}>
        <Card.Content>
          {/* Text input for the job description */}
          <TextInput
            label="Job Description"
            value={description}
            onChangeText={setDescription}
            style={styles.searchInput}
            placeholder="Paste job description here"
            multiline
            numberOfLines={4} // Set input box height
          />

          {/* Button to trigger skill analysis */}
          <Button
            mode="contained"
            onPress={handleAnalysis}
            style={styles.searchButton}
            loading={loading} // Show spinner if loading
            disabled={loading || !description.trim()} // Disable if loading or empty input
          >
            Analyze Skills
          </Button>
        </Card.Content>
      </Card>

      {/* Component to display the parsed skills */}
      <OutputDisplay
        title="Required Skills"
        data={output}
        loading={loading}
      />
    </SafeAreaView>
  );
}

// Define styles used in the component
const styles = StyleSheet.create({
  container: {
    flex: 1,         // Occupy full screen
    padding: 16,     // Add spacing from edges
  },
  title: {
    marginBottom: 16,
    textAlign: "center",  // Center the title text
  },
  searchCard: {
    marginBottom: 16,     // Space between card and output
  },
  searchInput: {
    marginBottom: 16,     // Space between input and button
  },
  searchButton: {
    marginTop: 8,         // Add spacing above button
  }
});