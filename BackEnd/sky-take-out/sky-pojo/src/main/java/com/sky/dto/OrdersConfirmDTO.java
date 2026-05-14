package com.sky.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class OrdersConfirmDTO implements Serializable {

    private Long id;
    //订单状态 1待接单 2已接单 3已完成 4已取消
    private Integer status;

}
