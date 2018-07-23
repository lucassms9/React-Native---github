import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  ScrollView

} from 'react-native';

import Repo from './components/Repo';
import NewRepoModal from './components/NewRepoModal';

export default class App extends Component {

  state = {
    modalVisible:false,
    repos: [],

  };

  async componentDidMount(){

    const repos = JSON.parse(await AsyncStorage.getItem('@Minicurso:repositories')) || [];
    this.setState({
      repos
    });
  }
  _addRepository = async (newRepoText) => {

    const repoCall = await fetch(`http://api.github.com/repos/${newRepoText}`);
    const response = await repoCall.json();


    const repository = {

      id: response.id,
      thumbnail: response.owner.avatar_url,
      title: response.name,
      author: response.owner.login,
      
    }

    this.setState({
      modalVisible: false,
      repos:[
        ...this.state.repos,
        repository
      ]
     
    })

    await AsyncStorage.setItem('@Minicurso:repositories', JSON.stringify(this.state.repos))

  }  

  render() {
    return (
      <View style={styles.container}>
       
        <View style={styles.header}>
          <Text style={styles.headerText}>Mini curso GoNative</Text>
          <TouchableOpacity onPress={()=>{
            this.setState({modalVisible:true})
          }}>
            <Text style={styles.headerButton} >+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.repoList} >
          {this.state.repos.map((repo) => <Repo key={repo.id} data={repo} />)}
        </ScrollView>

        <NewRepoModal onAdd={this._addRepository} onCancel={()=>{

          this.setState({ modalVisible: false })

        }} visible={this.state.modalVisible} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },

  header: {
    height: 50,
    backgroundColor: '#FFF',
    paddingTop: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection:'row',
    paddingHorizontal: 20
  },

  headerButton: {
    fontSize:24,

    fontWeight:'bold'
  },
  headerText: {

    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'

  },

  repoList: {

    padding: 20,
    // backgroundColor: '#FFF',
  },

  repo: {

    padding: 20,
    backgroundColor: '#FFF',
    height: 120,
    marginBottom: 20,
    borderRadius: 5,

  }



});
