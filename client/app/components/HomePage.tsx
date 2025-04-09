import "./../../global.css"
import * as React from "react";
import { Image } from "react-native";
import { Banner, Button, TextInput } from "react-native-paper";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fragment } from "react";
import OutputDisplay from "./OutputDisplay";

export default function HomePage() {
  const [visible, setVisible] = React.useState(true); // Banner
  const [jobTitle, setJobTitle] = React.useState(""); // Search bar
  const [jobLocation, setJobLocation] = React.useState(""); // Search bar
  const [output, setOutput] = React.useState<string[]>([]); // Output area
  const [loading, setLoading] = React.useState(false); // Loading state

  const searchButtonPressed = async () => {
    if (!jobTitle) return;
    
    setLoading(true);
    console.log(`Job Title: ${jobTitle}, Job Location: ${jobLocation}`);
    
    try {
      // Make API call to the server to fetch skills from web scraper
      const response = await fetch(`http://localhost:5000/api/skills?job=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(jobLocation || '')}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from scraper');
      }
      
      const data = await response.json();
      
      // Format the skill data for display
      const formattedSkills = data.skills.map((skill: { name: string, frequency: number }) => 
        `${skill.name} - Identified in ${skill.frequency}% of job postings`
      );
      
      setOutput(formattedSkills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setOutput(["Error fetching skills from the job scraper. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Fragment>
        <View className="flex-1 justify-center">
          <Text className="font-bold text-2xl text-center">Interview Coach</Text>
          <Banner
            visible={visible}
            actions={[
              {
                label: "Continue",
                onPress: () => setVisible(false),
              },
            ]}
            icon={({ size }) => (
              <Image
                source={{
                  uri: "https://avatars3.githubusercontent.com/u/17571969?s=400&v=4",
                }}
                style={{
                  width: size,
                  height: size,
                }}
              />
            )}
          >
            Welcome to InterViewCoach, we'll help you get that dream job you've
            always wanted by identifying the skills the job market is looking for
            for your desired role.
          </Banner>
          <View className="flex flex-row justify-center">
            <View className="basis-3/4 mr-4">
              <TextInput
                label="Job Title"
                value={jobTitle}
                onChangeText={(jobTitle) => setJobTitle(jobTitle)}
                className="mb-4"
              />
            </View>
            <TextInput
              label="Location"
              value={jobLocation}
              onChangeText={(jobLocation) => setJobLocation(jobLocation)}
              className="mb-4"
            />
          </View>
          <View className="items-center">
            <View className="mt-4 basis-15">
              <Button
                icon="database-search"
                mode="contained"
                onPress={searchButtonPressed}
                loading={loading}
                disabled={loading || !jobTitle}
              >
                Search Skills
              </Button>
            </View>
          </View>
        </View>
        <View className="flex-1 p-4">
          <OutputDisplay 
            title="Required Skills" 
            data={output} 
            loading={loading} 
          />
        </View>
      </Fragment>
    </SafeAreaView>
  );
}
