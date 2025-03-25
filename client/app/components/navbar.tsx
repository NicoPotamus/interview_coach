import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import HomePage from './HomePage'; // Import the HomePage component

const HomeRoute = () => <HomePage />;
const OtherRoute = () => null;
const SettingsRoute = () => null;

const MyComponent = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home-circle', unfocusedIcon: 'home-circle-outline'},
    { key: 'other', title: 'Other', focusedIcon: 'album' },
    { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    other: OtherRoute,
    settings: SettingsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default MyComponent;