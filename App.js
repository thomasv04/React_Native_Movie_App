import React from 'react';
import Navigation from './Navigation/Navigation'
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { Font } from 'expo'

export default class App extends React.Component {
  state = {
    fontLoaded: false,
  };

  _displayLoading() {
    if (this.state.fontLoaded === false) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color='#ffc235' />
        </View>
      )
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Montserrat': require('./assets/font/Montserrat-Regular.ttf'),
      'Montserrat-Bold': require('./assets/font/Montserrat-Bold.ttf'),
      'Montserrat-Italic': require('./assets/font/Montserrat-Italic.ttf'),
    });

    this.setState({ fontLoaded: true, isLoading: false });
  }

  render() {
    return (
      this.state.fontLoaded ? (
        <Provider store={Store}>
          <Navigation />
        </Provider>

      ) : this._displayLoading()

    );
  }
}

const styles = StyleSheet.create({
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})


