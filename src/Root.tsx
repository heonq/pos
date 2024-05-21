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
`;

export default function Root() {
  return (
    <>
      <GlobalStyle />
      <Outlet />
    </>
  );
}
