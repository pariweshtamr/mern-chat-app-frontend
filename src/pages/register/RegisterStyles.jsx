import styled from "styled-components"

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #f6f6f6;
    padding: 0.5rem;

    .form-inputs {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      input {
        padding: 1rem;
        border: none;
        background: transparent;
        border-bottom: 1px solid #84bae6;
        color: #000;
        width: 100%;
        font-size: 1rem;
        &::placeholder {
          letter-spacing: 1px;
          color: rgb(175, 175, 175);
        }
        &:focus {
          outline: none;
        }
      }
      label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;

        img {
          width: 10%;
        }

        span {
          font-size: 14px;
          color: #2679bc;
          text-transform: none;
        }
      }

      .passContainer {
        position: relative;

        .showHidePass {
          position: absolute;
          top: 0;
          right: 1rem;
          transform: translateY(130%);
          cursor: pointer;
        }
      }
    }

    button {
      background: linear-gradient(90deg, #0b67b5, #2679bc, #438ccb);
      color: #fff;
      padding: 1.2rem 2rem;
      border-radius: 50px;
      border: none;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease;
      letter-spacing: 2px;
      cursor: pointer;
      margin-top: 1rem;
      &:hover {
        background: linear-gradient(90deg, #2cbdac, #2ec6a2, #31c9a2);
        transition: 0.5s ease all;
      }
    }
    .form-footer {
      color: #000;
      font-size: 14px;
      font-weight: 400;
      text-transform: uppercase;
      text-align: center;
      letter-spacing: 1px;
      a {
        color: #2679bc;
        text-decoration: none;
        font-weight: bold;
        font-size: 14px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`
