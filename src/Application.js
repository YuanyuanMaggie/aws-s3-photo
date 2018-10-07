import React, { Component } from "react";
import "./Application.css";

import { Storage } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";

// Storage.configure({level: 'private'});

class S3Image extends Component {
  state = {
    src: null
  };

  async componentDidMount() {
    const { s3key } = this.props;
    const src = await Storage.get(s3key);
    this.setState({
      src
    });
  }

  render() {
    const { src } = this.state;
    if (!src) return null;
    return (
      <div style={{ width: "300px", display: "inline-block" }}>
        <img src={src} alt="file" style={{ width: "100%" }} />
      </div>
    );
  }
}

class Application extends Component {
  state = {
    files: []
  };

  async componentDidMount() {
    const files = await Storage.list("");
    this.setState({
      files
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    const file = this.fileInput.files[0];
    const { name } = file;

    // console.log(file, name);
    Storage.put(name, file).then(response => {
      this.setState({
        files: [...this.state.files, response]
      });
    });
  };

  render() {
    return (
      <div className="Application">
        <form className="NewItem" onSubmit={this.handleSubmit}>
          <input type="file" ref={input => (this.fileInput = input)} />
          <input className="full-width" type="submit" />
        </form>
        <section className="Application-images" />
        <section>
          {this.state.files.map(file => (
            <S3Image s3key={file.key} key={file.key} />
          ))}
        </section>
      </div>
    );
  }
}

export default withAuthenticator(Application);
