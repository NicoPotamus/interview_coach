import * as React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Title, Text, ProgressBar, Subheading, ActivityIndicator, TextInput, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface SkillData {
  name: string;
  percentage: number;
  description?: string;
}

export default function SkillAnalysis() {
  const [skills, setSkills] = React.useState<SkillData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [jobTitle, setJobTitle] = React.useState<string>("");
  const [jobLocation, setJobLocation] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  // Function to fetch skill analysis from the web scraper
  const fetchSkillAnalysis = async () => {
    if (!jobTitle.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Make API call to the server to fetch skill analysis
      const response = await fetch(
        `http://localhost:5000/api/skill-analysis?job=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(jobLocation || '')}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from scraper');
      }
      
      const data = await response.json();
      
      // Map the response to our SkillData interface
      const formattedSkills = data.skills.map((skill: any) => ({
        name: skill.name,
        percentage: skill.frequency / 100, // Convert percentage to decimal
        description: `Found in ${skill.frequency}% of job postings. ${skill.description || ''}`
      }));
      
      // Sort skills by percentage (descending)
      formattedSkills.sort((a: SkillData, b: SkillData) => b.percentage - a.percentage);
      
      setSkills(formattedSkills);
    } catch (error) {
      console.error("Error fetching skill analysis:", error);
      setError("Failed to load skill analysis. The server might be down or the search returned no results.");
      setSkills([]); // Clear skills on error
    } finally {
      setLoading(false);
    }
  };

  // Function to determine color based on percentage
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 0.8) return "#4CAF50"; // Green for high demand
    if (percentage >= 0.5) return "#2196F3"; // Blue for medium demand
    return "#FF9800"; // Orange for lower demand
  };

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Skill Analysis</Title>
      
      <Card style={styles.searchCard}>
        <Card.Content>
          <View style={styles.searchContainer}>
            <TextInput
              label="Job Title"
              value={jobTitle}
              onChangeText={setJobTitle}
              style={styles.searchInput}
            />
            <TextInput
              label="Location (Optional)"
              value={jobLocation}
              onChangeText={setJobLocation}
              style={styles.searchInput}
            />
          </View>
          <Button 
            mode="contained" 
            onPress={fetchSkillAnalysis} 
            style={styles.searchButton}
            loading={loading}
            disabled={loading || !jobTitle.trim()}
          >
            Analyze Skills
          </Button>
        </Card.Content>
      </Card>
      
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : skills.length > 0 ? (
        <ScrollView>
          <Text style={styles.subtitle}>Based on LinkedIn job postings for "{jobTitle}"</Text>
          {skills.map((skill, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <View style={styles.skillHeader}>
                  <Subheading>{skill.name}</Subheading>
                  <Text>{Math.round(skill.percentage * 100)}%</Text>
                </View>
                <ProgressBar 
                  progress={skill.percentage} 
                  color={getProgressColor(skill.percentage)} 
                  style={styles.progressBar} 
                />
                <Text style={styles.description}>{skill.description}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Enter a job title to analyze the most in-demand skills
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.7,
  },
  searchCard: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
  },
  searchButton: {
    marginTop: 16,
  },
  card: {
    marginBottom: 12,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBar: {
    marginVertical: 8,
    height: 8,
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  loader: {
    marginTop: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
  },
  emptyStateText: {
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "#D32F2F",
  }
});