import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import SimpleButton from "./SimpleButton";
import { connect } from 'react-redux';
import _ from "lodash";
import {deleteNote, updateNote, updateNoteInStore} from "../Actions/noteActions";

class NoteScreen extends React.Component {
    constructor(props){
        super(props);
    }

    static navigationOptions = ({ navigation }) => {
        let note = navigation.getParam('note');
        let opts = {
            headerTitle: 'Create Note',
            headerLeft: (
                <SimpleButton
                    style={styles.navBarLeftButton}
                    textStyle={styles.navBarButtonText}
                    onPress={() => navigation.pop()}
                    customText='Back'
                />
            ),
            headerStyle:                styles.navBar,
            headerTitleStyle:           styles.navBarTitleText,
            //headerLeftContainerStyle : styles.navBarLeftButton
        };

        if(note.isSaved){
            opts['headerRight'] = <SimpleButton
                style={styles.navBarRightButton}
                textStyle={styles.navBarButtonText}
                onPress={() => {navigation.state.params.onDeleteClick(note.id); navigation.popToTop();}}
                customText='Delete'
            />
        }
        return opts;
    };

    componentDidMount() {
        this.props.navigation.setParams({
            onDeleteClick: this.props.onDeleteClick
        });
    }

    componentWillUnmount(){

    }

    shouldComponentUpdate(nextProps, nextState) {
        if(_.isNil(nextProps.note))
            return false;

        return true;
    }

    _onEndEditing(){
        this.props._onEndEditing(this.props.note);
    }

    render () {
        return (

            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        autoFocus={true}
                        autoCapitalize="sentences"
                        placeholder="Untitled"
                        style={[styles.textInput, styles.title]}
                        underlineColorAndroid="transparent"
                        value={this.props.note.title}
                        onChangeText={(title)=>{this.props.onUpdateNote(this.props.note.id, title, this.props.note.body)}}
                        onEndEditing={(title)=>{this.refs.body.focus(); this._onEndEditing()}}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        ref="body"
                        multiline={true}
                        placeholder="Start typing"
                        style={[styles.textInput, styles.body]}
                        textAlignVertical="top"
                        underlineColorAndroid="transparent"
                        value={this.props.note.body}
                        onChangeText={(body)=>{this.props.onUpdateNote(this.props.note.id, this.props.note.title, body)}}
                        onEndEditing={(body)=>{this._onEndEditing()}}
                    />
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 64,
        padding: 20
    },
    title: {
        height: 40
    },
    body: {
        height: 250
    },
    inputContainer: {
        borderBottomColor: '#9E7CE3',
        borderBottomWidth: 1,
        flexDirection: 'row',
        marginBottom: 10
    },
    textInput: {
        flex: 1,
        fontSize: 16,
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

const mapStateToProps = (state, ownProps) => {
    const note = ownProps.navigation.getParam('note');
    const noteId = note.id;
    return {
        note: state.notes[noteId]
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onDeleteClick: id => {
            dispatch(deleteNote(id))
        },

        onUpdateNote: (id, title, body) => {
            dispatch(updateNoteInStore(id, title, body))
        },

        _onEndEditing: (note) => {
            if( ! _.isNil(note)){
                dispatch(updateNote(note.id, note.title, note.body))
            }
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteScreen);