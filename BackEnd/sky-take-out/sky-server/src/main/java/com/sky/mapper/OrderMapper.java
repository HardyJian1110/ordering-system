package com.sky.mapper;

import com.github.pagehelper.Page;
import com.sky.dto.OrdersConfirmDTO;
import com.sky.dto.OrdersPageQueryDTO;
import com.sky.entity.Orders;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface OrderMapper {
    // insert order
    void insert(Orders order);

    // Conditional search order and ordered by order_time
    Page<Orders> pageQuery(OrdersPageQueryDTO ordersPageQueryDTO);


    // Query order quantity by status
    @Select("select count(id) from orders where status = #{status}")
    Integer countStatus(Integer status);

    // Query order by id
    @Select("select * from orders where id=#{id}")
    Orders getById(Long id);

    // Update order status
    void updateStatus(OrdersConfirmDTO ordersConfirmDTO);

    // Query order by status
    @Select("select * from orders where status=#{status}")
    List<Orders> getByStatus(Integer status);

    Integer countByMap(Map map);

    Double sumByMap(Map map);
}
