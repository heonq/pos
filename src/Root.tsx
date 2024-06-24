import React from 'react';
import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { useQueryClient } from '@tanstack/react-query';
import PretendardRegular from './fonts/Pretendard-Regular.otf';
import PretendardBold from './fonts/Pretendard-Bold.otf';

const GlobalStyle = createGlobalStyle`
	${reset}
	* {
		box-sizing: border-box;
    color:${(props) => props.theme.textColor};
	}

  @font-face {
    font-family : "Pretendard";
    src : url(${PretendardRegular});
    style:normal;
    font-weight:400;
  }

  @font-face {
    font-family : "Pretendard";
    src: url(${PretendardBold});
    style:normal;
    font-weight:800;
  }
	
body {
  overflow:hidden;
  font-family: "Pretendard";
  font-weight:400;
  font-size:14px;
}

a {
  text-decoration : none;
  color:inherit;
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
  font:inherit;
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
  const queryClient = useQueryClient();
  queryClient.setDefaultOptions({
    queries: {
      staleTime: Infinity,
    },
  });

  return (
    <>
      <GlobalStyle />
      <Outlet />
    </>
  );
}
