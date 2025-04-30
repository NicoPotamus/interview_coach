// Import necessary React and React Native libraries
import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Banner, Button, TextInput, useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import custom scraper logic and types
import searchJob, { type skillStat } from "@/models/scraper";
import OutputDisplay from "@/app/protected/OutputDisplay";

// Define the structure of a recent search object
interface RecentSearch {
  title: string;
  location: string;
  results: string[];
}

// Main component for the homepage
export default function HomePage() {
  const theme = useTheme();                  // Get current theme (dark or light)
  const isDark = theme.dark;                 // Boolean for theme darkness

  // Declare state variables
  const [visible, setVisible] = useState(true);  // Controls visibility of the welcome banner
  const [jobTitle, setJobTitle] = useState("");  // Stores the job title input
  const [jobLocation, setJobLocation] = useState("");  // Stores the location input
  const [output, setOutput] = useState<string[]>([]);  // Stores skills result
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);  // Stores recent search history
  const [loading, setLoading] = useState(false);  // Indicates if a search is in progress

  const screenHeight = Dimensions.get('window').height; // Get screen height (not directly used here)

  // On component mount, load recent searches from storage
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Load recent search data from AsyncStorage
  const loadRecentSearches = async () => {
    const stored = await AsyncStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  };

  // Save a new recent search, avoiding duplicates and limiting to 5
  const saveRecentSearch = async (search: RecentSearch) => {
    const updatedSearches = [search, ...recentSearches.filter(
      s => !(s.title === search.title && s.location === search.location)
    )].slice(0, 5); 
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  // Clear all recent searches from state and storage
  const clearRecentSearches = async () => {
    await AsyncStorage.removeItem("recentSearches");
    setRecentSearches([]);
  };

  // Main function to search for skills based on job title/location
  const handleSearch = async () => {
    if (!jobTitle) return;

    // Check if the search already exists in cache
    const cached = recentSearches.find(
      s => s.title.toLowerCase() === jobTitle.toLowerCase() &&
           s.location.toLowerCase() === jobLocation.toLowerCase()
    );
    if (cached) {
      console.log("Using cached search");
      setOutput(cached.results);
      return;
    }

    setLoading(true); // Set loading state to true while fetching
    try {
      const response = await searchJob(jobTitle, jobLocation); // Call the scraper
      console.log("Response from scraper:", response);

      // Format the results to readable skill strings
      const formattedSkills = response.map(
        (entry: skillStat) =>
          `${entry.skill} - Identified in ${entry.frequency} job postings`
      );
      setOutput(formattedSkills); // Update the UI with new output

      // Save the result for later use
      await saveRecentSearch({ title: jobTitle, location: jobLocation, results: formattedSkills });

    } catch (error) {
      // Handle any scraper errors
      console.error("Error fetching skills:", error);
      setOutput(["Error fetching skills from the job scraper. Please try again."]);
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Populate the form and output when a recent search is clicked
  const handleRecentSearchPress = (search: RecentSearch) => {
    setJobTitle(search.title);
    setJobLocation(search.location);
    setOutput(search.results);
  };

  return (
    // Safe area view ensures content is not cut off by notches/status bars
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <View className="flex-1 justify-center">
        {/* App title */}
        <Text className="font-bold text-2xl text-center" style={{ color: theme.colors.onBackground }}>
          Interview Coach
        </Text>

        {/* Welcome banner with avatar and dismiss button */}
        <Banner
          visible={visible}
          actions={[{ label: "Continue", onPress: () => setVisible(false) }]}
          icon={({ size }) => (
            <Image
              source={{ uri: "https://avatars3.githubusercontent.com/u/17571969?s=400&v=4" }}
              style={{ width: size, height: size }}
            />
          )}
        >
          Welcome to Interview Coach — helping you land your dream job by identifying essential skills!
        </Banner>

        {/* Job title and location inputs */}
        <View className="flex flex-row justify-center">
          <View className="basis-3/4 mr-4">
            <TextInput
              label="Job Title"
              value={jobTitle}
              onChangeText={setJobTitle}
              className="mb-4"
            />
          </View>
          <TextInput
            label="Location"
            value={jobLocation}
            onChangeText={setJobLocation}
            className="mb-4"
          />
        </View>

        {/* Search button */}
        <View className="items-center">
          <View className="mt-4 basis-15">
            <Button
              icon="database-search"
              mode="contained"
              onPress={handleSearch}
              loading={loading}
              disabled={loading || !jobTitle}
            >
              Search Skills
            </Button>
          </View>
        </View>

        {/* Display recent searches */}
        {recentSearches.length > 0 && (
          <View className="mt-6">
            <Text className="text-lg font-bold mb-2 text-center" style={{ color: theme.colors.onBackground }}>
              Recent Searches:
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row px-4">
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => handleRecentSearchPress(search)} 
                  style={{ 
                    marginHorizontal: 6, 
                    marginBottom: 10, 
                    padding: 10, 
                    backgroundColor: isDark ? "#333333" : "#e0e0e0",
                    borderRadius: 8 
                  }}
                >
                  <Text style={{ color: isDark ? "#ffffff" : "#000000" }}>
                    {search.title} - {search.location}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Button to clear search history */}
            <View className="items-center">
              <Button 
                mode="outlined" 
                onPress={clearRecentSearches} 
                style={{ marginTop: 10 }}
              >
                Clear Search History
              </Button>
            </View>
          </View>
        )}
      </View>

      {/* Output display for extracted skills */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16, flexGrow: 1 }}>
        <OutputDisplay 
          title="Required Skills" 
          data={output} 
          loading={loading} 
          textColor={isDark ? "#ffffff" : "#000000"}
        />
      </View>
    </SafeAreaView>
  );
}