import * as React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Card, Title, Paragraph, Chip, ActivityIndicator, Text, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  url: string;
  posted: string;
}

export default function JobPostings() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  // Function to fetch job postings from the web scraper
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Make API call to the server to fetch job postings
      const response = await fetch(
        `http://localhost:5000/api/jobs?title=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch job data from scraper');
      }
      
      const data = await response.json();
      
      // Map the response to our Job interface
      const formattedJobs = data.jobs.map((job: any, index: number) => ({
        id: job.id || index.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        skills: job.skills || [],
        url: job.url || "#",
        posted: job.posted || "Recently posted"
      }));
      
      setJobs(formattedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to load job postings. The server might be down or the search returned no results.");
      setJobs([]); // Clear jobs on error
    } finally {
      setLoading(false);
    }
  };

  // Search for jobs when the search button is pressed
  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchJobs();
    }
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>{item.company} • {item.location}</Paragraph>
        <Paragraph>Posted: {item.posted}</Paragraph>
        
        <View style={styles.skillsContainer}>
          {item.skills.map((skill, index) => (
            <Chip key={index} style={styles.chip}>{skill}</Chip>
          ))}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button 
          icon="open-in-new" 
          onPress={() => {
            // Open job URL in browser
            // For React Native this would typically use Linking.openURL
            console.log("Opening URL:", item.url);
          }}
        >
          View Details
        </Button>
        <Button icon="bookmark-outline">Save Job</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>LinkedIn Job Postings</Title>
      
      <Card style={styles.searchCard}>
        <Card.Content>
          <View style={styles.searchContainer}>
            <TextInput
              label="Job Title"
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
            />
            <TextInput
              label="Location"
              value={location}
              onChangeText={setLocation}
              style={styles.searchInput}
            />
          </View>
          <Button 
            mode="contained" 
            onPress={handleSearch} 
            style={styles.searchButton}
            loading={loading}
            disabled={loading || !searchTerm.trim()}
          >
            Search Jobs
          </Button>
        </Card.Content>
      </Card>
      
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : jobs.length > 0 ? (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : searchTerm ? (
        <Text style={styles.noData}>No job postings found for "{searchTerm}"</Text>
      ) : (
        <Text style={styles.noData}>Enter a job title to search for postings</Text>
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
    marginBottom: 16,
    textAlign: "center",
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
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  chip: {
    margin: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    opacity: 0.6,
  },
  loader: {
    marginTop: 32,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "#D32F2F",
  }
});