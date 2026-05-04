import { Form, Input, InputNumber, Modal, Segmented } from "antd";
import { useEffect } from "react";

export interface CheckoutFormValues {
  diningMode: 1 | 2;
  tableNumber?: number;
  remark?: string;
}

interface CheckoutModalProps {
  open: boolean;
  totalPrice: number;
  confirmLoading: boolean;
  onCancel: () => void;
  onSubmit: (values: CheckoutFormValues) => Promise<void> | void;
}

function CheckoutModal({ open, totalPrice, confirmLoading, onCancel, onSubmit }: CheckoutModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        diningMode: 1,
        tableNumber: undefined,
        remark: "",
      });
    }
  }, [form, open]);

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit(values as CheckoutFormValues);
  };

  return (
    <Modal
      title="Checkout"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Place Order"
      confirmLoading={confirmLoading}
      className="menu-checkout-modal"
      cancelButtonProps={{ className: "menu-modal-cancel-btn" }}
      okButtonProps={{ className: "menu-modal-ok-btn" }}
    >
      <Form form={form} layout="vertical" initialValues={{ diningMode: 1 }}>
        <Form.Item label="Dining Mode" name="diningMode" rules={[{ required: true, message: "Please choose dining mode." }]}>
          <Segmented
            className="menu-dining-segmented"
            options={[
              { label: "Dine-in", value: 1 },
              { label: "Takeout", value: 2 },
            ]}
            block
          />
        </Form.Item>

        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const diningMode = getFieldValue("diningMode");
            if (diningMode !== 1) {
              return null;
            }
            return (
              <Form.Item label="Table Number" name="tableNumber" rules={[{ required: true, message: "Please enter table number." }]}>
                <InputNumber min={1} style={{ width: "100%" }} placeholder="Enter table number" />
              </Form.Item>
            );
          }}
        </Form.Item>

        <Form.Item label="Remark" name="remark">
          <Input.TextArea rows={3} placeholder="Optional note for this order" maxLength={200} />
        </Form.Item>

        <Form.Item label="Order Amount">
          <Input value={`€${totalPrice.toFixed(2)}`} disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CheckoutModal;
