import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import HomePage from "@/app/protected/HomePage";
import JobPostings from "@/app/protected/JobPostings";
import SkillAnalysis from "@/app/protected/SkillAnalysis";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

// Route Components
const HomeRoute = () => <HomePage />;
const JobsRoute = () => <JobPostings />;
const AnalysisRoute = () => <SkillAnalysis />;
const SettingsRoute = () => null; // Still a settings page if needed

const Navbar = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: "home", title: "Home", focusedIcon: "home-circle", unfocusedIcon: "home-circle-outline" },
    { key: "jobs", title: "Job Listings", focusedIcon: "briefcase", unfocusedIcon: "briefcase-outline" },
    { key: "analysis", title: "Skills", focusedIcon: "chart-bar", unfocusedIcon: "chart-bar" },
    { key: "settings", title: "Settings", focusedIcon: "cog", unfocusedIcon: "cog-outline" },
    { key: "logout", title: "Logout", focusedIcon: "logout", unfocusedIcon: "logout" }, // <- Added Logout tab
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    jobs: JobsRoute,
    analysis: AnalysisRoute,
    settings: SettingsRoute,
    logout: () => null, // Logout has no actual screen
  });

  const handleIndexChange = async (newIndex: number) => {
    const selectedRoute = routes[newIndex].key;

    if (selectedRoute === "logout") {
      await logout();
      router.replace("/login"); // Instantly log them out and redirect
    } else {
      setIndex(newIndex); // Normal tab switching
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={handleIndexChange}
      renderScene={renderScene}
      shifting={true}
      labeled={true}
    />
  );
};

export default Navbar;