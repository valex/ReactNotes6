import React from 'react';
import _ from "lodash";
import { connect } from 'react-redux';
import { MapView } from 'expo';
import { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Text, View } from "react-native";
import SimpleButton from "./SimpleButton";

class NoteLocationsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Note Locations',
            headerLeft: (
                <SimpleButton
                    style={styles.navBarLeftButton}
                    textStyle={styles.navBarButtonText}
                    onPress={() => navigation.popToTop()}
                    customText='Back'
                />
            ),
            headerStyle:                styles.navBar,
            headerTitleStyle:           styles.navBarTitleText,
            //headerRightContainerStyle : styles.navBarRightButton
        };
    };

    _onSelectNote(note){
        this.props.navigation.navigate('Note',{
            note:note
        });
    }

    render(){
        return (
            <MapView
                showsUserLocation={true}
                style={styles.map}
                initialRegion={{
                    latitude: 47.7821002,
                    longitude: 35.2120276,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.040,
                }}
            >

                {
                    this.props.notes.filter((note)=>! _.isNil(note.location)).map(note => {
                        return (
                            <Marker
                                key = {note.id}
                                coordinate={note.location.coords}
                                // title={note.title}
                                // description={note.body}
                            >
                                <Callout onPress={this._onSelectNote.bind(this, note)}>
                                    <Text style={styles.bold}>{note.title}</Text>
                                    <Text style={[styles.italic, styles.gray]}>{note.body}</Text>
                                </Callout>
                            </Marker>
                        )})}

            </MapView>
        );
    }
}

var styles = StyleSheet.create({
    map:{
        flex:1,
        marginTop:0
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:60
    },
    noNotesText: {
        color: '#48209A',
        marginBottom: 10
    },
    bold:{
        fontWeight:'bold',
    },
    italic:{
        fontStyle:'italic'
    },
    gray:{
        color:'#AAAAAA'
    },
    simpleButton: {
        backgroundColor: '#5B29C1',
        borderColor: '#48209A',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 20,
        paddingVertical: 15,
        shadowColor: 'darkgrey',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.8,
        shadowRadius: 1,
    },
    simpleButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },

    navBar: {
        backgroundColor: '#5B29C1',
        borderBottomColor: '#48209A',
        borderBottomWidth: 1
    },
    navBarTitleText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginVertical: 16
    },
    navBarLeftButton: {
        paddingLeft: 10
    },
    navBarRightButton: {
        paddingRight: 10
    },
    navBarButtonText: {
        color: '#EEE',
        fontSize: 16,
        marginVertical: 16
    }
});

const mapStateToProps = state => {
    return {
        position: state.position,
        notes: _.toArray(state.notes)
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteLocationsScreen);