import styled, { css } from 'styled-components';

interface IContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored?: boolean;
}

export const Container = styled.div<IContainerProps>`
  display: flex;
  align-items: center;

  background: #fff;
  border-radius: 8px;
  border: 2px solid #fff;
  padding: 18px 24px;
  width: 100%;
  font-size: 16px;

  & + div {
    margin-top: 24px;
  }

  h1 {
    margin-bottom: 40px;
    font-weight: 600;
    font-size: 36px;
    line-height: 36px;
  }

  ${props =>
    props.isErrored &&
    css`
      border: 2px solid #c53030;
    `}

  ${props =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}

  ${props =>
    props.isFilled &&
    css`
      color: #ff9000;
    `}

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #b7b7cc;

    &::placeholder {
      color: #b7b7cc;
    }
  }

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled.div`
  color: #fff;
  position: relative;

  svg {
    margin-left: 18px;
    color: #c53030;
  }

  span {
    border-radius: 4px;
    position: absolute;
    background: #c53030;
    padding: 8px;
    font-size: 14px;
    font-weight: 500;
    width: 160px;
    text-align: center;
    bottom: calc(100% + 8px);
    left: calc(50% + 5px);
    transform: translateX(-50%);
    visibility: hidden;
    opacity: 0;
    transition: all 0.4s;

    &::before {
      content: '';
      position: absolute;
      top: 90%;
      background-color: #c53030;
      border: solid #c53030;
      border-width: 0 3px 3px 0;
      display: inline-block;
      padding: 2px;
      left: calc(50% - 9px);
      transform: translateX(-50%);
      transform: rotate(45deg);
    }
  }

  &:hover span {
    visibility: visible;
    opacity: 1;
  }
`;
