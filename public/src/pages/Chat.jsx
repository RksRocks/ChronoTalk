import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host, timerRoute } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import AiChatContainer from "../components/AiChatContainer";
import TimerDisplay from "../components/TimerDisplay";
export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [timeSpent, setTimeSpent] = useState(0);
  const [Intervals, setIntervals] = useState(0);
  const intervalRef = useRef();
  const [changer, setChanger] = useState(0);
  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);

      const checkUserTime = async () => {
        const { data } = await axios.get(
          `${timerRoute}/time/${currentUser._id}`
        );
        if (data.timeSpent >= 3600) {
          alert("You have reached your time limit for today.");
          navigate("/login");
        } else {
          setTimeSpent(data.timeSpent);
          startTimer();
        }
      };

      checkUserTime();
    }
  }, [currentUser]);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimeSpent((prev) => {
        const newTime = prev + 1;
        if (newTime >= 3600) {
          clearInterval(intervalRef.current);
          alert("You have reached your time limit for today.");
          navigate("/login");
        }
        return newTime;
      });
    }, 1000);
  };

  useEffect(async () => {
    if (changer === 0) {
      return;
    }
    await axios.post(
      `${timerRoute}/update-time/${
        JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
          ._id
      }`,
      {
        timeSpent,
      }
    );
  }, [changer]);

  const stopTimer = async () => {
    setChanger(Math.random() * 10);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    window.addEventListener("focus", startTimer);
    window.addEventListener("blur", stopTimer);
    window.addEventListener("beforeunload", stopTimer);

    return () => {
      window.removeEventListener("focus", startTimer);
      window.removeEventListener("blur", stopTimer);
      window.removeEventListener("beforeunload", stopTimer);
    };
  }, []);

  useEffect(() => {
    setIntervals((prv) => prv + 1);
    const updateTimer = async () => {
      if (currentUser) {
        await axios.post(`${timerRoute}/update-time/${currentUser._id}`, {
          timeSpent,
        });
      }
    };
    if (Intervals === 60) {
      setIntervals(0);
      updateTimer();
    }
  }, [timeSpent]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <Container>
        <TimerDisplay timeSpent={timeSpent} />
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : currentChat === "AI" ? (
            <AiChatContainer />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #0c0c0c;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    gap: 10px;

    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
