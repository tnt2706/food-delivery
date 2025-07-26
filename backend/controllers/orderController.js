import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import sendMail from '../utils/email.js';
import { generateDeliveredEmail, generateFoodProcessingEmail, generateOutForDeliveryEmail } from '../utils/orderUtil.js';

const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Phí giao hàng',
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const { subject, body } = generateFoodProcessingEmail(newOrder)

    const addressEmail = req.body.address?.email

    if (addressEmail != undefined || addressEmail != nil) {
      sendMail({ to: req.body.address?.email, subject, text: body });
    }

    res.json({
      success: true,
      message: 'Đặt hàng thành công',
      orderId: newOrder._id,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Lỗi khi đặt hàng' });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == 'true') {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: 'Đã thanh toán' });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: 'Chưa thanh toán' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Lỗi xác minh đơn hàng' });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Không thể lấy danh sách đơn hàng' });
  }
};

const listOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === 'admin') {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: 'Bạn không phải là quản trị viên' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Lỗi khi lấy đơn hàng' });
  }
};

const updateStatus = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId).lean();
    if (userData && userData.role === 'admin') {

      const order = await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      }, { upsert: true, new: true }).lean();

      let emailMessageData = {}

      switch (order.status) {
        case 'Out for delivery':
          emailMessageData = generateOutForDeliveryEmail(order)
        case 'Delivered':
          emailMessageData = generateDeliveredEmail(order)
      }

      const { subject, body } = emailMessageData || {}
      const addressEmail = order?.address?.email

      if (addressEmail == undefined || addressEmail == null || subject == undefined || body == undefined) {
        res.json({ success: true, message: 'Cập nhật thành công' });
      }else{
        sendMail({ to: addressEmail, subject, text: body });
        res.json({ success: true, message: 'Cập nhật thành công' });
      }
    } else {
      res.json({ success: false, message: 'Bạn không phải là quản trị viên' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Lỗi khi cập nhật trạng thái' });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
