// Attendance.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  check_in: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  check_out: { type: DataTypes.DATE, allowNull: true },
}, {
  timestamps: true, // ✅ Enable timestamps (createdAt, updatedAt)
});

Attendance.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Attendance;

