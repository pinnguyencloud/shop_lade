// controllers/customerController.js
const db = require('../config/mysql.config');

const customerController = {
    // Get all customers
    getAllCustomers: async (req, res) => {
        try {
            const [customers] = await db.execute('SELECT * FROM customers WHERE is_active = true');
            res.json({
                status: 'success',
                data: customers
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Get customer by ID
    getCustomerById: async (req, res) => {
        try {
            const [customer] = await db.execute(
                'SELECT * FROM customers WHERE id = ? AND is_active = true',
                [req.params.id]
            );

            if (customer.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Customer not found'
                });
            }

            res.json({
                status: 'success',
                data: customer[0]
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Create new customer
    createCustomer: async (req, res) => {
        try {
            const { name, phone, email, address, ward, district, province } = req.body;

            // Validate required fields
            if (!name || !phone) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Name and phone are required'
                });
            }

            // Check if phone number already exists
            const [existingCustomer] = await db.execute(
                'SELECT * FROM customers WHERE phone = ?',
                [phone]
            );

            if (existingCustomer.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Phone number already exists'
                });
            }

            const [result] = await db.execute(
                'INSERT INTO customers (name, phone, email, address, ward, district, province) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, phone, email, address, ward, district, province]
            );

            const [newCustomer] = await db.execute(
                'SELECT * FROM customers WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json({
                status: 'success',
                data: newCustomer[0]
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Update customer
    updateCustomer: async (req, res) => {
        try {
            const { name, phone, email, address, ward, district, province } = req.body;
            const customerId = req.params.id;

            // Check if customer exists
            const [existingCustomer] = await db.execute(
                'SELECT * FROM customers WHERE id = ? AND is_active = true',
                [customerId]
            );

            if (existingCustomer.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Customer not found'
                });
            }

            // Check if phone number exists for other customers
            if (phone) {
                const [phoneExists] = await db.execute(
                    'SELECT * FROM customers WHERE phone = ? AND id != ?',
                    [phone, customerId]
                );

                if (phoneExists.length > 0) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Phone number already exists'
                    });
                }
            }

            await db.execute(
                `UPDATE customers 
                SET name = ?, phone = ?, email = ?, address = ?, ward = ?, district = ?, province = ?
                WHERE id = ?`,
                [name, phone, email, address, ward, district, province, customerId]
            );

            const [updatedCustomer] = await db.execute(
                'SELECT * FROM customers WHERE id = ?',
                [customerId]
            );

            res.json({
                status: 'success',
                data: updatedCustomer[0]
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Soft delete customer
    deleteCustomer: async (req, res) => {
        try {
            const [existingCustomer] = await db.execute(
                'SELECT * FROM customers WHERE id = ? AND is_active = true',
                [req.params.id]
            );

            if (existingCustomer.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Customer not found'
                });
            }

            await db.execute(
                'UPDATE customers SET is_active = false WHERE id = ?',
                [req.params.id]
            );

            res.json({
                status: 'success',
                message: 'Xoá người dùng thành công'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = customerController;