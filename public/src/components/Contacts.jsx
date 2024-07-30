import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo-no-background.png";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
          </div>
          <div className="contacts">
            <div
              className={`contact ${
                currentSelected === "AI" ? "selected" : ""
              }`}
              onClick={() => {
                setCurrentSelected("AI");
                changeChat("AI");
              }}
              // onClick={() => changeCurrentChat(index, contact)}
            >
              <div className="avatar">
                <img src={`https://api.multiavatar.com/4645646.svg`} alt="" />
              </div>
              <div className="username">
                <h3>AI</h3>
              </div>
            </div>
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  border-radius: 20px;
  background-color: #231239;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    border-radius: 24px;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff14;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.3s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: #d62176;
        }
      }
    }
    .selected {
      background-color: #f4ab4f;
    }
  }

  .current-user {
    background-color: #16052d;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    height: 4rem;
    align-self: end;
    padding: 25px 0px;

    .avatar {
      img {
        height: 2.8rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: #f4ab4f;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
    @media screen and (max-width: 720px) {
      height: 4rem;
      .username {
        h2 {
          display: none;
        }
      }
    }
  }
`;
