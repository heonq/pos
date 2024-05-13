import React from "react";
import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
	${reset}
	* {
		box-sizing: border-box;
	}
	
	a {
  text-decoration : none;
  color:inherit;
}

#root {
  display:flex;
  flex-direction:column;
  align-items:center;
}
`;

function Root() {
	return (
		<>
			<GlobalStyle />
			<Outlet />
		</>
	);
}

export default Root;
