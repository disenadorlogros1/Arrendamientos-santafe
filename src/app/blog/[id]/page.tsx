import type { Metadata } from 'next';
import { allArticles } from '@/data/blogArticles';
import BlogArticleShell from '@/components/shells/BlogArticleShell';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = allArticles.find(a => a.id === Number(id));
  return {
    title: article ? `${article.title} | Blog Arrendamientos Santa Fe` : 'Blog | Arrendamientos Santa Fe',
    description: article?.excerpt ?? 'Artículos del blog inmobiliario de Arrendamientos Santa Fe.',
  };
}

export async function generateStaticParams() {
  return allArticles.map(a => ({ id: String(a.id) }));
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <BlogArticleShell articleId={Number(id)} />;
}
