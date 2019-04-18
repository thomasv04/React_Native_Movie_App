import { createStackNavigator, createAppContainer } from 'react-navigation'
import Search from '../Components/Search'
import FilmDetail from '../Components/FilmDetail'

const SearchStackNavigator = createStackNavigator({
  Search: {
    screen: Search,
    navigationOptions: {
      //title: 'Rechercher',
      header:null,
      
    }
  },
  FilmDetail: {
    screen: FilmDetail,
    navigationOptions:{
      headerTransparent:true,
      headerTintColor: 'white'
    }
  }
})

export default createAppContainer(SearchStackNavigator)