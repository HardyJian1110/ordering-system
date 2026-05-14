package com.sky.service;

import com.sky.dto.OrdersConfirmDTO;
import com.sky.dto.OrdersPageQueryDTO;
import com.sky.dto.OrdersSubmitDTO;
import com.sky.result.PageResult;
import com.sky.vo.OrderStatisticsVO;
import com.sky.vo.OrderSubmitVO;
import com.sky.vo.OrderVO;

public interface OrderService {
    // User submit order
    OrderSubmitVO submitOrder(OrdersSubmitDTO ordersSubmitDTO);

    // Conditional search order
    PageResult conditionSearch(OrdersPageQueryDTO ordersPageQueryDTO);

    OrderStatisticsVO statistics();

    OrderVO details(Long id);

    void updateStatus(OrdersConfirmDTO ordersConfirmDTO);
}
