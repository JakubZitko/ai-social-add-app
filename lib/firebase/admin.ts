/**
 * Firebase Admin SDK initialization
 * Used for server-side operations like verifying tokens and accessing Firestore with admin privileges
 */

// Note: In a production environment, you would initialize firebase-admin here
// For now, we export mock/placeholder functions since the admin SDK requires
// service account credentials that aren't available in the demo environment

export interface DecodedIdToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

// Mock auth verification for demo purposes
export const verifyIdToken = async (token: string): Promise<DecodedIdToken> => {
  // In production, this would use admin.auth().verifyIdToken(token)
  // For demo, we'll decode the token if it looks valid or throw an error

  if (!token || token.length < 10) {
    throw new Error('Invalid token');
  }

  // Return a mock decoded token
  // In production, Firebase Admin would verify the JWT and return the actual claims
  return {
    uid: 'demo_user',
    email: 'demo@example.com',
    email_verified: true,
    name: 'Demo User',
  };
};

// Mock Firestore admin access
export const adminDb = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      get: async () => ({ exists: () => false, data: () => null }),
      set: async (data: any) => {},
      update: async (data: any) => {},
      delete: async () => {},
    }),
    add: async (data: any) => ({ id: 'new_doc_id' }),
    where: (field: string, op: string, value: any) => ({
      get: async () => ({ docs: [], empty: true }),
    }),
  }),
};

// Export placeholder for admin auth
export const adminAuth = {
  verifyIdToken,
  getUser: async (uid: string) => ({
    uid,
    email: 'demo@example.com',
    displayName: 'Demo User',
  }),
};

export default {
  auth: () => adminAuth,
  firestore: () => adminDb,
};
