'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  CreditCard,
  Sparkles,
  Check,
  Crown,
  Zap,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  ArrowRight,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Transaction } from '@/lib/firestore/types';

interface Plan {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  features: string[];
  popular?: boolean;
  badge?: string;
}

interface Transaction {
  id: string;
  date: Date;
  description: string;
  credits: number;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  invoice?: string;
}

export default function BillingPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <BillingContent />
      </AppLayout>
    </ProtectedRoute>
  );
}

function BillingContent() {
  const router = useRouter();
  const { user} = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch transaction history from Firestore
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const snapshot = await getDocs(transactionsQuery);
        const transactionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Transaction[];
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  // Credit plans
  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      credits: 50,
      price: 29,
      pricePerCredit: 0.58,
      features: [
        '50 video credits',
        'All AI voices',
        'HD video quality',
        'Basic support',
        '30-day credit validity',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      credits: 150,
      price: 79,
      pricePerCredit: 0.53,
      features: [
        '150 video credits',
        'All AI voices + Premium',
        '4K video quality',
        'Priority support',
        '90-day credit validity',
        'Custom branding',
      ],
      popular: true,
      badge: 'Most Popular',
    },
    {
      id: 'business',
      name: 'Business',
      credits: 500,
      price: 199,
      pricePerCredit: 0.40,
      features: [
        '500 video credits',
        'All features included',
        '4K video quality',
        '24/7 premium support',
        'Never expire credits',
        'Custom branding',
        'API access',
        'Bulk generation',
      ],
      badge: 'Best Value',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      credits: 2000,
      price: 599,
      pricePerCredit: 0.30,
      features: [
        '2000 video credits',
        'Unlimited features',
        '8K video quality',
        'Dedicated account manager',
        'Never expire credits',
        'White-label solution',
        'API access',
        'Custom voice cloning',
        'SLA guarantee',
      ],
      badge: 'Enterprise',
    },
  ];

  const currentCredits = user?.credits || 0;
  const totalSpent = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalCreditsEarned = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.credits, 0);

  const handlePurchase = (planId: string) => {
    setSelectedPlan(planId);
    // Simulate purchase flow
    alert(`Redirecting to payment for ${plans.find((p) => p.id === planId)?.name} plan...`);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Billing & Credits</h1>
          <p className="text-gray-600">Manage your subscription and view transaction history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[24px] p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Available Credits</div>
                <div className="text-3xl font-bold text-gray-900">{currentCredits}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[24px] p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Total Spent</div>
                <div className="text-3xl font-bold text-gray-900">${totalSpent}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[24px] p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Credits Earned</div>
                <div className="text-3xl font-bold text-gray-900">{totalCreditsEarned}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Balance Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[32px] p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Your Balance
                </span>
              </div>
              <div className="text-5xl font-bold mb-4">{currentCredits} Credits</div>
              <p className="text-gray-300">Each credit creates one AI video</p>
            </div>
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Zap className="h-5 w-5" />
              Get More Credits
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Credit Plans */}
        <div id="pricing" className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Plan</h2>
            <p className="text-gray-600 text-lg">One-time purchase. No subscription required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-[24px] p-6 shadow-sm border-2 transition-all hover:shadow-xl relative ${
                  plan.popular
                    ? 'border-gray-900 shadow-lg'
                    : 'border-gray-100'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${
                      plan.popular ? 'bg-gray-900' : 'bg-gradient-to-r from-purple-600 to-pink-600'
                    }`}>
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6 pt-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{plan.credits}</span> credits
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ${plan.pricePerCredit.toFixed(2)} per credit
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(plan.id)}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Purchase Plan
                </button>
              </div>
            ))}
          </div>

          {/* Enterprise CTA */}
          <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[24px] p-8 border-2 border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-xl font-bold text-gray-900">Need more?</h3>
                </div>
                <p className="text-gray-700">
                  Get custom pricing and features tailored to your business needs.
                </p>
              </div>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap">
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>

          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="text-xs font-semibold text-gray-600 uppercase">Date</div>
              <div className="text-xs font-semibold text-gray-600 uppercase col-span-2">Description</div>
              <div className="text-xs font-semibold text-gray-600 uppercase text-right">Amount</div>
              <div className="text-xs font-semibold text-gray-600 uppercase text-right">Invoice</div>
            </div>

            {/* Table Rows */}
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {transaction.date.toLocaleDateString()}
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {transaction.description}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                      transaction.status === 'completed'
                        ? 'bg-green-50 text-green-700'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {transaction.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      +{transaction.credits} credits
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-end gap-1 text-sm font-bold text-gray-900">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  {transaction.amount.toFixed(2)}
                </div>

                {/* Invoice */}
                <div className="flex items-center justify-end">
                  {transaction.invoice && (
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors">
                      <Download className="h-3 w-3" />
                      Invoice
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Visa ending in 4242</div>
                <div className="text-xs text-gray-500">Expires 12/2025</div>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
