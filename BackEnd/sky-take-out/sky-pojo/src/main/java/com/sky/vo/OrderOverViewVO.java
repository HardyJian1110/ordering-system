package com.sky.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 订单概览数据
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderOverViewVO implements Serializable {
    // to be confirmed number
    private Integer waitingOrders;

    // confirmed number
    private Integer deliveredOrders;

    // completed number
    private Integer completedOrders;

    // cancelled number
    private Integer cancelledOrders;

    // total number
    private Integer allOrders;
}
