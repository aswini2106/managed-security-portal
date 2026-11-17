import { Card, Col, Progress, Row, Statistic, Typography } from "antd";
import {
  BugOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  return (
    <div>
      <Typography.Title level={2}>Security Overview</Typography.Title>
      <Typography.Text type="secondary" style={{ fontSize: 14 }}>
        (Demo Data)
      </Typography.Text>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Vulnerabilities"
              value={1124}
              styles={{ content: { color: "#3b82f6" } }}
              prefix={<BugOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="High Priority"
              value={32}
              styles={{ content: { color: "#ef4444" } }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Open Issues"
              value={80}
              styles={{ content: { color: "#f59e0b" } }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Resolved"
              value={645}
              styles={{ content: { color: "#22c55e" } }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Card title="Security Risk Distribution" style={{ marginTop: 24 }}>
        <p>High Priority</p>
        <Progress percent={50} strokeColor="#ef4444" />

        <p>Medium Priority</p>
        <Progress percent={30} strokeColor="#f59e0b" />

        <p>Low Priority</p>
        <Progress percent={20} strokeColor="#22c55e" />
      </Card>
    </div>
  );
};

export default Dashboard;
