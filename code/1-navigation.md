# Navigation

1.1 install navigation
```
npm install react-navigation react-navigation-stack react-native-gesture-handler@1.3.0
```

1.2. `App.js`

``` js
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
// 2.2 login screen
// 2.16 chat room screen

const MainNavigator = createStackNavigator({
// 2.3 login screen
// 2.17 chat room screen
});

const App = createAppContainer(MainNavigator);

export default App;
```