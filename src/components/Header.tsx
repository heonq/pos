import React, { useState } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { viewModeAtom } from "../atoms";
import { Link } from "react-router-dom";

const HeaderComponent = styled.header`
	display: flex;
	justify-content: space-between;
`;

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: row;
`;

const ExpandButtonContainer = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
`;

const HiddenButtonContainer = styled.div`
	display: flex;
	flex-direction: column;
	z-index: 500;
	top: 100%;
	position: absolute;
	box-shadow: ${(props) => props.theme.boxShadow};
	background-color: ${(props) => props.theme.elementBgColor};
	border-radius: ${(props) => props.theme.borderRadius};
	left: 3px;
	button {
		box-shadow: none;
		margin: 0;
	}
`;

const Button = styled.button`
	margin: 0 3px;
	width: 150px;
	line-height: 40px;
	border-radius: 6px;
	border-style: none;
	background-color: ${(props) => props.theme.elementBgColor};
	box-shadow: ${(props) => props.theme.boxShadow};
	cursor: pointer;
`;

const PaymentNumber = styled.div`
	width: 100px;
	line-height: 40px;
	border-style: none;
	box-shadow: ${(props) => props.theme.boxShadow};
	background-color: ${(props) => props.theme.elementBgColor};
	border-radius: ${(props) => props.theme.borderRadius};
	text-align: center;
`;

function ProductMenu() {
	return (
		<>
			<Link to="/product-registration">
				<Button>상품 등록</Button>
			</Link>
			<Link to="/product-management">
				<Button>상품 관리</Button>
			</Link>
			<Link to="/category-registration">
				<Button>카테고리 등록</Button>
			</Link>
			<Link to="/category-management">
				<Button>카테고리 관리</Button>
			</Link>
		</>
	);
}

function HeaderButtons() {
	return (
		<>
			<Link to="sales-history">
				<Button>판매내역</Button>
			</Link>
			<Link to="cash-check">
				<Button>현금점검</Button>
			</Link>
			<Link to="sales-statistics">
				<Button>판매통계</Button>
			</Link>
		</>
	);
}

export default function Header() {
	const [showViewModeMenu, setShowViewModeMenu] = useState(false);
	const [showProductMenu, setShowProductMenu] = useState(false);
	const viewMode = useRecoilValue(viewModeAtom);

	const onViewModeClick = () => {
		setShowViewModeMenu((current) => !current);
		setShowProductMenu(false);
	};
	const onProductMenuClick = () => {
		setShowProductMenu((current) => !current);
		setShowViewModeMenu(false);
	};
	return (
		<>
			<HeaderComponent>
				<ExpandButtonContainer>
					<Button onClick={onViewModeClick}>
						{viewMode === "category" ? "카테고리 보기" : "전체보기"}
					</Button>
					{showViewModeMenu ? (
						<HiddenButtonContainer>
							<Button>카테고리 보기</Button>
							<Button>전체보기</Button>
						</HiddenButtonContainer>
					) : null}
				</ExpandButtonContainer>
				<ButtonsContainer>
					<ExpandButtonContainer>
						<Button onClick={onProductMenuClick}>상품관리 메뉴</Button>
						{showProductMenu ? (
							<HiddenButtonContainer>
								<ProductMenu />
							</HiddenButtonContainer>
						) : null}
					</ExpandButtonContainer>
					<HeaderButtons />
				</ButtonsContainer>
				<PaymentNumber>판매번호</PaymentNumber>
			</HeaderComponent>
		</>
	);
}
