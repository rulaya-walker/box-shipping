import express from 'express';
import { 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder,
  getOrderById,
  getOrderStats
} from '../controllers/adminOrderController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(isAdmin);

// Get all orders for admin
router.get('/', getAllOrders);

// Get order statistics
router.get('/stats', getOrderStats);

// Get specific order by ID
router.get('/:id', getOrderById);

// Update order status
router.put('/:id/status', updateOrderStatus);

// Delete order
router.delete('/:id', deleteOrder);

export default router;
