import React from 'react';
import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
	${reset}
	* {
		box-sizing: border-box;
	}
	
	a {
  text-decoration : none;
  color:inherit;
}
body {
  overflow:hidden;
}

#root {
  display:flex;
  flex-direction:column;
  align-items:center;
  background-color: #f9fafc;
  min-height:100vh;
}

select {
  height: 25px;
    border-style: none;
    background-color: rgb(240, 240, 240);
    text-align: center;
    border-radius:5px;
}

button {
  cursor:pointer;
  border:none;
  border-radius:5px;
  &:hover {
    filter:brightness(0.9);
  }
  &:active {
    filter:brightness(0.8);
  }
}

`;

export default function Root() {
  return (
    <>
      <GlobalStyle />
      <Outlet />
    </>
  );
}
