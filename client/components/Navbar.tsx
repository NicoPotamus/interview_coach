import * as React from "react";
import { View, Button } from "react-native";
import { BottomNavigation } from "react-native-paper";
import HomePage from "@/app/protected/HomePage";
import JobPostings from "@/app/protected/JobPostings";
import SkillAnalysis from "@/app/protected/SkillAnalysis";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

// Define route components
const HomeRoute = () => <HomePage />;
const JobsRoute = () => <JobPostings />;
const AnalysisRoute = () => <SkillAnalysis />;

const SettingsRoute = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const Navbar = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home-circle",
      unfocusedIcon: "home-circle-outline",
    },
    {
      key: "jobs",
      title: "Job Listings",
      focusedIcon: "briefcase",
      unfocusedIcon: "briefcase-outline",
    },
    {
      key: "analysis",
      title: "Skills",
      focusedIcon: "chart-bar",
      unfocusedIcon: "chart-bar",
    },
    {
      key: "settings",
      title: "Settings",
      focusedIcon: "cog",
      unfocusedIcon: "cog-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    jobs: JobsRoute,
    analysis: AnalysisRoute,
    settings: SettingsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={true}
      labeled={true}
    />
  );
};

export default Navbar;