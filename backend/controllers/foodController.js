import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

// add food items

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await food.save();
      res.json({ success: true, message: "Food Added" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// update food items

const updateFood = async (req, res) => {
  try {
    const foodId = req.params.id;
    const { name, description, price, category, userId } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData || userData.role !== "admin") {
      return res.status(403).json({ success: false, message: "You are not admin" });
    }

    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    food.name = name || food.name;
    food.description = description || food.description;
    food.price = price || food.price;
    food.category = category || food.category;

    if (req.file && req.file.filename) {
      food.image = req.file.filename;
    }

    await food.save();

    res.json({ success: true, message: "Food updated successfully" });
  } catch (error) {
    console.error("Update Food Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// get all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const food = await foodModel.findById(req.body.id);
      fs.unlink(`uploads/${food.image}`, () => { });
      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, updateFood, listFood, removeFood };
