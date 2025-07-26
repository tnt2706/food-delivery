const generateFoodProcessingEmail = (order) => {
    const items = order.items;

    const itemDetails = items.map(item =>
        `- ${item.name} x ${item.quantity} = ${(item.price * item.quantity).toLocaleString("vi-VN")}đ`
    ).join("\n");

    const subject = "Đơn hàng của bạn đang được xử lý";

    const { firstName, lastName, street, city, state } = order?.address || {};
    const fullAddress = `Địa chỉ:${street}, ${city}, ${state}`;

    const body = `
🛒 ĐƠN HÀNG ĐANG ĐƯỢC XỬ LÝ

Xin chào ${firstName} ${lastName},

Đơn hàng của bạn hiện đang được chuẩn bị.

🧾 Mã đơn hàng: ${order.orderNumber}
📦 Trạng thái: Đang xử lý

🏠 Địa chỉ giao hàng:
${fullAddress}

Chi tiết đơn hàng:
${itemDetails}
- Phí giao hàng: 20.000đ
--------------------------
Tổng cộng: ${order.amount.toLocaleString("vi-VN")}đ

Chúng tôi sẽ thông báo cho bạn khi đơn hàng bắt đầu giao.
  `.trim();

    return { subject, body };
};

const generateOutForDeliveryEmail = (order) => {
    const subject = "Đơn hàng đang được giao đến bạn";

    const { firstName, lastName } = order?.address || {};

    const body = `
🚚 ĐƠN HÀNG ĐANG ĐƯỢC GIAO

Xin chào ${firstName} ${lastName},

Đơn hàng của bạn đang được giao đến địa chỉ bạn đã cung cấp.

🧾 Mã đơn hàng: ${order.orderNumber}
📦 Trạng thái: Đang giao hàng

Tổng tiền thanh toán: ${order.amount.toLocaleString("vi-VN")}đ

Vui lòng giữ điện thoại bên mình để tài xế liên hệ khi giao hàng.
  `.trim();

    return { subject, body };
};

const generateDeliveredEmail = (order) => {
    const subject = "Đơn hàng đã giao thành công";

    const { firstName, lastName } = order?.address || {};

    const body = `
✅ ĐƠN HÀNG ĐÃ GIAO THÀNH CÔNG

Xin chào ${firstName} ${lastName},

Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi!

🧾 Mã đơn hàng: ${order.orderNumber}
📦 Trạng thái: Đã giao hàng

Tổng tiền thanh toán: ${order.amount.toLocaleString("vi-VN")}đ

Chúng tôi rất mong nhận được phản hồi từ bạn để phục vụ tốt hơn!
  `.trim();

    return { subject, body };
};

export {
    generateFoodProcessingEmail,
    generateOutForDeliveryEmail,
    generateDeliveredEmail,
};
