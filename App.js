import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from "./App/Components/HomeScreen";
import NoteScreen from "./App/Components/NoteScreen";
import NoteLocationsScreen from "./App/Components/NoteLocationsScreen";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {fetchNotes, fetchPosition, fetchPositionSuccess} from './App/Actions/noteActions'
import reducersApp from './App/Reducers/Note';
import { Constants, Location, Permissions } from 'expo';
import _ from "lodash";

const store = createStore(
    reducersApp,
    applyMiddleware(thunkMiddleware)
);

class App extends React.Component {
    constructor(props){
        super(props);

        this.locationPromise = null;

        store.dispatch(fetchNotes());
        //store.dispatch(fetchPosition());
    }

    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            console.log('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
        } else {
            this._watchPositionAsync();
        }
        // navigator.geolocation.watchPosition(
        //     (lastPosition) => {
        //         console.log({lastPosition})
        //     },
        //     (error) => {console.log('watchPosition error: ', error)}
        // );
    }

    componentWillUnmount() {
        if(!_.isNil(this.locationPromise)){
            this.locationPromise.remove();
        }
    }

    _watchPositionAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }

        // navigator.geolocation.watchPosition(
        //     (lastPosition) => {
        //         console.log({lastPosition})
        //     },
        //     (error) => {console.log('watchPosition error: ', error)}
        // );

        // let location = await Location.getCurrentPositionAsync({});
        // this.setState({ location });

        this.locationPromise = await Location.watchPositionAsync({}, (position)=>{
            store.dispatch(fetchPositionSuccess(position));
        });
    };

    render() {
        return (
            <Provider store={store}>
                <AppNavigator />
            </Provider>
        );
    }
}

const AppNavigator = createStackNavigator(
    {
        Home: {
            screen: HomeScreen
        },
        Note: {
            screen: NoteScreen,
            navigationOptions : ({ navigation }) => {
                let note = navigation.getParam('note');
                if( ! _.isNil(note) && note.title) {
                    return {
                        headerTitle: `${note.title}`,
                    }
                }
            },
        },
        NoteLocations:{
            screen: NoteLocationsScreen,
        }
    },
    {
        initialRouteName: 'Home',
    }
);

export default App;
