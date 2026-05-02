import { Button, Form, Input, Modal, Radio, message } from "antd";
import { useEffect } from "react";
import { addEmployee, editEmployee, type EmployeeData, type EmployeeRowData } from "../../api/employee";

interface EmployeeFormProps {
  visible: boolean;
  title: string;
  hideModal: () => void;
  loadData: () => void;
  mode: "add" | "edit";
  currentData: Partial<EmployeeRowData>;
}

interface EmployeeFormValues {
  username: string;
  name: string;
  phone: string;
  sex: number;
  idNumber: string;
}

const compactItemStyle = { marginBottom: 12 };

function EmployeeForm(props: EmployeeFormProps) {
  const { visible, title, hideModal, loadData, mode, currentData } = props;
  const [form] = Form.useForm<EmployeeFormValues>();

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (mode === "add") {
      form.resetFields();
      form.setFieldsValue({ sex: 1 });
      return;
    }

    form.setFieldsValue({
      username: currentData.username,
      name: currentData.name,
      phone: currentData.phone,
      sex: Number(currentData.sex ?? 1),
      idNumber: currentData.idNumber,
    });
  }, [visible, mode, currentData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const submitData: EmployeeData = {
        id: mode === "edit" ? Number(currentData.id) : undefined,
        username: values.username,
        name: values.name,
        phone: values.phone,
        sex: Number(values.sex),
        idNumber: values.idNumber,
      };

      const request = mode === "edit" ? editEmployee(submitData) : addEmployee(submitData);
      const { data } = await request;
      message.success(data || "Saved successfully.");
      hideModal();
      loadData();
    } catch (error: any) {
      message.destroy();
      message.warning(error?.message || "Save failed.");
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={hideModal}
      width={760}
      destroyOnClose
      styles={{ body: { paddingTop: 10, paddingBottom: 8 } }}
      footer={[
        <Button key="cancel" className="employee-modal-btn-dark" onClick={hideModal}>
          Cancel
        </Button>,
        <Button key="ok" type="primary" className="employee-modal-btn-yellow" onClick={handleOk}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="employee-form" style={{ maxWidth: 440 }}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input username." }]}
          style={compactItemStyle}
        >
          <Input placeholder="Please enter username" />
        </Form.Item>

        <Form.Item
          label="Employee Name"
          name="name"
          rules={[{ required: true, message: "Please input employee name." }]}
          style={compactItemStyle}
        >
          <Input placeholder="Please enter employee name" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          style={compactItemStyle}
        >
          <Input placeholder="Please enter phone" maxLength={11} />
        </Form.Item>

        <Form.Item label="Gender" name="sex" style={compactItemStyle}>
          <Radio.Group>
            <Radio value={1}>Male</Radio>
            <Radio value={0}>Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="ID Number"
          name="idNumber"
          rules={[{ required: true, message: "Please input ID number." }]}
          style={compactItemStyle}
        >
          <Input placeholder="Please enter ID number" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EmployeeForm;
