import styled from "styled-components"

export const SideDrawerStyles = styled.div`
  .searchContainer {
    padding: 10px;
    position: relative;
    svg {
      position: absolute;
      top: 50%;
      left: 10%;
      color: gray;
      transform: translateY(-50%);
    }
    input {
      background: #000;
      width: 100%;
      border-radius: 50px;
      padding: 5px 45px;
      border: none;
      color: #000;
      outline: none;

      &::placeholder {
        color: gray;
      }
    }
  }
`
