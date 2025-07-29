import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  nav {
    display: flex;
    gap: 1rem;
  }

  a {
    width: 3rem;
    height: 3rem;

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${(props) => props.theme["gray-100"]};

    border-top: 3px solid transparent; /* pra ele não subir a posição do icone no hover (se quiser tente comentar isso e veja) */
    border-bottom: 3px solid transparent;

    &:hover {
      border-bottom: 3px solid ${(props) => props.theme["green-500"]};
    }

    &.active {
      color: ${(props) => props.theme["green-500"]};
    }
  }

  svg {
    vertical-align: middle;
  }
`;
