import Link from 'next/link';
import Image from 'next/image';
import { Info, BookOpen, FileText, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                <Image 
                  src="/HAI Favicon.png" 
                  alt="HAI Logo" 
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-semibold text-gray-900">Holistic AI LLM Decision Hub</span>
            </div>
            <p className="text-gray-600 text-sm">
              Comprehensive assessment and benchmarking of AI language models for safety and performance.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 group">
                  <Info className="w-4 h-4 group-hover:text-blue-600" />
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link href="/holistic-ai-library" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 group">
                  <BookOpen className="w-4 h-4 group-hover:text-blue-600" />
                  <span>Holistic AI Library</span>
                </Link>
              </li>
              {/* <li>
                <Link href="/enterprise-cost-optimizer" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 group">
                  <Calculator className="w-4 h-4 group-hover:text-blue-600" />
                  <span>Enterprise Cost Optimizer</span>
                </Link>
              </li> */}

            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 group">
                  <FileText className="w-4 h-4 group-hover:text-blue-600" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 group">
                  <Shield className="w-4 h-4 group-hover:text-blue-600" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            <strong>IMPORTANT:</strong> All safety assessments and jailbreaking test results are copyrighted materials owned by{' '}
            <Link href="https://www.holisticai.com/" className="text-blue-600 hover:underline">Holistic AI</Link>. 
            Reproduction, distribution, or use of these data requires explicit attribution and a link to the original source. 
            Unauthorized use is strictly prohibited.
          </p>
          <p className="text-center text-sm text-gray-500 mt-4">
            © 2025 LLM Decision Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 