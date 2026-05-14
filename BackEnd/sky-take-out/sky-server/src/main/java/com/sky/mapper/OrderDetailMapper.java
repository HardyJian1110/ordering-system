package com.sky.mapper;

import com.sky.entity.OrderDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.ArrayList;
import java.util.List;

@Mapper
public interface OrderDetailMapper {
    // insert a batch of order details
    void insertBatch(ArrayList<OrderDetail> orderDetails);

    // get order details by order id
    @Select("select * from order_detail where order_id = #{orderId}")
    List<OrderDetail> getByOrderId(Long id);
}
