import React, { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container take up the entire screen
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    paddingHorizontal: 20, // Add horizontal padding for better margins
  },
  title: {
    fontSize: 30, // Set a font size for the title
    fontWeight: 'bold', // Make the title bold
    marginBottom: 20, // Add some space below the title
  },
  error: {
    color: 'red', // Set the error message color to red
    fontSize: 14, // Set the font size for error messages
    marginBottom: 10, // Add some space below the error message
  },
  input: {
    height: 40, // Set the height of the input fields
    width: '100%', // Set the input width to 100% of its container
    borderColor: '#ccc', // Set a border color for the input fields
    borderWidth: 1, // Set the border width for the input fields
    borderRadius: 5, // Add rounded corners to the input fields
    paddingHorizontal: 10, // Add some horizontal padding to the input fields
    marginBottom: 15, // Add some space between input field
  },
});

export default styles;
