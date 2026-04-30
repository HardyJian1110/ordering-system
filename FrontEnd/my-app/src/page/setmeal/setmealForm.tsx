import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Modal, Radio, Row, Select, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  addSetmeal,
  editSetmeal,
  getDishListByCategoryId,
  getSetmealCategoryList,
  type CategoryItem,
  type DishItem,
  type SetmealData,
  uploadImage,
} from "../../api/setmeal";

const { Dragger } = Upload;
const compactItemStyle = { marginBottom: 12 };

interface FormProps {
  visible: boolean;
  hideModal: () => void;
  title: string;
  loadData: () => void;
  mode: "add" | "edit";
}

interface SetmealFormValues {
  name: string;
  price: number;
  status: number;
  description?: string;
  image: string;
  setmealDishes: Array<{
    dishId: number;
    copies: number;
    name?: string;
    price?: number;
  }>;
}

function SetmealForm(props: FormProps) {
  const [form] = Form.useForm<SetmealFormValues>();
  const { setmealData } = useSelector((state: any) => state.setmealSlice);
  const { visible, hideModal, title, loadData, mode } = props;
  const [dishList, setDishList] = useState<DishItem[]>([]);
  const [defaultCategoryId, setDefaultCategoryId] = useState<number | undefined>(undefined);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const imageUrl = Form.useWatch("image", form);
  const setmealDishOptions = useMemo(() => dishList.map((item) => ({ label: item.name, value: item.id })), [dishList]);

  const loadDishData = async () => {
    const { data: categoryData } = await getSetmealCategoryList();
    const enabledCategories: CategoryItem[] = (categoryData || []).filter(
      (item: CategoryItem) => item.status === 1
    );
    setDefaultCategoryId(enabledCategories[0]?.id);

    const dishRequestList = enabledCategories.map((item) => getDishListByCategoryId(item.id));
    const dishResponseList = await Promise.all(dishRequestList);
    const mergedDishList: DishItem[] = [];
    const dishMap: Record<number, boolean> = {};

    dishResponseList.forEach((response) => {
      const currentDishList = (response.data || []).filter((dish: DishItem) => dish.status === 1);
      currentDishList.forEach((dish: DishItem) => {
        if (!dishMap[dish.id]) {
          dishMap[dish.id] = true;
          mergedDishList.push(dish);
        }
      });
    });

    setDishList(mergedDishList);
  };

  useEffect(() => {
    if (!visible) {
      return;
    }
    loadDishData();
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (mode === "add") {
      form.resetFields();
      setFileList([]);
      form.setFieldsValue({
        status: 0,
        setmealDishes: [],
      });
      return;
    }

    const editData = setmealData as SetmealData;
    form.setFieldsValue({
      name: editData.name,
      price: editData.price,
      status: editData.status,
      description: editData.description,
      image: editData.image,
      setmealDishes: (editData.setmealDishes || []).map((item) => ({
        dishId: item.dishId,
        copies: item.copies,
        name: item.name,
        price: item.price,
      })),
    });

    if (editData.image) {
      setFileList([
        {
          uid: "-1",
          name: "setmeal-image",
          status: "done",
          url: editData.image,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [visible, mode, setmealData]);

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

  const customUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      setUploadLoading(true);
      const { data } = await uploadImage(file as File);
      form.setFieldValue("image", data);
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
    } catch (error) {
      onError?.(error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRemoveImage = () => {
    form.setFieldValue("image", "");
    setFileList([]);
  };

  const handleSelectDish = (dishId: number, rowIndex: number) => {
    const targetDish = dishList.find((item) => item.id === dishId);
    if (!targetDish) {
      return;
    }
    form.setFieldValue(["setmealDishes", rowIndex, "name"], targetDish.name);
    form.setFieldValue(["setmealDishes", rowIndex, "price"], targetDish.price);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (!imageUrl) {
      message.warning("Please upload a setmeal image.");
      return;
    }
    if (!values.setmealDishes || values.setmealDishes.length === 0) {
      message.warning("Please add at least one dish.");
      return;
    }

    const submitCategoryId =
      mode === "edit" ? Number((setmealData as SetmealData).categoryId) : Number(defaultCategoryId);
    if (!submitCategoryId) {
      message.warning("No available setmeal category was found.");
      return;
    }

    const setmealDishes = values.setmealDishes.map((item) => {
      const targetDish = dishList.find((dish) => dish.id === item.dishId);
      return {
        dishId: item.dishId,
        copies: Number(item.copies),
        name: targetDish?.name || item.name || "",
        price: Number(targetDish?.price ?? item.price ?? 0),
      };
    });

    const submitData: SetmealData = {
      id: mode === "edit" ? Number((setmealData as SetmealData).id) : undefined,
      categoryId: submitCategoryId,
      name: values.name,
      price: Number(values.price),
      status: Number(values.status),
      description: values.description || "",
      image: imageUrl,
      setmealDishes,
    };

    const request = mode === "edit" ? editSetmeal(submitData) : addSetmeal(submitData);
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
      width={700}
      onOk={handleOk}
      destroyOnClose
      styles={{ body: { paddingTop: 12, paddingBottom: 8 } }}
    >
      <Form form={form} layout="vertical" size="small" style={{ maxWidth: 500 }}>
        <Form.Item
          label="Setmeal Name"
          name="name"
          rules={[{ required: true, message: "Please input setmeal name." }]}
          style={compactItemStyle}
        >
          <Input style={{ width: 240 }} />
        </Form.Item>

        <Form.Item
          label="Setmeal Price"
          name="price"
          rules={[{ required: true, message: "Please input setmeal price." }]}
          style={compactItemStyle}
        >
          <InputNumber min={0} precision={2} style={{ width: 240 }} />
        </Form.Item>

        <Form.Item label="Setmeal Dishes" style={compactItemStyle}>
          <Form.List name="setmealDishes">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row gutter={8} key={field.key}>
                    <Col span={11}>
                      <Form.Item
                        {...field}
                        name={[field.name, "dishId"]}
                        rules={[{ required: true, message: "Please select a dish." }]}
                        style={compactItemStyle}
                      >
                        <Select
                          placeholder="Please select a dish"
                          options={setmealDishOptions}
                          onChange={(value) => handleSelectDish(value, field.name)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, "copies"]}
                        rules={[{ required: true, message: "Please input copies." }]}
                        style={compactItemStyle}
                      >
                        <InputNumber min={1} precision={0} style={{ width: "100%" }} placeholder="Copies" />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Button danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} style={{ width: "100%" }}>
                        Delete
                      </Button>
                    </Col>
                  </Row>
                ))}

                <Button type="dashed" onClick={() => add({ copies: 1 })} block icon={<PlusOutlined />}>
                  Add Dish
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item label="Setmeal Image" required style={compactItemStyle}>
          <div>
            <Dragger
              className="setmeal-image-dragger"
              name="file"
              customRequest={customUpload}
              beforeUpload={beforeUpload}
              maxCount={1}
              fileList={fileList}
              onRemove={handleRemoveImage}
              showUploadList={false}
              style={{ width: 260, height: 260 }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="setmeal-preview"
                  style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 6 }}
                />
              ) : (
                <>
                  <p style={{ fontSize: 14, marginBottom: 8 }}>Click or drag image here to upload</p>
                  <p style={{ color: "#8c8c8c", marginBottom: 0 }}>
                    {uploadLoading ? "Uploading..." : "PNG/JPEG, up to 2MB"}
                  </p>
                </>
              )}
            </Dragger>
            {imageUrl ? <div style={{ color: "#52c41a", marginTop: 8 }}>Uploaded successfully</div> : null}
          </div>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select status." }]}
          style={compactItemStyle}
        >
          <Radio.Group>
            <Radio value={1}>On Sale</Radio>
            <Radio value={0}>Stopped</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Description" name="description" style={compactItemStyle}>
          <Input.TextArea rows={3} placeholder="Please input description" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default SetmealForm;
