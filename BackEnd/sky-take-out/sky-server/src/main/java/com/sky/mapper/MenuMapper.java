package com.sky.mapper;

import com.sky.entity.Menu;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MenuMapper {
    List<Menu> selectByRole(String role);
}
