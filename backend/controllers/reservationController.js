import reservationModel from '../models/reservationModel.js';
import userModel from '../models/userModel.js';
import sendMail from '../utils/email.js';

const RESERVATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  CANCELED: 'canceled' 
};

const USER_ROLES = {
  ADMIN: 'admin'
};

const EMAIL_TEMPLATES = {
  reservation_success: (date, branch, guests) => ({
    subject: '[Kokoria] ✅ Đã nhận yêu cầu đặt bàn',
    text: `Xin chào,

Chúng tôi đã nhận được yêu cầu đặt bàn của bạn với các thông tin sau:
📅 Ngày: ${formatDate(date)}
🏪 Chi nhánh: ${branch}
👥 Số lượng khách: ${guests}

Trạng thái hiện tại: Đang chờ xác nhận  
Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.

Cảm ơn bạn đã chọn dịch vụ của chúng tôi!

---
Kokoria  
Hotline: (+84) 0708796719`
  }),

  reservation_approved: (date, branch, guests) => ({
    subject: '[Kokoria] 🎉 Đặt bàn đã được xác nhận',
    text: `Xin chúc mừng,

Yêu cầu đặt bàn của bạn đã được XÁC NHẬN thành công.

Thông tin đặt bàn:
📅 Ngày & giờ: ${formatDate(date)}
🏪 Chi nhánh: ${branch}
👥 Số lượng khách: ${guests}

Lưu ý:
- Vui lòng đến đúng giờ
- Nếu cần thay đổi, vui lòng liên hệ trước ít nhất 2 giờ
- Vui lòng xuất trình email này khi đến

Chúng tôi rất mong được phục vụ bạn!

---
Kokoria  
Hotline: (+84) 0708796719`
  }),

  reservation_canceled: (date, branch, guests, reason) => ({
    subject: '[Kokoria] ❌ Đặt bàn đã bị hủy',
    text: `Xin chào,

Chúng tôi rất tiếc phải thông báo rằng yêu cầu đặt bàn của bạn đã bị HỦY.

Thông tin đặt bàn:
📅 Ngày & giờ: ${formatDate(date)}
🏪 Chi nhánh: ${branch}
👥 Số lượng khách: ${guests}

Lý do hủy: ${reason}

Bạn có thể:
- Chọn thời gian khác
- Chọn chi nhánh khác
- Gọi hotline để được hỗ trợ: (+84) 0708796719

Rất xin lỗi vì sự bất tiện này.

---
Kokoria  
Hotline: (+84) 0708796719`
  })
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const isAdmin = async (userId) => {
  const userData = await userModel.findById(userId);
  return userData && userData.role === USER_ROLES.ADMIN;
};

const handleError = (res, error, message = 'Có lỗi xảy ra') => {
  console.error('Lỗi:', error);
  res.json({ success: false, message });
};

const sendReservationEmail = async (email, templateKey, ...args) => {
  try {
    const { subject, text } = EMAIL_TEMPLATES[templateKey](...args);
    await sendMail({ to: email, subject, text });
  } catch (error) {
    console.error('Gửi email thất bại:', error);
  }
};

const getTodayStart = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getTomorrowStart = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

// Controller thêm đặt bàn
const addReservation = async (req, res) => {
  try {
    const { userId, email, phone, date, guests, branch, message } = req.body;

    if (!email || !phone || !date || !guests || !branch) {
      return res.json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
      });
    }

    const newReservation = new reservationModel({
      userId,
      email,
      phone,
      date,
      guests,
      branch,
      message: message || '',
      status: RESERVATION_STATUS.PENDING,
      processedBy: null,
      reason: '',
    });

    await newReservation.save();

    await sendReservationEmail(email, 'reservation_success', date, branch, guests);

    res.json({
      success: true,
      message: 'Đặt bàn thành công! Vui lòng kiểm tra email để xem thông tin chi tiết.',
      reservationId: newReservation._id,
    });

  } catch (error) {
    handleError(res, error, 'Không thể tạo đặt bàn. Vui lòng thử lại.');
  }
};

// Controller lấy danh sách đặt bàn
const listReservations = async (req, res) => {
  try {
    const { dateFilter = 'future', startDate, endDate } = req.query;
    const { userId } = req.body;
    const filter = {};

    if (!await isAdmin(userId)) {
      filter["userId"] = userId;
    }

    const today = getTodayStart();

    switch (dateFilter) {
      case 'today':
        filter["date"] = { $gte: today, $lt: getTomorrowStart() };
        break;
      case 'future':
        filter["date"] = { $gte: today };
        break;
      case 'past':
        filter["date"] = { $lt: today };
        break;
      case 'range':
        if (startDate && endDate) {
          filter["date"] = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          };
        }
        break;
      default:
        break;
    }

    const reservations = await reservationModel.find(filter).sort({ date: 1 });

    res.json({
      isSuccess: true,
      data: reservations,
      total: reservations.length,
      filter: dateFilter
    });

  } catch (error) {
    handleError(res, error, 'Không thể lấy danh sách đặt bàn');
  }
};

// Controller cập nhật trạng thái đặt bàn
const updateReservation = async (req, res) => {
  try {
    const { userId, reservationId, status, reason } = req.body;

    if (!await isAdmin(userId)) {
      return res.json({ success: false, message: 'Bạn không có quyền thực hiện chức năng này' });
    }

    if (!reservationId || !status) {
      return res.json({ success: false, message: 'Thiếu thông tin reservationId hoặc status' });
    }

    if (!Object.values(RESERVATION_STATUS).includes(status)) {
      return res.json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    const updateData = {
      status,
      processedBy: userId,
      updatedAt: new Date()
    };

    if (status === RESERVATION_STATUS.CANCELED) {
      updateData.reason = reason && reason.trim() !== "" 
        ? reason.trim() 
        : "Nhà hàng không thể xử lý đơn đặt bàn này";
    } else {
      updateData.reason = "";
    }

    const reservation = await reservationModel.findByIdAndUpdate(reservationId, updateData, { new: true });

    if (!reservation) {
      return res.json({ success: false, message: 'Không tìm thấy đơn đặt bàn' });
    }

    if (status === RESERVATION_STATUS.APPROVED) {
      await sendReservationEmail(reservation.email, 'reservation_approved', reservation.date, reservation.branch, reservation.guests);
    } else if (status === RESERVATION_STATUS.CANCELED) {
      await sendReservationEmail(reservation.email, 'reservation_canceled', reservation.date, reservation.branch, reservation.guests, reservation.reason);
    }

    res.json({ 
      success: true, 
      message: `Đã cập nhật trạng thái đặt bàn thành "${status}"`,
      reservation: {
        id: reservation._id,
        status: reservation.status,
        reason: reservation.reason
      }
    });

  } catch (error) {
    handleError(res, error, 'Không thể cập nhật trạng thái đặt bàn');
  }
};

export { addReservation, listReservations, updateReservation };
