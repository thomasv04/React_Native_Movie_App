import React, { useState } from 'react'
import { StyleSheet, View, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import { getImageFromApi, getFilmDetailFromApi } from '../API/TMDBApi'
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'

class FilmDetail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            film: undefined,
            isLoading: true,
            readMore: false
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

    componentDidMount() {
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
            this.setState({
                film: data,
            })
        })
    }

    _imageLoaded() {
        this.setState({
            isLoading: false,

        })
    }

    _renderStars(rating) {
        var greyStars = Math.round(5 - Math.round(rating / 2))

        var stars = [];
        for (var i = 0; i < Math.round(rating / 2); i++) {
            stars.push(
                <Image
                    style={styles.star}
                    source={require('../assets/star.png')}
                    key={i} />
            )
        }
        for (var j = 0; j < greyStars; j++) {
            stars.push(
                <Image
                    style={styles.star}
                    source={require('../assets/greyStar.png')}
                    key={Math.round(rating) / 2 + j} />
            )
        }
        return stars
    }

    _readMore = (text, maxLength) => {
        if (text.toString().length <= maxLength) {
            return text
        }

        return ([
            this.state.readMore ? text + '  ' : text.substr(0, maxLength) + '...  ',
            !this.state.readMore ? (
                <Text style={styles.moreButton} key='Plus' onPress={() => { this.setState({ readMore: true }) }}>Plus</Text>)
                : (<Text style={styles.moreButton} key='Moins' onPress={() => { this.setState({ readMore: false }) }}>Moins</Text>)
        ])

    }

    _toggleFavorite() {
        const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
        this.props.dispatch(action)
    }

    componentDidUpdate() {
        console.log('Film', this.props.favoritesFilm)
    }

    _displayFavoriteImage() {
        var sourceImage = require('../img/ic_favorite_border.png')
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
            sourceImage = require('../img/ic_favorite.png')
        }
        return (
            <Image
                source={sourceImage}
                style={styles.favotire_image}
            />
        )
    }


    _displayFilm() {
        const { film } = this.state
        if (film != undefined) {
            return (
                <ScrollView style={styles.scrollview_container}>
                    <View style={styles.image_container}>
                        {getImageFromApi(film.backdrop_path, 780) !== 'https://image.tmdb.org/t/p/w780/null' ? (
                            <Image
                                style={styles.image}
                                source={{ uri: getImageFromApi(film.backdrop_path, 780) }}
                                onLoadEnd={() => { this._imageLoaded() }}
                            />) : <Image
                                style={styles.image}
                                source={require('../assets/bgNull.jpg')}
                                onLoadEnd={() => { this._imageLoaded() }}
                            />}
                    </View>
                    <View style={styles.text_container}>
                        <View style={styles.text_container_reduce}>
                            <View style={styles.title_container}>
                                <Text style={styles.title_text}>{film.title}</Text>
                                <TouchableOpacity onPress={() => this._toggleFavorite()} style={styles.favorite_container}>
                                    {this._displayFavoriteImage()}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.star_container}>{this._renderStars(film.vote_average)}<Text style={styles.rating}>{film.vote_average}</Text></View>
                            <View style={styles.genre_container}>{film.genres.map(function (genre, index) {
                                return <Text key={index} style={styles.genre}>{genre.name}</Text>
                            })}
                            </View>
                            <Text style={styles.description_text}>{this._readMore(film.overview, 200)}</Text>
                            <Text style={styles.default_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                            <Text style={styles.default_text}>Budget : {numeral(film.budget).format('0,0[.]00 $')}</Text>
                            <Text style={styles.default_text}>Companie(s) : {film.production_companies.map(function (company) {
                                return company.name;
                            }).join(" / ")}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            )
        }
    }



    render() {
        const idFilm = this.props.navigation.state.params.idFilm
        return (
            <View style={styles.main_container}>
                {this._displayFilm()}
                {this._displayLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    scrollview_container: {
        flex: 1,

    },
    moreButton: {
        fontFamily: 'Montserrat-Bold',
        marginLeft: 10,
        paddingLeft: 10,
        color: '#ffc235'
    },
    image_container: {
        flex: 3,
        height: 500,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    text_container: {
        flex: 1,
        marginTop: -50,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,

    },
    star_container: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    star: {
        width: 15,
        height: 15,
        marginRight: 3
    },
    rating: {
        fontFamily: 'Montserrat-Bold',
        marginLeft: 10,
        fontSize: 15,
        marginTop: 'auto',
        lineHeight: 17,
    },
    genre_container: {
        marginTop: 5,
        marginBottom: 20,
        marginLeft: 5,
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    genre: {
        fontFamily: 'Montserrat',
        padding: 3,
        paddingLeft: 8,
        paddingRight: 8,
        marginRight: 3,
        marginTop: 3,
        borderColor: '#6d6d6d',
        borderRadius: 4,
        borderWidth: 0.5,
        marginRight: 3,
        fontSize: 12,
        color: '#6d6d6d'
    },
    text_container_reduce: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '95%',

    },
    title_container:{
        width:'100%',
        flex:1,
        justifyContent: 'space-between',
        position:'relative'
    },
    title_text: {
        fontSize: 25,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 15,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'left',
        fontFamily: 'Montserrat-Bold',
        width: '80%',
    },
    description_text: {
        color: '#a4a5a5',
        margin: 5,
        marginBottom: 15,
        fontFamily: 'Montserrat',
        textAlign: 'justify',
        lineHeight: 25,
    },
    default_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        fontFamily: 'Montserrat',
    },
    favorite_container: {
        alignItems: 'center',
        position:'absolute',
        top:20,
        right:10,
        width: '7%',
        aspectRatio:1/1,
        height: 'auto'
    },
    favotire_image: {
        width:'100%',
        height:'100%'
        
    }
})

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

export default connect(mapStateToProps)(FilmDetail)

