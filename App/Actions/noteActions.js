import {
    CREATE_NOTE,
    CREATE_NOTE_SUCCESS,
    UPDATE_NOTE,
    DELETE_NOTE,
    DELETE_NOTE_SUCCESS,
    FETCH_NOTES_REQUEST,
    RECEIVE_NOTES, UPDATE_NOTE_SUCCESS, UPDATE_NOTE_IN_STORE, FETCH_POSITION_REQUEST, FETCH_POSITION_SUCCESS
} from '../Constants/actionTypes';

import _ from "lodash";
import {AsyncStorage} from "react-native";

function requestNotes() {
    return {
        type: FETCH_NOTES_REQUEST
    }
}

function requestPosition() {
    return {
        type: FETCH_POSITION_REQUEST
    }
}


function receiveNotes({notes}) {
    return {
        type: RECEIVE_NOTES,
        notes: notes,
        receivedAt: Date.now()
    }
}

export function fetchPosition() {
    return function(dispatch) {

        dispatch(requestPosition());

        return navigator.geolocation.getCurrentPosition(
            (initialPosition) => {
                dispatch(fetchPositionSuccess(initialPosition))
            },
            error => console.log('fetchPosition error: ', error)
        )
    }
}

export function fetchPositionSuccess(position) {
    return {
        type: FETCH_POSITION_SUCCESS,
        payload:{
            position
        }
    };
}

// https://redux.js.org/advanced/asyncactions#actions-js-asynchronous
export function fetchNotes() {
    return function(dispatch) {

        dispatch(requestNotes());

        return AsyncStorage.getItem("@ReactNotes:notes")
            .then(
                result => {
                    return JSON.parse(result);
                },
                error => console.log('An error occurred.', error)
            )
            .then(
                result => {
                    dispatch(receiveNotes(result))
                }
            )
    };
}

export function createNoteSuccess(id) {
    return {
        type: CREATE_NOTE_SUCCESS,
        payload:{
            id: id
        }
    };
}

export function updateNote(id, title, body) {
    return function(dispatch, getState) {

        const state = getState();

        let newNotes = Object.assign({}, state.notes);
        let newNote = {};

        if(_.isNil(newNotes[id])) { // if new note
            newNote = {
                id : id,
                isSaved : true,
                title : title,
                body : body,
            };
        }else{// note already exist
            newNote = Object.assign(newNote, newNotes[id], {
                title : title,
                body : body,
            });
        }

        if(!_.isNil(state.position)){
            if(_.isNil(newNotes[id])){ // if new note
                // console.log('add location for new note');
                newNote['location'] = Object.assign({}, state.position);
            }else if(_.isNil(newNotes[id]['location'])){// note already exist but location does not exist
                // console.log('add location for exist note');
                newNote['location'] = Object.assign({}, state.position);
            }
        }

        newNotes[id] = newNote;

        return AsyncStorage.setItem("@ReactNotes:notes", JSON.stringify({notes: newNotes}))
            .then(
                result => dispatch(updateNoteSuccess(newNote)),
                error => console.log('An error occurred.', error)
            )
    }
}

export function updateNoteSuccess(note) {
    return {
        type: UPDATE_NOTE_SUCCESS,
        payload:{
            note
        }
    };
}

export function updateNoteInStore(id, title, body) {
    return {
        type: UPDATE_NOTE_IN_STORE,
        payload:{
            id,
            title,
            body
        }
    };
}

export function deleteNote(id) {
    return function(dispatch, getState) {

        const { notes } = getState();

        let newNotes = Object.assign({}, notes);
        delete newNotes[id];

        return AsyncStorage.setItem("@ReactNotes:notes", JSON.stringify({notes: newNotes}))
            .then(
                result => dispatch(deleteNoteSuccess(id)),
                error => console.log('An error occurred.', error)
            )
    }
}

export function deleteNoteSuccess(id) {
    return {
        type: DELETE_NOTE_SUCCESS,
        payload:{
            id
        }
    };
}