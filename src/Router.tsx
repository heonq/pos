import { createBrowserRouter } from "react-router-dom";
import Home from "./routes/home";
import Root from "./Root";
import ProductManagement from "./routes/modal-components/product-management";
import ProductRegistration from "./routes/modal-components/product-registration";
import CategoryRegistration from "./routes/modal-components/category-registration";
import CashCheck from "./routes/modal-components/cash-check";
import SalesStatistics from "./routes/modal-components/sales-statistics";
import CategoryManagement from "./routes/modal-components/category-management";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "",
				element: <Home />,
				children: [
					{
						path: "/product-registration",
						element: <ProductRegistration />,
					},
					{
						path: "/product-management",
						element: <ProductManagement />,
					},
					{
						path: "/category-registration",
						element: <CategoryRegistration />,
					},
					{
						path: "/category-management",
						element: <CategoryManagement />,
					},
					{
						path: "/sales-history",
						element: <CategoryRegistration />,
					},
					{
						path: "/cash-check",
						element: <CashCheck />,
					},
					{
						path: "/sales-statistics",
						element: <SalesStatistics />,
					},
				],
			},
		],
	},
]);
