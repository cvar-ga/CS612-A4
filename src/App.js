import logo from './logo.svg';
import './App.css';
import React from 'react';


import axios from 'axios';

//xml file reader
import XMLParser from 'react-xml-parser';
import XMLData from './blog_posts.xml'

class App extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        listOfPosts: [],
        error: null,
        isLoaded: false,
        news: []
              }

      }
    async componentDidMount() {
     //get data request
      axios.get(XMLData, {
        "Content-Type": "application/xml; charset=utf-8"
       }).then(res =>
        {
        //Storing users detail in state array object
        const jsonDataFromXml = new XMLParser().parseFromString(res.data);
        var posts = jsonDataFromXml.getElementsByTagName('post');
        var postsJson = [];
        for (var i = 0; i < posts.length; i++){
          var summary = jsonDataFromXml.getElementsByTagName('summary')[i];
          var text = summary.getElementsByTagName('text');
          var image_path = summary.getElementsByTagName('image_path');
          postsJson.push({
            title: jsonDataFromXml.getElementsByTagName('title')[i].value,
            author: jsonDataFromXml.getElementsByTagName('author')[i].value,
            date: jsonDataFromXml.getElementsByTagName('date')[i].value,
            text: text[0].value,
            image_path: image_path[0].value,
            body: jsonDataFromXml.getElementsByTagName('body')[i].value
          });
        }
        this.setState({listOfPosts: postsJson});
           });

           fetch("https://api.nytimes.com/svc/topstories/v2/home.json?api-key=KEY_HERE")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              news: result.results
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          })
           try{
             setInterval(async () => {
                fetch("https://api.nytimes.com/svc/topstories/v2/home.json?api-key=KEY_HERE")
             .then(res => res.json())
             .then(
               (result) => {
                 this.setState({
                   isLoaded: true,
                   news: result.results
                 });
               },
               // Note: it's important to handle errors here
               // instead of a catch() block so that we don't swallow
               // exceptions from actual bugs in components.
               (error) => {
                 this.setState({
                   isLoaded: true,
                   error
                 });
               }
             )
           }, 60000);

         }catch(e){
           console.log(e);
         }
         console.log(this.state.news);
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1><font color="white">Charles Varga's (other) blog</font></h1>
          {(
        this.state.listOfPosts.map((item, index) => {
          console.log(index);
          return (
            <div>
            <h2><font color="white"><a className="App-link" href={"#" + index}>{item.title}</a></font></h2>
            <h3><font color="white">{item.text}</font></h3>
            <img width="50px" height="auto" src={item.image_path}></img>
            </div>
          )
          }
        ))}
        </header>
        <div className="flex-container">
        <main>
          {(
        this.state.listOfPosts.map((item, index) => {
          console.log(index);
          return (
            <div id={index}>
            <h1><font color="white"><a className="App-link" href={"#" + index}>{item.title}</a></font></h1>
            <h2>By {item.author}</h2>
            <h3>Written {item.date}</h3>
            <h4>{item.text}</h4>
            <img width="500px" height="auto" src={item.image_path}></img>
            <p>{item.body}</p>
            </div>
          )
          }
        ))}

        </main>
        <nav>
        {(
          this.state.news.map((item, index) => {
            if (this.state.error) {
              return <div>Error: {this.state.error.message}</div>;
            } else if (!(this.state.isLoaded)) {
              return <div>Loading...</div>;
            } else {
              return (
                <ul>
                  <li key={item.id}>
                  <a className="App-link" href={item.url}>{item.title}</a>
                  </li>
                </ul>
              );
            }
          })
        )}
        </nav>
        </div>
        <footer className="App-footer">
        Copyright (c) 2022 Charles Varga. All rights reserved.
        </footer>
        </div>
    );
};
}

export default App;
