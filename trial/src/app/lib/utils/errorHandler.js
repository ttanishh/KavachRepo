import { NextResponse } from 'next/server';

export function errorHandler(error, defaultMessage = 'An error occurred') {
  console.error(error);
  
  const message = error.message || defaultMessage;
  
  return NextResponse.json(
    { message, error: error.toString() },
    { status: error.status || 500 }
  );
}
