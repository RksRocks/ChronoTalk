import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import { allUsersRoute, host } from "../utils/APIRoutes";
import axios from "axios";
function AiChatContainer() {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  const handleSendMsg = async (msg) => {
    setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
    const res = await axios({
      url:
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
        process.env.REACT_APP_API_KEY,
      method: "POST",
      data: { contents: [{ parts: [{ text: msg }] }] },
    });
    setArrivalMessage({
      fromSelf: false,
      message: res.data.candidates[0].content.parts[0].text,
    });
    // setArrivalMessage({ fromSelf: false, message: res.data.msg });
  };
  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`https://api.multiavatar.com/4645646.svg`}
              alt="aiAvatar"
            />
          </div>
          <div className="username">
            <h3>AI</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>
                    {message.message.split("\n").map((msg, index) => (
                      <span>
                        {msg}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

export default AiChatContainer;

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  border-radius: 24px;
  background-color: #16052d;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: #f4ab4f;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #231239;
        color: #d62176;
        font-weight: bold;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #231239;
        color: #f4ab4f;
      }
    }
  }
`;
