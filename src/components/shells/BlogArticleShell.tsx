'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogArticlePage from '@/components/BlogArticlePage';
import { navigate } from '@/lib/navigate';

export default function BlogArticleShell({ articleId }: { articleId: number }) {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="blog" onNavigate={navigate} />
      <main className="flex-1 relative" style={{ paddingTop: '86px' }}>
        <BlogArticlePage articleId={articleId} onNavigate={navigate} />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
