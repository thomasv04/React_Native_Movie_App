// Components/FilmItem.js

import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import {getImageFromApi} from '../API/TMDBApi'
import moment from 'moment'

class FilmItem extends React.Component {

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


    render() {
        const {film, displayDetailForFilm} = this.props
        return (
            <TouchableOpacity onPress={() => displayDetailForFilm(film.id)} style={styles.main_container}>
                <View style={styles.image_container}>
                    <Image
                        style={styles.image}
                        source={{ uri: getImageFromApi(film.poster_path, 500) }}
                    />
                </View>
                <View style={styles.content_container}>
                    <View style={styles.header_container}>
                        <Text style={styles.title_text}>{film.title}</Text>
                        
                        
                    </View>
                    <View style={styles.star_container}>{this._renderStars(film.vote_average)}<Text style={styles.rating}>{film.vote_average}</Text></View>
                    <View style={styles.description_container}>
                        <Text style={styles.description_text} numberOfLines={3}>{film.overview}</Text>
                        {/* La propriété numberOfLines permet de couper un texte si celui-ci est trop long, il suffit de définir un nombre maximum de ligne */}
                    </View>
                    <View style={styles.date_container}>
                        <Text style={styles.date_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flexDirection: 'row',
        width: '90%',
        marginTop: 40,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 7,
        padding:5,
        justifyContent: 'space-between',
        alignItems:  'flex-end',
        position: 'relative',

    },
    star_container: {
        marginTop: 5,
        marginBottom: 5,
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: 15,
    },
    star: {
        width: 15,
        height: 15,
        marginRight: 5
    },
    rating: {
        fontFamily: 'Montserrat-Bold',
        marginLeft: 10,
        fontSize: 17,
        marginTop: 'auto',
        lineHeight: 17,
        color: 'white'
    },
    image_container: {
        width: '25%',
        aspectRatio:2/3,
        marginRight: 15,
        marginTop:0,
        marginLeft:0,
        backgroundColor: 'grey',
        elevation:20,
        borderRadius: 10,
        overflow: 'hidden',
    },
    image:{
        width: '100%',
        height: '100%',
    },
    content_container: {
        margin: 5,
        height: '100%',
        width: '70%',

    },
    header_container: {
        flex: 3,
        flexDirection: 'row',
        elevation: 3,
    },
    title_text: {
        fontSize: 20,
        flex: 1,
        flexWrap: 'wrap',
        paddingRight: 5,
        marginTop:5,
        fontFamily: 'Montserrat-Bold',
        color: '#5d5d5d'
    },
    vote_text: {
        fontSize: 26,
        color: '#666666',
        fontFamily: 'Montserrat-Bold',
    },
    description_container: {
        flex: 7,
        elevation: 3,
        overflow: 'hidden',
        marginTop:10,
    },
    description_text: {
        color: '#666666',
        fontFamily: 'Montserrat',
    },
    date_container: {
        flex: 1,

    },
    date_text: {
        textAlign: 'left',
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Montserrat-Bold',
    }
})

export default FilmItem