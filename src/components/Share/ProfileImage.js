import React, { Component } from 'react';
import Dropdown, { DropdownContent, DropdownTrigger } from 'react-simple-dropdown';
import Avatar from 'react-avatar';
import { withWebId, withAuthorization } from '@inrupt/solid-react-components';
import data from '@solid/query-ldflex';
import styled from "styled-components";
import auth from "solid-auth-client";

export const ImageContainer = styled.ul`
  width: 60px;
  margin-top: 9px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #FFF;
  border-radius: 0 0 5px 5px;
  cursor: pointer;
  padding: 8px;
  background-color: #303136;
`;

class ProfileImage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      profilePhoto: '',
      name: ''
    }
  }

  async componentDidMount() {
    if (this.props.webId) {
      await this.fetchProfilePhoto();
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.webId && this.props.webId !== prevProps.webId) {
      await this.fetchProfilePhoto();
    }
  }

  async fetchProfilePhoto() {
    const photo = await data.user.image || await data.user.vcard_hasPhoto;
    const name = await data.user.name;
    this.setState({ profilePhoto: photo.value, name: name.value });
  }

  async logout() {
    try {
      await auth.logout();
      // Remove localStorage
      localStorage.removeItem("solid-auth-client");
      // Redirect to login page
      this.props.history.push("/login");
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  render() {
    return (
      <Dropdown style={{ position: 'relative' }}>
        <DropdownTrigger style={{ cursor: 'pointer' }}>
          <Avatar name={this.state.name} src={this.state.profilePhoto} round size={30} />
        </DropdownTrigger>
        <DropdownContent style={{ right: 0 }}>
          <ImageContainer>
            <li onClick={this.logout}>Log Out</li>
          </ImageContainer>
        </DropdownContent>
    </Dropdown>
    );
  }
}

export default withAuthorization(withWebId(ProfileImage));
