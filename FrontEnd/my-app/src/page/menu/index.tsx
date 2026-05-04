import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Modal, Space, Spin, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  addShoppingCart,
  cleanShoppingCart,
  getCategoryList,
  getDishList,
  getSetmealList,
  getShoppingCartList,
  submitOrder,
  subShoppingCart,
  type CategoryItem,
  type DishItem,
  type SetmealItem,
  type ShoppingCartItem,
  type ShoppingCartPayload,
  type SubmitOrderPayload,
  type SubmitOrderResult,
} from "../../api/menu";
import CheckoutModal, { type CheckoutFormValues } from "./checkoutModal";
import "./index.scss";

type CategoryWithSource = CategoryItem & { sourceType: 1 | 2 };
type ProductItem = (DishItem | SetmealItem) & { sourceType: 1 | 2 };

function MenuPage() {
  const [categoryList, setCategoryList] = useState<CategoryWithSource[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number>();
  const [activeCategoryType, setActiveCategoryType] = useState<1 | 2>(1);
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [cartList, setCartList] = useState<ShoppingCartItem[]>([]);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [updatingCart, setUpdatingCart] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [submittingOrder, setSubmittingOrder] = useState<boolean>(false);

  const cartCountMap = useMemo(() => {
    const map = new Map<string, number>();
    cartList.forEach((item) => {
      const key = item.dishId ? `dish_${item.dishId}` : `setmeal_${item.setmealId}`;
      map.set(key, item.number || 0);
    });
    return map;
  }, [cartList]);

  const totalPrice = useMemo(() => {
    return cartList.reduce((sum, item) => sum + Number(item.amount || 0) * Number(item.number || 0), 0);
  }, [cartList]);

  const refreshCart = async () => {
    const { data } = await getShoppingCartList();
    setCartList(data || []);
  };

  const loadProductsByCategory = async (categoryId: number, type: 1 | 2) => {
    try {
      setLoadingProducts(true);
      if (type === 1) {
        const { data } = await getDishList(categoryId);
        const list = (data || []).map((item: DishItem) => ({ ...item, sourceType: 1 as const }));
        setProductList(list);
      } else {
        const { data } = await getSetmealList(categoryId);
        const list = (data || []).map((item: SetmealItem) => ({ ...item, sourceType: 2 as const }));
        setProductList(list);
      }
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadInitialData = async () => {
    try {
      setLoadingPage(true);
      const [dishCategoryRes, setmealCategoryRes] = await Promise.all([getCategoryList(1), getCategoryList(2)]);
      const dishCategories: CategoryWithSource[] = (dishCategoryRes.data || []).map((item: CategoryItem) => ({
        ...item,
        sourceType: 1,
      }));
      const setmealCategories: CategoryWithSource[] = (setmealCategoryRes.data || []).map((item: CategoryItem) => ({
        ...item,
        sourceType: 2,
      }));
      const merged = [...dishCategories, ...setmealCategories].sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));
      setCategoryList(merged);

      if (merged.length > 0) {
        const first = merged[0];
        setActiveCategoryId(first.id);
        setActiveCategoryType(first.sourceType);
        await loadProductsByCategory(first.id, first.sourceType);
      } else {
        setProductList([]);
      }

      await refreshCart();
    } catch (error: any) {
      message.warning(error?.message || "Failed to load menu data.");
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSelectCategory = async (item: CategoryWithSource) => {
    if (item.id === activeCategoryId && item.sourceType === activeCategoryType) {
      return;
    }
    setActiveCategoryId(item.id);
    setActiveCategoryType(item.sourceType);
    await loadProductsByCategory(item.id, item.sourceType);
  };

  const addOne = async (payload: ShoppingCartPayload) => {
    try {
      setUpdatingCart(true);
      await addShoppingCart(payload);
      await refreshCart();
    } catch (error: any) {
      message.warning(error?.message || "Failed to add to cart.");
    } finally {
      setUpdatingCart(false);
    }
  };

  const subOne = async (payload: ShoppingCartPayload) => {
    try {
      setUpdatingCart(true);
      await subShoppingCart(payload);
      await refreshCart();
    } catch (error: any) {
      message.warning(error?.message || "Failed to remove item.");
    } finally {
      setUpdatingCart(false);
    }
  };

  const getPayloadByProduct = (product: ProductItem): ShoppingCartPayload => {
    if (product.sourceType === 1) {
      return { dishId: product.id };
    }
    return { setmealId: product.id };
  };

  const getPayloadByCartItem = (item: ShoppingCartItem): ShoppingCartPayload => {
    if (item.dishId) {
      return { dishId: item.dishId, dishFlavor: item.dishFlavor };
    }
    return { setmealId: item.setmealId };
  };

  const handleAddProduct = async (product: ProductItem) => {
    await addOne(getPayloadByProduct(product));
  };

  const handleClearCart = async () => {
    if (cartList.length === 0) {
      return;
    }
    try {
      setUpdatingCart(true);
      await cleanShoppingCart();
      await refreshCart();
      message.success("Cart cleared.");
    } catch (error: any) {
      message.warning(error?.message || "Failed to clear cart.");
    } finally {
      setUpdatingCart(false);
    }
  };

  const openCheckout = () => {
    setCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setCheckoutOpen(false);
  };

  const submitCheckout = async (values: CheckoutFormValues) => {
    try {
      const payload: SubmitOrderPayload = {
        diningMode: values.diningMode,
        remark: values.remark || "",
        amount: Number(totalPrice.toFixed(2)),
      };
      if (values.diningMode === 1) {
        payload.tableNumber = Number(values.tableNumber);
      }

      setSubmittingOrder(true);
      const { data } = await submitOrder(payload);
      const orderInfo = data as SubmitOrderResult;
      setCheckoutOpen(false);
      await refreshCart();

      Modal.success({
        title: "Order Submitted",
        className: "menu-success-modal",
        okText: "Great",
        okButtonProps: { className: "menu-success-ok-btn" },
        content: (
          <Space direction="vertical" size={2}>
            <span>Order Number: {orderInfo.orderNumber}</span>
            <span>Order Amount: €{Number(orderInfo.orderAmount || payload.amount).toFixed(2)}</span>
            <span>Order Time: {orderInfo.orderTime || "-"}</span>
          </Space>
        ),
      });
    } catch (error: any) {
      message.warning(error?.message || "Failed to submit order.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="menu-page">
      {loadingPage ? (
        <div className="menu-loading">
          <Spin size="large" />
        </div>
      ) : (
        <div className="menu-layout">
          <Card className="menu-categories-card" bordered={false}>
            <div className="section-title">Categories</div>
            <div className="category-list">
              {categoryList.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No categories" />
              ) : (
                categoryList.map((item) => (
                  <button
                    key={`${item.sourceType}_${item.id}`}
                    type="button"
                    className={`category-item ${item.id === activeCategoryId && item.sourceType === activeCategoryType ? "active" : ""}`}
                    onClick={() => handleSelectCategory(item)}
                  >
                    <span className="category-name">{item.name}</span>
                    <span className="category-badge">{item.sourceType === 1 ? "Dish" : "Setmeal"}</span>
                  </button>
                ))
              )}
            </div>
          </Card>

          <Card className="menu-products-card" bordered={false}>
            <div className="section-title">Popular Items</div>
            {loadingProducts ? (
              <div className="products-loading">
                <Spin />
              </div>
            ) : productList.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No items" />
            ) : (
              <div className="product-list">
                {productList.map((item) => {
                  const cartKey = item.sourceType === 1 ? `dish_${item.id}` : `setmeal_${item.id}`;
                  const count = cartCountMap.get(cartKey) || 0;
                  return (
                    <div className="product-item" key={`${item.sourceType}_${item.id}`}>
                      <img className="product-image" src={item.image} alt={item.name} />
                      <div className="product-meta">
                        <div className="product-name">{item.name}</div>
                        <div className="product-desc">{item.description || "Classic choice from our menu."}</div>
                        <div className="product-bottom">
                          <span className="product-price">€{Number(item.price || 0).toFixed(2)}</span>
                          <div className="product-actions">
                            {count > 0 ? (
                              <>
                                <Button
                                  className="round-btn minus-btn"
                                  shape="circle"
                                  icon={<MinusOutlined />}
                                  onClick={() => subOne(getPayloadByProduct(item))}
                                  loading={updatingCart}
                                />
                                <span className="count-text">{count}</span>
                              </>
                            ) : null}
                            <Button
                              className="round-btn plus-btn"
                              type="primary"
                              shape="circle"
                              icon={<PlusOutlined />}
                              onClick={() => handleAddProduct(item)}
                              loading={updatingCart}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="menu-cart-card" bordered={false}>
            <div className="cart-header">
              <div className="section-title">Cart</div>
              <Button type="link" className="clear-btn" onClick={handleClearCart} disabled={cartList.length === 0 || updatingCart}>
                Clear Cart
              </Button>
            </div>

            <div className="cart-list">
              {cartList.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Your cart is empty" />
              ) : (
                cartList.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img className="cart-image" src={item.image} alt={item.name} />
                    <div className="cart-meta">
                      <div className="cart-name">{item.name}</div>
                      <div className="cart-price">€{Number(item.amount || 0).toFixed(2)}</div>
                    </div>
                    <div className="cart-actions">
                      <Button
                        className="round-btn minus-btn"
                        shape="circle"
                        icon={<MinusOutlined />}
                        onClick={() => subOne(getPayloadByCartItem(item))}
                        loading={updatingCart}
                      />
                      <span className="count-text">{item.number}</span>
                      <Button
                        className="round-btn plus-btn"
                        type="primary"
                        shape="circle"
                        icon={<PlusOutlined />}
                        onClick={() => addOne(getPayloadByCartItem(item))}
                        loading={updatingCart}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="total-row">
                <span className="total-label">Total</span>
                <span className="total-price">€{totalPrice.toFixed(2)}</span>
              </div>
              <Button type="primary" className="checkout-btn" disabled={cartList.length === 0} onClick={openCheckout}>
                Checkout
              </Button>
            </div>
          </Card>
        </div>
      )}

      <CheckoutModal
        open={checkoutOpen}
        totalPrice={totalPrice}
        confirmLoading={submittingOrder}
        onCancel={closeCheckout}
        onSubmit={submitCheckout}
      />
    </div>
  );
}

export default MenuPage;
