'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogPage from '@/components/BlogPage';
import { navigate } from '@/lib/navigate';

export default function BlogShell() {
  const router = useRouter();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleOpenArticle = (id: number) => {
    router.push(`/#blog-article-${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="blog" onNavigate={navigate} />
      <main className="flex-1 relative" style={{ paddingTop: '86px' }}>
        <BlogPage onNavigate={navigate} onOpenArticle={handleOpenArticle} />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}