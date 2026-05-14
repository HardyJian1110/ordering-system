package com.sky.task;

import com.sky.dto.OrdersConfirmDTO;
import com.sky.entity.Orders;
import com.sky.mapper.OrderMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
public class OrderTask {

    @Autowired
    private OrderMapper orderMapper;

    // process confirmed order
    @Scheduled(cron = "0 0 2 * * ? ")   // 2 AM every day
    public void processConfirmedOrder() {
        log.info("cron job of confirmed order: {}", LocalDateTime.now());
        List<Orders> ordersList = orderMapper.getByStatus(Orders.CONFIRMED);

        if (ordersList != null && ordersList.size() > 0) {
            for (Orders order : ordersList) {
                OrdersConfirmDTO ordersConfirmDTO = new OrdersConfirmDTO();

                BeanUtils.copyProperties(order, ordersConfirmDTO );
                ordersConfirmDTO.setStatus(Orders.COMPLETED);
                orderMapper.updateStatus(ordersConfirmDTO);
            }
        }
    }
}
