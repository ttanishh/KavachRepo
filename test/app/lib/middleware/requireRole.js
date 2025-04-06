import { NextResponse } from 'next/server';

export async function requireRole(user, allowedRoles) {
  if (!user || !user.role) {
    return {
      success: false,
      error: 'User role information missing',
      status: 403
    };
  }

  if (!allowedRoles.includes(user.role)) {
    return {
      success: false,
      error: 'You do not have permission to access this resource',
      status: 403
    };
  }

  return {
    success: true
  };
}
