import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ModelProviders from '../../components/ModelProviders';
import Navigation from '../../components/Navigation';

export default function ProvidersPage() {
  return (
    <div className="flex flex-col bg-gray-100">
      <Navigation />

      <main className="flex-grow">
        <div className="pt-8 pb-16">
          <div className="mx-auto w-full max-w-[1400px] px-2 sm:px-3 lg:px-4">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leaderboard
              </Link>
            </div>

            {/* Page Header */}
            <div className="mb-12 text-center max-w-4xl mx-auto">
              <h1 className="text-4xl font-normal mb-6 text-gray-900 tracking-tight leading-tight">Provider Performance & Pricing</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                See which providers support your model, how they perform, and what they cost—so you can choose the right fit for your use case.
              </p>
            </div>

            {/* Main Component */}
            <div className="bg-white rounded-xl shadow-lg">
              <ModelProviders />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
} 