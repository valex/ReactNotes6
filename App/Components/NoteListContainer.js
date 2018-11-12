import { connect } from 'react-redux';
import NoteList from './NoteList';
import _ from "lodash";

const getVisibleNotes = (notes) => {
    return _.toArray(notes);
};

const mapStateToProps = state => {
    return {
        notes: getVisibleNotes(state.notes)
    };
};

const mapDispatchToProps = dispatch => {
    return {

    }
};

const NoteListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NoteList);

export default NoteListContainer;

