import "./../../global.css"
import * as React from "react";
import { Image } from "react-native";
import { Banner, Button, TextInput } from "react-native-paper";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fragment } from "react";

export default function HomePage() {
  const [visible, setVisible] = React.useState(true); // Banner
  const [jobTitle, setJobTitle] = React.useState(""); // Search bar
  const [jobLocation, setJobLocation] = React.useState(""); // Search bar
  const [output, setOutput] = React.useState<string[]>([]); // Output area

  const searchButtonPressed = () => {
    console.log(`Job Title: ${jobTitle}, Job Location: ${jobLocation}`);
    // Example output data
    setOutput([
      "Skill 1: Communication",
      "Skill 2: Teamwork",
      "Skill 3: Problem-solving",
    ]);
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
              >
                Search Skills
              </Button>
            </View>
          </View>
        </View>
        <View className="flex-1 p-4">
          <Text className="font-bold text-xl">Output AREA</Text>
          <View className="mt-2 flex-1">
            {output.length > 0 ? (
              <FlatList
                data={output}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text>{`\u2022 ${item}`}</Text>}
              />
            ) : (
              <Text>No data available</Text>
            )}
          </View>
        </View>
      </Fragment>
    </SafeAreaView>
  );
}
