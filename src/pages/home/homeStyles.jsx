import styled from "styled-components"

export const HomeStyles = styled.div`
  height: 100vh;
  width: 100vw;
  background: url("/background.png");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  .box {
    margin: 160px auto 15px auto;

    @media screen and (max-width: 600px) {
      margin: 60px auto;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 1.5rem;
      .logoImg {
        height: 4.5rem;
      }
      .logoText {
        color: #000;
        font-weight: 500;
        font-size: 2rem;
        text-transform: uppercase;
        span {
          color: #2679bc;
          font-weight: 500;
        }
      }
    }
  }
`
