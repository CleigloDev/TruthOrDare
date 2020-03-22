import {Dimensions} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default fontSize = (size) => {
    return Math.abs((screenWidth*size)/414);
};