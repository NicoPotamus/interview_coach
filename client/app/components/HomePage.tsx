import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Banner, Button, TextInput } from "react-native-paper";
import searchJob from "../models/scraper";
import OutputDisplay from "./OutputDisplay";

export default function HomePage() {
  const [visible, setVisible] = React.useState(true);
  const [jobTitle, setJobTitle] = React.useState("");
  const [jobLocation, setJobLocation] = React.useState("");
  const [output, setOutput] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = React.useCallback(async () => {
    if (!jobTitle) return;
    
    setLoading(true);
    try {
      const response = await searchJob(jobTitle, jobLocation);
      console.log("Response from scraper:", response);
      const formattedSkills = response.data.map(
        ([skill, count]: [string, number]) =>
          `${skill} - Identified in ${count} job postings`
      );
      setOutput(formattedSkills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setOutput(["Error fetching skills from the job scraper. Please try again."]);
    } finally {
      setLoading(false);
    }
  }, [jobTitle, jobLocation]);

  return (
    <SafeAreaView className="flex-1">
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
        </View>
        <View className="flex-1 p-4">
          <OutputDisplay 
            title="Required Skills" 
            data={output} 
            loading={loading} 
          />
        </View>
    </SafeAreaView>
  );
}
