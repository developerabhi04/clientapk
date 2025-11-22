import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigatior';
import { COLORS } from './src/constants/colors';

const App = () => {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.primary}
      />
      <AppNavigator />
    </>
  );
};

export default App;