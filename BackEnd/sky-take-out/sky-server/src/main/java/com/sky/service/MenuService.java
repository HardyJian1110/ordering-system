package com.sky.service;

import com.sky.vo.MenuItemVO;

import java.util.List;

public interface MenuService {
    List<MenuItemVO> getMenuTree();
}
