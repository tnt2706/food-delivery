import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import {
  PlusSquare,
  ListOrdered,
  Truck,
  CalendarCheck 
} from 'lucide-react';

const ThanhBen = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='add' className="sidebar-option">
          <PlusSquare className="sidebar-icon" size={24} />
          <p>Thêm món</p>
        </NavLink>
        <NavLink to='list' className="sidebar-option">
          <ListOrdered className="sidebar-icon" size={24} />
          <p>Danh sách món</p>
        </NavLink>
        <NavLink to='orders' className="sidebar-option">
          <Truck className="sidebar-icon" size={24} />
          <p>Đơn hàng</p>
        </NavLink>
        <NavLink to='reservation' className="sidebar-option">
          <CalendarCheck className="sidebar-icon" size={24} />
          <p>Đặt bàn trước</p> 
        </NavLink>
      </div>
    </div>
  );
};

export default ThanhBen;
