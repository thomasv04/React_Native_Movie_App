import React from 'react'
import { View, Button, TextInput, StyleSheet, StatusBar, FlatList, Keyboard, ActivityIndicator, Platform } from 'react-native'
import FilmItem from '../Components/FilmItem'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
import { connect } from 'react-redux'

class Search extends React.Component {

    constructor(props) {
        super(props)
        this.page = 0
        this.totalPages = 0
        this.state = {
            films: [],
            isLoading: false
        }

        this.searchedText = ""
    }

    _loadFilms() {
        
        if (this.searchedText.length > 0) {
            this.setState({ isLoading: true })
            getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
                this.page = data.page
                this.totalPages = data.total_pages
                this.setState({
                    films: [...this.state.films, ...data.results],
                    isLoading: false
                })
            })
            Keyboard.dismiss()
        }

    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' color='#ffc235' />
                </View>
            )
        }
    }

    _searchTextInputChanged(text) {
        this.searchedText = text
    }

    _searchFilms(){
        this.page = 0,
        this.totalPages = 0
        this.setState({
            films: []
        },() => {
            this._loadFilms()
        })
        
    }

    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate("FilmDetail", {idFilm: idFilm})
    }

    render() {
        return (
            <View style={styles.main_container}>
                <View style={styles.textinput_container}>
                    <TextInput onSubmitEditing={() => this._searchFilms()} style={styles.textinput} placeholder="Titre du film" onChangeText={(text) => this._searchTextInputChanged(text)} />
                </View>
                <View style={styles.search}>
                    <Button color="#ffc235" title="Rechercher" onPress={() => this._searchFilms()} />
                </View>
                <FlatList
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if (this.page < this.totalPages) {
                            this._loadFilms()
                        }
                    }}
                    data={this.state.films}
                    extraData={this.props.favoritesFilm}
                    keyExtractor={(item) => item.id.toString() + Date.now()}
                    renderItem={({ item }) => <FilmItem film={item} displayDetailForFilm = {this._displayDetailForFilm} isFilmFavorite={(this.props.favoritesFilm.findIndex(film => film.id === item.id) !== -1) ? true : false} />}
                />
                {this._displayLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        ...Platform.select({
            ios: {
                marginTop: 30,
            },
            android: {
                marginTop: StatusBar.currentHeight + 10,
            }

        }),
        //marginTop: 20,
    },
    textinput_container: {
        marginTop:10,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: 'white',
        elevation: 2,
        borderRadius: 5,
        ...Platform.select({
            ios: {
                shadowOffset: { width: 2, height: 2, },
                shadowColor: 'grey',
                shadowOpacity: 0.5,
            },

        }),


    },
    textinput: {
        height: 50,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: 'Montserrat',
    },
    search: {
        width: '60%',
        marginTop: 10,
        marginBottom: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        elevation: 2,
        fontFamily: 'Montserrat',
    },
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

const mapStateToProps = state => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

export default connect(mapStateToProps)(Search)