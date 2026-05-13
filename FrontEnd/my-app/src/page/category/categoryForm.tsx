import { useEffect } from "react";
import { Button, Form, Input, InputNumber, Modal, message } from "antd";
import { addCategory, editCategory, type CategoryData, type CategoryRowData } from "../../api/category";

export interface CategoryFormProps {
  visible: boolean;
  title: string;
  hideModal: () => void;
  loadData: () => void;
  mode: "add" | "edit";
  currentType: number;
  currentData: Partial<CategoryRowData>;
}

interface CategoryFormValue {
  name: string;
  sort: number;
}

function CategoryForm(props: CategoryFormProps) {
  const { visible, title, hideModal, loadData, mode, currentType, currentData } = props;
  const [form] = Form.useForm<CategoryFormValue>();

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (mode === "add") {
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      name: currentData.name,
      sort: currentData.sort,
    });
  }, [visible, mode, currentData, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const submitData: CategoryData = {
      id: mode === "edit" ? Number(currentData.id) : undefined,
      type: currentType,
      name: values.name,
      sort: Number(values.sort),
    };

    const request = mode === "edit" ? editCategory(submitData) : addCategory(submitData);
    const { data } = await request;
    message.success(data || "Saved successfully.");
    hideModal();
    loadData();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={hideModal}
      width={760}
      destroyOnClose
      footer={[
        <Button key="cancel" className="modal-btn-dark" onClick={hideModal}>
          Cancel
        </Button>,
        <Button key="ok" type="primary" className="modal-btn-yellow" onClick={handleOk}>
          Confirm
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" style={{ maxWidth: 460 }}>
        <Form.Item label="Category Name" name="name" rules={[{ required: true, message: "Please input category name." }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Sort" name="sort" rules={[{ required: true, message: "Please input sort." }]}>
          <InputNumber min={1} precision={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CategoryForm;
