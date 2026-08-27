require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const connectDB = require('./config/db');

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Task.deleteMany();

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@taskflow.com',
      password: 'password123',
      role: 'Admin',
    });

    const managerUser = await User.create({
      name: 'Manager User',
      email: 'manager@taskflow.com',
      password: 'password123',
      role: 'Manager',
    });

    const standardUser1 = await User.create({
      name: 'John Doe',
      email: 'user1@taskflow.com',
      password: 'password123',
      role: 'User',
    });

    await Task.create([
      {
        title: 'Setup Project Repository',
        description: 'Initialize Git, setup server and client folders.',
        status: 'Completed',
        priority: 'High',
        dueDate: new Date(),
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
      },
      {
        title: 'Design MongoDB Schema',
        description: 'Create Mongoose models for User and Task collections.',
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
        assignedTo: managerUser._id,
        createdBy: adminUser._id,
      },
      {
        title: 'Implement JWT Auth',
        description: 'Write controllers and middleware for secure login.',
        status: 'Todo',
        priority: 'Urgent',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        assignedTo: standardUser1._id,
        createdBy: managerUser._id,
      },
    ]);

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with Seeder: ${error.message}`);
    process.exit(1);
  }
};

seedData();
