import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';

const router = Router();

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const {
      email,
      username,
      password,
      fullName,
      dateOfBirth,
      country,
      state,
      promoCode,
    } = req.body;

    // Validation
    if (!email || !username || !password || !fullName || !dateOfBirth || !country) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'username', 'password', 'fullName', 'dateOfBirth', 'country']
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        error: existingUser.email === email.toLowerCase() 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Check age (must be 21+)
    const birthDate = new Date(dateOfBirth);
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (age < 21) {
      return res.status(400).json({
        error: 'You must be 21 or older to register'
      });
    }

    // Check promo code if provided
    let promoCodeData = null;
    if (promoCode) {
      promoCodeData = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase() }
      });

      if (!promoCodeData || !promoCodeData.isActive) {
        return res.status(400).json({
          error: 'Invalid or expired promo code'
        });
      }

      // Check if promo code has usage limits
      if (promoCodeData.usageLimit && promoCodeData.usageCount >= promoCodeData.usageLimit) {
        return res.status(400).json({
          error: 'Promo code usage limit reached'
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '10'));

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        hashedPassword,
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        country,
        state: state || null,
        promoCodeId: promoCodeData?.id || null,
        balance: promoCodeData?.discountType === 'FREE_BET' ? promoCodeData.discountValue : 0,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        country: true,
        state: true,
        balance: true,
        createdAt: true,
      }
    });

    // Update promo code usage
    if (promoCodeData) {
      await prisma.promoCode.update({
        where: { id: promoCodeData.id },
        data: { usageCount: { increment: 1 } }
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || null,
      }
    });

    res.status(201).json({
      message: 'Registration successful',
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'Account is deactivated'
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || null,
      }
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        balance: user.balance,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// Check username availability
router.get('/check-username/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    });

    res.json({
      available: !user
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to check username'
    });
  }
});

// Check email availability
router.get('/check-email/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    res.json({
      available: !user
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to check email'
    });
  }
});

export default router;