import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  addDish,
  editDish,
  getDishCategoryList,
  uploadDishImage,
  type DishCategoryItem,
  type DishData,
  type DishRowData,
} from "../../api/dish";

const { Dragger } = Upload;
const compactItemStyle = { marginBottom: 12 };

export interface DishFormProps {
  visible: boolean;
  title: string;
  hideModal: () => void;
  loadData: () => void;
  mode: "add" | "edit";
  currentData: Partial<DishData & DishRowData>;
}

interface DishFormValues {
  name: string;
  categoryId: number;
  price: number;
  image: string;
  description?: string;
}

interface UploadResponseData {
  code: number;
  msg?: string;
  data?: string;
}

function DishForm(props: DishFormProps) {
  const { visible, title, hideModal, loadData, mode, currentData } = props;
  const [form] = Form.useForm<DishFormValues>();
  const [categoryList, setCategoryList] = useState<DishCategoryItem[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  const categoryOptions = useMemo(
    () => categoryList.filter((item) => item.status === 1).map((item) => ({ label: item.name, value: item.id })),
    [categoryList]
  );

  useEffect(() => {
    if (!visible) {
      return;
    }
    getDishCategoryList().then(({ data }) => {
      setCategoryList(data || []);
    });
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (mode === "add") {
      form.resetFields();
      setFileList([]);
      setImageUrl("");
      return;
    }

    form.setFieldsValue({
      name: currentData.name,
      categoryId: Number(currentData.categoryId),
      price: Number(currentData.price),
      image: currentData.image,
      description: currentData.description,
    });

    if (currentData.image) {
      setImageUrl(currentData.image);
      setFileList([
        {
          uid: "-1",
          name: "dish-image",
          status: "done",
          url: currentData.image,
        },
      ]);
    } else {
      setImageUrl("");
      setFileList([]);
    }
  }, [visible, mode, currentData, form]);

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const isValidType = file.type === "image/png" || file.type === "image/jpeg";
    if (!isValidType) {
      message.warning("Only PNG or JPEG files are allowed.");
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.warning("Image size must be less than 2MB.");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleRemoveImage = () => {
    form.setFieldsValue({ image: "" });
    setImageUrl("");
    setFileList([]);
  };

  const customUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const { code, data, msg } = (await uploadDishImage(file as File)) as UploadResponseData;
      if ((code === 1 || code === 0) && data) {
        setImageUrl(data);
        form.setFieldsValue({ image: data });
        setFileList([
          {
            uid: String(Date.now()),
            name: (file as File).name,
            status: "done",
            url: data,
          },
        ]);
        message.success("Image uploaded successfully.");
        onSuccess?.(data);
        return;
      }
      message.warning(msg || "Image upload failed.");
      onError?.(new Error(msg || "upload failed"));
    } catch (error: any) {
      message.warning(error?.message || "Image upload failed.");
      setImageUrl("");
      setFileList([]);
      onError?.(error as Error);
    }
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    if (!imageUrl) {
      message.warning("Please upload a dish image.");
      return;
    }

    const submitData: DishData = {
      id: mode === "edit" ? Number(currentData.id) : undefined,
      name: values.name,
      categoryId: Number(values.categoryId),
      price: Number(values.price),
      image: imageUrl,
      description: values.description || "",
      status: mode === "edit" ? Number(currentData.status ?? 0) : 0,
    };

    const request = mode === "edit" ? editDish(submitData) : addDish(submitData);
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
      width={900}
      destroyOnClose
      styles={{ body: { paddingTop: 10, paddingBottom: 8 } }}
      footer={[
        <Button key="cancel" className="dish-modal-btn-dark" onClick={hideModal}>
          Cancel
        </Button>,
        <Button key="ok" type="primary" className="dish-modal-btn-yellow" onClick={handleOk}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="dish-form">
        <Form.Item name="image" hidden>
          <Input />
        </Form.Item>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Dish Name"
              name="name"
              rules={[{ required: true, message: "Please input dish name." }]}
              style={compactItemStyle}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Dish Category"
              name="categoryId"
              rules={[{ required: true, message: "Please select dish category." }]}
              style={compactItemStyle}
            >
              <Select placeholder="Please select" options={categoryOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Dish Price"
              name="price"
              rules={[{ required: true, message: "Please input dish price." }]}
              style={compactItemStyle}
            >
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Dish Image" required style={compactItemStyle}>
          <div className="dish-image-wrap">
            <Dragger
              name="file"
              customRequest={customUpload}
              beforeUpload={beforeUpload}
              maxCount={1}
              fileList={fileList}
              onRemove={handleRemoveImage}
              showUploadList={false}
              style={{ width: 240, height: 190 }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="dish-preview"
                  style={{ width: "100%", height: 145, objectFit: "cover", borderRadius: 6 }}
                />
              ) : (
                <>
                  <p style={{ fontSize: 14, marginBottom: 8 }}>Click or drag image here to upload</p>
                  <p style={{ color: "#8c8c8c", marginBottom: 0 }}>PNG/JPEG, up to 2MB</p>
                </>
              )}
            </Dragger>
            <div className="image-tip">
              <div>Image size must be less than 2MB</div>
              <div>Only PNG and JPEG are supported</div>
              <div>Recommended size: 200x200 or 300x300</div>
            </div>
          </div>
        </Form.Item>

        <Form.Item label="Dish Description" name="description" style={compactItemStyle}>
          <Input.TextArea rows={3} placeholder="Please input description" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default DishForm;
