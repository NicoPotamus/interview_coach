// Import necessary modules and components from React and React Native
import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, Text, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// Import the URL parsing function and type for skills data
import { parseUrl, type skillStat } from "@/models/scraper";

// Import a reusable display component for showing extracted skills
import OutputDisplay from "@/app/protected/OutputDisplay";

// Define and export the main component
export default function JobPostings() {
  // State to store the URL input by the user
  const [jobUrl, setJobUrl] = React.useState("");

  // State to hold the parsed and formatted output skills
  const [output, setOutput] = React.useState<string[]>([]);

  // Loading state to show activity indicator while parsing
  const [loading, setLoading] = React.useState(false);

  // Function to handle parsing the LinkedIn job URL
  const handleUrlParse = React.useCallback(async () => {
    if (!jobUrl) return;  // Don't proceed if input is empty

    setLoading(true);     // Start loading state
    try {
      const response = await parseUrl(jobUrl); // Call the backend scraper
      console.log("Response from URL parser:", response);

      // Format the response into readable text
      const formattedSkills = response
        ? response.map(
            (entry: skillStat) =>
              `${entry.skill} - Identified in ${entry.frequency} job postings`
          )
        : [];

      // Update output state with results
      setOutput(formattedSkills);
    } catch (error) {
      // Handle errors gracefully
      console.error("Error parsing URL:", error);
      setOutput(["Error parsing job posting. Please check the URL and try again."]);
    } finally {
      setLoading(false); // Stop loading state
    }
  }, [jobUrl]); // Dependency array to avoid unnecessary re-renders

  // Return the rendered UI
  return (
    <SafeAreaView style={styles.container}>
      {/* App title */}
      <Title style={styles.title}>LinkedIn Job Skills Parser</Title>

      {/* Input card containing the text field and button */}
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
            disabled={loading || !jobUrl.trim()} // Disable if empty or loading
          >
            Parse Skills
          </Button>
        </Card.Content>
      </Card>

      {/* Display the parsed skills output */}
      <OutputDisplay
        title="Required Skills"
        data={output}
        loading={loading}
      />
    </SafeAreaView>
  );
}

// Define component-specific styles
const styles = StyleSheet.create({
  container: {
    flex: 1,           // Fill full screen
    padding: 16,       // Padding around the edges
  },
  title: {
    marginBottom: 16,
    textAlign: "center",  // Center the title
  },
  searchCard: {
    marginBottom: 16,  // Spacing below the input card
  },
  searchInput: {
    marginBottom: 16,  // Space between input and button
  },
  searchButton: {
    marginTop: 8,      // Space above the button
  }
});