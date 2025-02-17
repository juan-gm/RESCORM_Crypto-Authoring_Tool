import React, { Component } from 'react';
import Config from './Config';
import InfoModal from './InfoModal';
import './App.css';
import {generatePackage} from './generatePackage';
import i18n from './locales/i18n';

class App extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      title: i18n.t("title"),
      showUsername: false,
      timeout: 0,
      tip: i18n.t("tip"),
      mode:"Caesar",
      extra_mode_info: 0,
      theme:"litera",
      good:"Enhorabuena, lo has logrado!!",
      bad:"Lo siento, se acabó tu tiempo",
      escapp: false,
      escappConfig: {
        endpoint:"https://escapp.dit.upm.es/api/escapeRooms/153",
        localStorageKey:"ESCAPP_Cypher",
        imagesPath:"assets/images/",
        I18n:{
          availableLocales:["es", "en"],
          locale:"es",
          defaultLocale:"es",
        },
        appPuzzleIds:[1],
        forceValidation:false,
      },
      puzzleId: 5,
      escapeRoomId: 1,
      puzzleLength: 4,
      scormVersion: "1.2",
      PUBLIC_URL: "./..",
      embeddedInEscapp: false, 
      ...window.state,
      template: null
    }

    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    return (
      <div className="App">
        {this.state.embeddedInEscapp ? null: <header id="appHeader">
          <button className="info" onClick={()=>{this.setState({showInfoModal: true})}}>
            <i className="material-icons">info</i>
          </button>
          <h1>
            <i className="material-icons">lock</i>{i18n.t("title")}
          </h1>
        </header>}
        <div className="content">
          <div className="content-col left">
			      <form action={this.state.action} method="POST" onSubmit={this.onSubmit}>
              <h1>{i18n.t(this.state.embeddedInEscapp ? "title":"settings")}</h1>
              <Config {...this.state} onConfigChange={(prop,value)=>{this.setState({[prop]:value}, this.preview)}}/>
              <div className="buttons">
                {this.state.embeddedInEscapp ? <button type="submit">
                  <i className="material-icons">cloud_upload</i>{i18n.t("save")}
                  </button> : null }
                <button type="button" onClick={this.download.bind(this)}>
                  <i className="material-icons">cloud_download</i>{i18n.t("download")}
                </button>
              </div>
              <input type="hidden" id="configInput" name="config" value=""></input>
            </form>
          </div>
          <div className="content-col right">
            <iframe id="visor" title="app" />
          </div>
        </div>
        <InfoModal show={this.state.showInfoModal} hide={()=>{this.setState({showInfoModal: false})}}/>
      </div>

    );
  }
  preview(){
    this.onloadend(this.state.template);
  }

  onSubmit(){
    const {title, showUsername, timeout, tip, mode, extra_mode_info, theme, good, bad, answer, escapp, escappConfig, puzzleId, escapeRoomId, puzzleLength, scormVersion, nonMetallic} = this.state;
    let newURL = escappConfig.endpoint.replace(/\d+/, String(escapeRoomId));
    escappConfig.endpoint = newURL;
    escappConfig.appPuzzleIds[0] = puzzleId;

    const config = {title, showUsername, timeout, tip, mode, extra_mode_info, theme, good, bad, answer, escapp, escappConfig, puzzleId, escapeRoomId, puzzleLength, scormVersion, nonMetallic};

    document.getElementById('configInput').value = JSON.stringify(config);

    return true;
  }
  onloadend(res) {
    let content = res.replace('<div id="root"></div>',`
      <div id='root'></div>
      <script>
        window._babelPolyfill = false;
        window.config=JSON.parse('${JSON.stringify({...this.state, preview: true, template:undefined, dev: true})}');
      </script>`)
    content = content.replace("bundle.js", process.env.PUBLIC_URL + "/scorm12/bundle.js")
    let el = document.getElementById('visor')
    el.contentWindow.document.open();
    el.contentWindow.document.write(content);
    el.contentWindow.document.close();
  }
  download() {
    generatePackage(this.state);
  }
  componentDidMount(){
    fetch(process.env.PUBLIC_URL + "/scorm12/index.html").then(res=>res.text()).then(response=>{
      this.setState({template: response});
      this.preview();
    })
  }

}

export default App;
