import React from "react";
import styled from "styled-components";

export default function TimerDisplay({ timeSpent }) {
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <Container>
      <h2>Time Remaining: {formatTime(3600 - timeSpent)}</h2>
    </Container>
  );
}

const Container = styled.div`
  color: white;
  margin: 10px;
  text-align: center;
`;
