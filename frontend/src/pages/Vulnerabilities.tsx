import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Popconfirm,
  Modal,
  Descriptions,
  message,
} from "antd";
import { Form } from "antd";
import type { TableColumnsType } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import type {
  Vulnerability,
  VulnerabilityFormValues,
  AutopassRecord,
} from "../types/vulnerability";
import {
  PRIORITY_COLORS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from "../constants";

const bridge = (window as any).bridge;
const workerPath = "/workers/autopass.js";
const requestList = () => {
  bridge.writeWorkerIPC(
    workerPath,
    JSON.stringify({
      action: "list",
      requestId: crypto.randomUUID(),
    }),
  );
};
const Vulnerabilities = () => {
  const [selectedVulnerability, setSelectedVulnerability] =
    useState<Vulnerability | null>(null);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [form] = Form.useForm<VulnerabilityFormValues>();
  const [editingVulnerability, setEditingVulnerability] =
    useState<Vulnerability | null>(null);
  const columns: TableColumnsType<Vulnerability> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: Vulnerability["priority"]) => (
        <Tag color={PRIORITY_COLORS[priority]}>{priority}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedVulnerability(record);
              setViewModalOpen(true);
            }}
          >
            View
          </Button>

          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditVulnerability(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete vulnerability?"
            description="Do you want to delete this vulnerability?"
            onConfirm={() => handleDeleteVulnerability(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="text" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (!bridge) return;
    const unsubscribe = bridge.onWorkerIPC(workerPath, (data: Uint8Array) => {
      const text = new TextDecoder().decode(data);
      if (text === "autopass-ready") {
        requestList();
        return;
      }
      try {
        const response = JSON.parse(text);
        if (response.action === "add" && response.success) {
          requestList();
          message.success("Vulnerability saved successfully");
        }
        if (response.action === "remove" && response.success) {
          requestList();
          message.success("Vulnerability deleted successfully");
        }
        if (response.success === false) {
          message.error(response.error || "Request failed");
        }
        if (response.action === "list" && response.success) {
          const parsed = response.records.map((record: AutopassRecord) =>
            JSON.parse(record.value),
          );
          const validRecords = parsed.filter(
            (item: Vulnerability) =>
              typeof item.id === "string" &&
              typeof item.title === "string" &&
              typeof item.priority === "string" &&
              typeof item.status === "string" &&
              typeof item.description === "string",
          );
          setVulnerabilities(validRecords);
        }
      } catch (error) {
        message.error("Unable to retrieve vulnerabilities");
      }
    });
    bridge
      .startWorker(workerPath)
      .then(() => {
        requestList();
        return;
      })
      .catch(console.error);
    return () => unsubscribe();
  }, []);

  const handleAddEditVulnerability = (values: VulnerabilityFormValues) => {
    if (editingVulnerability) {
      const updatedVulnerability = {
        ...editingVulnerability,
        ...values,
      };
      bridge.writeWorkerIPC(
        "/workers/autopass.js",
        JSON.stringify({
          action: "add",
          requestId: crypto.randomUUID(),
          key: editingVulnerability.id,
          value: JSON.stringify(updatedVulnerability),
        }),
      );
    } else {
      const newVulnerability = {
        id: crypto.randomUUID(),
        ...values,
      };

      bridge.writeWorkerIPC(
        "/workers/autopass.js",
        JSON.stringify({
          action: "add",
          requestId: crypto.randomUUID(),
          key: newVulnerability.id,
          value: JSON.stringify(newVulnerability),
        }),
      );
    }

    setEditingVulnerability(null);

    setFormModalOpen(false);
    form.resetFields();
  };

  const handleEditVulnerability = (record: Vulnerability) => {
    setEditingVulnerability(record);
    form.setFieldsValue(record);
    setFormModalOpen(true);
  };

  const handleDeleteVulnerability = (record: Vulnerability) => {
    bridge.writeWorkerIPC(
      "/workers/autopass.js",
      JSON.stringify({
        action: "remove",
        requestId: crypto.randomUUID(),
        key: record.id,
      }),
    );
  };

  const handleCloseModal = () => {
    setFormModalOpen(false);
    setEditingVulnerability(null);
    form.resetFields();
  };
  return (
    <div>
      <h2>Vulnerabilities</h2>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 20 }}
        onClick={() => {
          setEditingVulnerability(null);
          form.resetFields();
          setFormModalOpen(true);
        }}
      >
        Add Vulnerability
      </Button>
      <Table<Vulnerability>
        columns={columns}
        dataSource={vulnerabilities}
        rowKey="id"
      />

      <Modal
        title="Vulnerability Details"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Title">
            {selectedVulnerability?.title}
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            {selectedVulnerability?.priority}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            {selectedVulnerability?.status}
          </Descriptions.Item>

          <Descriptions.Item label="Description">
            {selectedVulnerability?.description}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <Modal
        title={
          editingVulnerability ? "Edit Vulnerability" : "Add Vulnerability"
        }
        open={formModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "Open" }}
          onFinish={handleAddEditVulnerability}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter a valid title",
              },
            ]}
          >
            <Input placeholder="Add title" />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[
              { required: true, message: "Please select a valid priority" },
            ]}
          >
            <Select placeholder="Select priority" options={PRIORITY_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[
              { required: true, message: "Please select a valid status" },
            ]}
          >
            <Select placeholder="Select status" options={STATUS_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter a valid description",
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Add Description" />
          </Form.Item>

          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCloseModal}>Cancel</Button>

            <Button type="primary" htmlType="submit">
              {editingVulnerability
                ? "Update Vulnerability"
                : "Add Vulnerability"}
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Vulnerabilities;
