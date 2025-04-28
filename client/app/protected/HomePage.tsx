import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Banner, Button, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import searchJob, {type skillStat} from "@/models/scraper";
import OutputDisplay from "@/app/protected/OutputDisplay";

interface RecentSearch {
  title: string;
  location: string;
  results: string[];
}

export default function HomePage() {
  const [visible, setVisible] = useState(true);
  const [jobTitle, setJobTitle] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    const stored = await AsyncStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  };

  const saveRecentSearch = async (search: RecentSearch) => {
    const updatedSearches = [search, ...recentSearches.filter(
      s => !(s.title === search.title && s.location === search.location)
    )].slice(0, 5); // Keep only last 5
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const clearRecentSearches = async () => {
    await AsyncStorage.removeItem("recentSearches");
    setRecentSearches([]);
  };

  const handleSearch = async () => {
    if (!jobTitle) return;

    // Check if already cached
    const cached = recentSearches.find(
      s => s.title.toLowerCase() === jobTitle.toLowerCase() &&
           s.location.toLowerCase() === jobLocation.toLowerCase()
    );
    if (cached) {
      console.log("Using cached search");
      setOutput(cached.results);
      return;
    }

    setLoading(true);
    try {
      const response = await searchJob(jobTitle, jobLocation);
      console.log("Response from scraper:", response);
      const formattedSkills = response.map(
        (entry: skillStat) =>
          `${entry.skill} - Identified in ${entry.frequency} job postings`
      );
      setOutput(formattedSkills);

      await saveRecentSearch({ title: jobTitle, location: jobLocation, results: formattedSkills });

    } catch (error) {
      console.error("Error fetching skills:", error);
      setOutput(["Error fetching skills from the job scraper. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearchPress = (search: RecentSearch) => {
    setJobTitle(search.title);
    setJobLocation(search.location);
    setOutput(search.results);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center">
        <Text className="font-bold text-2xl text-center">Interview Coach</Text>

        <Banner
          visible={visible}
          actions={[
            { label: "Continue", onPress: () => setVisible(false) },
          ]}
          icon={({ size }) => (
            <Image
              source={{ uri: "https://avatars3.githubusercontent.com/u/17571969?s=400&v=4" }}
              style={{ width: size, height: size }}
            />
          )}
        >
          Welcome to Interview Coach — helping you land your dream job by identifying essential skills!
        </Banner>

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

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View className="mt-6">
            <Text className="text-lg font-bold mb-2 text-center">Recent Searches:</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row px-4">
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => handleRecentSearchPress(search)} 
                  style={{ 
                    marginHorizontal: 6, 
                    marginBottom: 10, 
                    padding: 10, 
                    backgroundColor: "#e0e0e0", 
                    borderRadius: 8 
                  }}
                >
                  <Text>{search.title} - {search.location}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Clear Button */}
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

      <View className="flex-1 p-4">
        <OutputDisplay title="Required Skills" data={output} loading={loading} />
      </View>
    </SafeAreaView>
  );
}