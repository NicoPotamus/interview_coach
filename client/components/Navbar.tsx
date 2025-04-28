import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import HomePage from "@/app/protected/HomePage";
import JobPostings from "@/app/protected/JobPostings";
import SkillAnalysis from "@/app/protected/SkillAnalysis";
import SkillTree from "@/app/protected/SkillTree"; // <-- Import SkillTree page
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

// Route Components
const HomeRoute = () => <HomePage />;
const JobsRoute = () => <JobPostings />;
const AnalysisRoute = () => <SkillAnalysis />;
const SkillTreeRoute = () => <SkillTree />; // <-- Add SkillTree route
const SettingsRoute = () => null; // Still a settings page if needed

const Navbar = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: "home", title: "Home", focusedIcon: "home-circle", unfocusedIcon: "home-circle-outline" },
    { key: "jobs", title: "Job Listings", focusedIcon: "briefcase", unfocusedIcon: "briefcase-outline" },
    { key: "analysis", title: "Skills", focusedIcon: "chart-bar", unfocusedIcon: "chart-bar" },
    { key: "skilltree", title: "Skill Tree", focusedIcon: "tree", unfocusedIcon: "tree-outline" }, // <-- New Skill Tree tab
    { key: "settings", title: "Settings", focusedIcon: "cog", unfocusedIcon: "cog-outline" },
    { key: "logout", title: "Logout", focusedIcon: "logout", unfocusedIcon: "logout" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    jobs: JobsRoute,
    analysis: AnalysisRoute,
    skilltree: SkillTreeRoute, // <-- Hook in SkillTree scene
    settings: SettingsRoute,
    logout: () => null,
  });

  const handleIndexChange = async (newIndex: number) => {
    const selectedRoute = routes[newIndex].key;

    if (selectedRoute === "logout") {
      await logout();
      router.replace("/login");
    } else {
      setIndex(newIndex);
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