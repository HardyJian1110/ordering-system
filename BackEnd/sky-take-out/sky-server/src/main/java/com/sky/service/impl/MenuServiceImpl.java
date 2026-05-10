package com.sky.service.impl;

import com.sky.context.BaseContext;
import com.sky.entity.Menu;
import com.sky.mapper.EmployeeMapper;
import com.sky.mapper.MenuMapper;
import com.sky.service.MenuService;
import com.sky.vo.MenuItemVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MenuServiceImpl implements MenuService {
    @Autowired
    private MenuMapper menuMapper;
    @Autowired
    private  EmployeeMapper employeeMapper;

    @Override
    public List<MenuItemVO> getMenuTree() {
        // Get role by id
        Long id = BaseContext.getCurrentId();
        String role = employeeMapper.getPositionById(id);

        // 2. Query menu list which is permitted
        List<Menu> menuList = menuMapper.selectByRole(role);

        // 3. 递归构建树
        return buildTree(menuList, 0L);
    }

    private List<MenuItemVO> buildTree(List<Menu> menus, Long parentId) {
        List<MenuItemVO> tree = new ArrayList<>();
        for (Menu menu : menus) {
            if (menu.getParentId().equals(parentId)) {
                MenuItemVO vo = new MenuItemVO();
                vo.setLabel(menu.getLabel());
                vo.setIcon(menu.getIcon());
                vo.setKey(menu.getPath());

                // 递归寻找子菜单
                List<MenuItemVO> children = buildTree(menus, menu.getId());
                if (!children.isEmpty()) {
                    vo.setChildren(children);
                }
                tree.add(vo);
            }
        }
        return tree;
    }
}
