import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View, ViewPropTypes } from 'react-native';

class SimpleButton extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={this.props.style}>
                    <Text style={this.props.textStyle}>{this.props.customText || 'Simple  Button'}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

SimpleButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    customText: PropTypes.string,
    style: ViewPropTypes.style,
    textStyle: Text.propTypes.style
};

export default SimpleButton;