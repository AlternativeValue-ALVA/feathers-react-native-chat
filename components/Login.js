'use strict';

import React, { Component } from 'react';
import {View, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, Alert, BackAndroid} from 'react-native';
import { Actions } from 'react-native-router-flux';
import baseStyles from '../baseStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import utils from '../utils';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.app = this.props.app;

    this.login = this.login.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      emailBorder: 'transparent',
      passwordBorder: 'transparent',
      email: '',
      password: '',
      loading: false
    }
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => Actions.pop());
  }

  login() {
    if (!utils.validateEmail(this.state.email) || !utils.validatePassword(this.state.password)) {
      Alert.alert('Error', 'Please enter a valid email or password.');
      return;
    }

    this.setState({loading: true});
    
    this.app.authenticate({
      type: 'local',
      email: this.state.email,
      password: this.state.password
    }).then(response => {
      this.setState({ loading: false });
      // re-route to chat app
      Actions.main();
    }).catch(error => {
      console.log('ERROR', error);
      Alert.alert('Error', 'Please enter a valid email or password.');
      this.setState({ loading: false });
      return;
    });
  }

  onChangeEmail(text) {
    this.setState({email: text});
    if (!utils.validateEmail(text)) {
      this.setState({
        emailBorder: '#FFC200'
      })
    } else {
      this.setState({
        emailBorder: 'transparent'
      })
    }
  }

  onChangePassword(text) {
    this.setState({password: text});
    if (!utils.validatePassword(text)) {
      this.setState({
        passwordBorder: '#FFC200'
      })
    } else {
      this.setState({
        passwordBorder: 'transparent'
      })
    }
  }

  _close() {
    this._dismissKeyboard();
    Actions.pop();
  }

  _dismissKeyboard(el) {
    TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField())
  }

  renderLoginButton() {
    if (this.state.loading) {
      return (
        <View style={{alignItems: 'center'}}>
          <Text>Logging in...</Text>
        </View>
      );
    }
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableHighlight style={[baseStyles.baseButton, baseStyles.buttonPrimary, {padding: 10}]} onPress={this.login} underlayColor="transparent">
          <Text style={[baseStyles.baseButtonText, baseStyles.buttonPrimaryText]}>Login</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this._dismissKeyboard.bind(this)}>
        <View style={baseStyles.container}>
          <TouchableHighlight onPress={this._close.bind(this)} underlayColor="transparent"
                              style={[baseStyles.backButtonContainer]}>
            <Icon name="close-round" size={30} color="#333"/>
          </TouchableHighlight>
          <Text style={baseStyles.welcomeText}>WELCOME BACK</Text>

          <View style={baseStyles.inputs}>
            <View style={baseStyles.inputContainer}>

              <TextInput
                style={[baseStyles.input, baseStyles.greyFont, {borderWidth: 1, borderColor: this.state.emailBorder}]}
                autoFocus={true}
                placeholder="Email"
                placeholderTextColor="#AAA"
                autoCorrect={false}
                autoCapitalize='none'
                keyBoardType='email-address'
                returnKeyType='next'
                value={this.state.email}
                onChangeText={this.onChangeEmail}
              />
            </View>
            <View style={baseStyles.inputContainer}>
              <TextInput
                secureTextEntry={true}
                style={[baseStyles.input, baseStyles.greyFont, {borderWidth: 1, borderColor: this.state.passwordBorder}]}
                placeholder="Password"
                placeholderTextColor="#AAA"
                autoCorrect={false}
                autoCapitalize='none'
                returnKeyType='send'
                value={this.state.password}
                onChangeText={this.onChangePassword}
              />
            </View>
            {this.renderLoginButton()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

}