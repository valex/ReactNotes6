import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';

class NoteList extends React.Component{

    constructor(props){
        super(props);
    }

    _onPress(item){
        this.props.navigation.navigate('Note',{
            note:item
        });
    }

    render(){
        return(
            <FlatList
                keyExtractor={(item, index) => "list-item-"+index}
                data={this.props.notes}
                renderItem={
                    ({item}) => {
                        return(
                            <TouchableHighlight onPress={()=>this._onPress(item)}>
                                <Text>{item.title}</Text>
                            </TouchableHighlight>
                        );
                    }
                }
            />
        );
    }
}

// withNavigation returns a component that wraps NoteList and passes in the
// navigation prop
export default withNavigation(NoteList);