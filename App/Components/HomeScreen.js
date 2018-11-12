import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SimpleButton from "./SimpleButton";
import { connect } from 'react-redux';
import NoteListContainer from "./NoteListContainer"
import _ from "lodash";
import {createNoteSuccess} from "../Actions/noteActions";

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'React Notes',
            headerLeft: (
                <SimpleButton
                    style={styles.navBarLeftButton}
                    textStyle={styles.navBarButtonText}
                    onPress={() => navigation.push('NoteLocations',{

                    })}
                    customText='Map'
                />
            ),
            headerRight: (
                <SimpleButton
                    style={styles.navBarRightButton}
                    textStyle={styles.navBarButtonText}
                    onPress = {() => navigation.state.params.onClickCreateNote()}
                    customText='Create Note'
                />
            ),
            headerStyle:                styles.navBar,
            headerTitleStyle:           styles.navBarTitleText,
            //headerRightContainerStyle : styles.navBarRightButton
        };
    };

    componentDidMount() {
        this.props.navigation.setParams({
            onClickCreateNote: this.props.onClickCreateNote
        });
    }

    render () {
        const navigation = this.props.navigation;

        return (
            <View style={styles.container}>
                {
                    (this.props.notes.length > 0) ?

                        <NoteListContainer />

                        :

                        <View>
                            <Text style={styles.noNotesText}>You have not created any notes!</Text>
                            <SimpleButton
                                style={styles.simpleButton}
                                textStyle={styles.simpleButtonText}
                                customText='Create Note'
                                onPress={this.props.onClickCreateNote}/>
                        </View>
                }
            </View>
        );
    }
}

var styles = StyleSheet.create({
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
        notes: _.toArray(state.notes)
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClickCreateNote: () => {
            const newNoteId = new Date().getTime();
            dispatch(createNoteSuccess(newNoteId));

            ownProps.navigation.navigate('Note',{
               note:{
                   id: newNoteId,
                   title: ''
               }
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);