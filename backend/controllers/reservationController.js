import reservationModel from '../models/reservationModel.js';
import userModel from '../models/userModel.js';
import sendMail from '../utils/email.js';

// Constants
const RESERVATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  CANCELED: 'canceled'
};

const USER_ROLES = {
  ADMIN: 'admin'
};

// Email templates (English version)
const EMAIL_TEMPLATES = {
  reservation_success: (date, branch, guests) => ({
    subject: '[Kokoria] ✅ Reservation Request Received',
    text: `Hello,

We have received your table reservation request with the following details:
📅 Date: ${formatDate(date)}
🏪 Branch: ${branch}
👥 Number of Guests: ${guests}

Current Status: Pending Confirmation  
We will review and get back to you as soon as possible.

Thank you for choosing our service!

---
Kokoria  
Hotline: (+84) 0708796719`
  }),

  reservation_approved: (date, branch, guests) => ({
    subject: '[Kokoria] 🎉 Reservation Confirmed',
    text: `Hello,

Congratulations! Your table reservation has been CONFIRMED.

Reservation Details:
📅 Date & Time: ${formatDate(date)}
🏪 Branch: ${branch}
👥 Number of Guests: ${guests}

Important Notes:
- Please arrive on time
- For any changes, contact us at least 2 hours in advance
- Show this message upon arrival

We look forward to serving you!

---
kokoria  
Hotline: (+84) 0708796719`
  }),

  reservation_canceled: (date, branch, guests, reason) => ({
    subject: '[Kokoria] ❌ Reservation Canceled',
    text: `Hello,

We’re sorry to inform you that your reservation has been CANCELED.

Reservation Details:
📅 Date & Time: ${formatDate(date)}
🏪 Branch: ${branch}
👥 Number of Guests: ${guests}

Reason for cancellation: ${reason}

For assistance, you may:
- Choose another time
- Choose another branch
- Call our hotline for support: (+84) 0708796719

We apologize for any inconvenience caused.

---
Kokoria  
Hotline: (+84) 0708796719`
  })
};


// Helper functions
const formatDate =(date) => {
  return new Date(date).toLocaleDateString('en-GB', {
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
  console.error('Error:', error);
  res.json({ success: false, message });
};

const sendReservationEmail = async (email, templateKey, ...args) => {
  try {
    const { subject, text } = EMAIL_TEMPLATES[templateKey](...args);
    await sendMail({ to: email, subject, text });
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw error to avoid breaking the main flow
  }
};

// Controllers
const addReservation = async (req, res) => {
  try {
    const { userId, email, phone, date, guests, branch, message } = req.body;

    if (!email || !phone || !date || !guests || !branch) {
      return res.json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
      });
    }

    // Create new reservation
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

    // Send confirmation email
    await sendReservationEmail(
      email, 
      'reservation_success', 
      date, 
      branch, 
      guests
    );

    res.json({
      success: true,
      message: 'Đặt bàn thành công! Vui lòng kiểm tra email để xem thông tin chi tiết.',
      reservationId: newReservation._id,
    });

  } catch (error) {
    handleError(res, error, 'Không thể tạo đặt bàn. Vui lòng thử lại.');
  }
};

const listReservations = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!await isAdmin(userId)) {
      return res.json({ 
        success: false, 
        message: 'Bạn không có quyền truy cập chức năng này' 
      });
    }

    const reservations = await reservationModel
      .find({})
      .populate('processedBy', 'email name')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      data: reservations,
      total: reservations.length
    });

  } catch (error) {
    handleError(res, error, 'Không thể lấy danh sách đặt bàn');
  }
};

const updateReservation = async (req, res) => {
  try {
    const { userId, reservationId, status, reason } = req.body;

    // Validate admin permission
    if (!await isAdmin(userId)) {
      return res.json({ 
        success: false, 
        message: 'Bạn không có quyền thực hiện chức năng này' 
      });
    }

    if (!reservationId || !status) {
      return res.json({ 
        success: false, 
        message: 'Thiếu thông tin reservationId hoặc status' 
      });
    }

    // Validate status
    if (!Object.values(RESERVATION_STATUS).includes(status)) {
      return res.json({ 
        success: false, 
        message: 'Trạng thái không hợp lệ' 
      });
    }

    // Prepare update data
    const updateData = {
      status,
      processedBy: userId,
      updatedAt: new Date()
    };

    // Handle reason for canceled status
    if (status === RESERVATION_STATUS.CANCELED) {
      updateData.reason = reason && reason.trim() !== "" 
        ? reason.trim() 
        : "Nhà hàng không thể xử lý đơn đặt bàn này";
    } else {
      updateData.reason = "";
    }

    // Update reservation
    const reservation = await reservationModel.findByIdAndUpdate(
      reservationId,
      updateData,
      { new: true }
    );

    if (!reservation) {
      return res.json({ 
        success: false, 
        message: 'Không tìm thấy đơn đặt bàn' 
      });
    }

    // Send notification email
    if (status === RESERVATION_STATUS.APPROVED) {
      await sendReservationEmail(
        reservation.email,
        'reservation_approved',
        reservation.date,
        reservation.branch,
        reservation.guests
      );
    } else if (status === RESERVATION_STATUS.CANCELED) {
      await sendReservationEmail(
        reservation.email,
        'reservation_canceled',
        reservation.date,
        reservation.branch,
        reservation.guests,
        reservation.reason
      );
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