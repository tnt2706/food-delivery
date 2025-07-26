import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import './Reservation.css';

const RESERVATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  CANCELED: 'canceled',
};

const statusOptions = [
  { value: RESERVATION_STATUS.PENDING, label: 'Chờ duyệt' },
  { value: RESERVATION_STATUS.APPROVED, label: 'Đã duyệt' },
  { value: RESERVATION_STATUS.CANCELED, label: 'Đã hủy' },
];

const ReservationManager = ({ url }) => {
  const { token, admin } = useContext(StoreContext);
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${url}/api/reservation/list?dateFilter=all`, {
        headers: { token },
      });
      setReservations(res.data.data || []);
    } catch {
      toast.error('Tải danh sách đặt bàn thất bại.');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.post(`${url}/api/reservation/status`, {
        reservationId: id,
        status,
      }, { headers: { token } });

      if (res.data.success) {
        toast.success('Cập nhật trạng thái thành công.');
        fetchReservations();
      } else {
        toast.error(res.data.message || 'Cập nhật thất bại.');
      }
    } catch {
      toast.error('Lỗi khi cập nhật trạng thái.');
    }
  };

  useEffect(() => {
    if (!token || !admin) {
      toast.error('Vui lòng đăng nhập');
      navigate('/');
    } else {
      fetchReservations();
    }
  }, [token]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} - ${hh}:${min}`;
  };

  return (
    <div className="reservation-table-container">
      <table className="reservation-table">
        <thead>
          <tr>
            <th>Số điện thoại</th>
            <th>Ngày đặt</th>
            <th>Số khách</th>
            <th>Chi nhánh</th>
            <th>Trạng thái</th>
            <th>Người xử lý</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((rsv) => (
            <tr key={rsv._id}>
              <td>{rsv.phone}</td>
              <td>{formatDate(rsv.date)}</td>
              <td>{rsv.guests}</td>
              <td>{rsv.branch}</td>
              <td>
                <select
                  value={rsv.status}
                  onChange={(e) => updateStatus(rsv._id, e.target.value)}
                  className={`status-dropdown ${rsv.status}`}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>{rsv.processedBy?.name || '-'}</td>
              <td>
                {rsv.status === 'canceled' && rsv.reason ? (
                  <span className="cancel-reason">{rsv.reason}</span>
                ) : rsv.message ? (
                  rsv.message
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationManager;
