import { Layout, Menu } from "antd";
import { DashboardOutlined, SafetyOutlined } from "@ant-design/icons";
const { Header, Sider, Content, Footer } = Layout;
import type { MenuProps } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const items: MenuProps["items"] = [
  {
    key: "/",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/vulnerabilities",
    icon: <SafetyOutlined />,
    label: "Vulnerabilities",
  },
];

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>Managed Security Portal</Header>
      <Layout>
        <Sider>
          <Menu
            theme="dark"
            items={items}
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Content
          style={{
            padding: 24,
            minWidth: 0,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <Footer>© 2026 Managed Security Portal. All rights reserved.</Footer>
    </Layout>
  );
};

export default MainLayout;
