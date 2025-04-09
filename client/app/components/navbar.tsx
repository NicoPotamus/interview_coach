import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import HomePage from './HomePage';
import JobPostings from './JobPostings';
import SkillAnalysis from './SkillAnalysis';

// Define route components
const HomeRoute = () => <HomePage />;
const JobsRoute = () => <JobPostings />;
const AnalysisRoute = () => <SkillAnalysis />;
const SettingsRoute = () => null; // Placeholder for future settings component

const MyComponent = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { 
      key: 'home', 
      title: 'Home', 
      focusedIcon: 'home-circle', 
      unfocusedIcon: 'home-circle-outline'
    },
    { 
      key: 'jobs', 
      title: 'Job Listings', 
      focusedIcon: 'briefcase', 
      unfocusedIcon: 'briefcase-outline'
    },
    { 
      key: 'analysis', 
      title: 'Skills', 
      focusedIcon: 'chart-bar', 
      unfocusedIcon: 'chart-bar' 
    },
    { 
      key: 'skilltree', 
      title: 'Skill Tree', 
      focusedIcon: 'account-tree', 
      unfocusedIcon: 'account-tree-outline' 
    },
    { 
      key: 'settings', 
      title: 'Settings', 
      focusedIcon: 'cog', 
      unfocusedIcon: 'cog-outline' 
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

export default MyComponent;