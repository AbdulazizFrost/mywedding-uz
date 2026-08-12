import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../../config/database.js';
import { isProduction } from '../../config/env.js';

const SESSION_COOKIE_NAME = 'sessionId';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const setSessionCookie = (res, token) => {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax', // Use 'none' for cross-domain prod environments (e.g. Vercel frontend, VPS backend)
    maxAge: SESSION_MAX_AGE,
  });
};

const clearSessionCookie = (res) => {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
};

export const register = async (req, res, next) => {
  try {
    let { email, password, full_name, phone } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    email = email.trim().toLowerCase();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password_hash,
        full_name,
        phone,
        role: 'user', // Always 'user' for normal registration
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        phone: true,
        role: true,
        created_at: true,
      },
    });

    res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    email = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' }); // Keep error vague
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);

    // Reuse existing Session model (which has refresh_token as its unique token field per user instructions not to create a new model)
    // We map sessionToken to `refresh_token` field since it acts as the persistent token in DB.
    await prisma.session.create({
      data: {
        user_id: user.id,
        refresh_token: sessionToken,
        user_agent: req.headers['user-agent'] || 'unknown',
        ip_address: req.ip || 'unknown',
        expires_at: expiresAt,
      },
    });

    setSessionCookie(res, sessionToken);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies[SESSION_COOKIE_NAME];
    
    if (token) {
      await prisma.session.deleteMany({
        where: { refresh_token: token },
      });
    }

    clearSessionCookie(res);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

export const me = (req, res) => {
  // requireAuth middleware ensures req.user is populated
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    full_name: req.user.full_name,
    phone: req.user.phone,
    role: req.user.role,
  });
};
