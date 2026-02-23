import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();

  const title = slug
    ? slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Course';

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
        <Link to="/courses">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </Link>

        <Card className="max-w-lg mx-auto text-center">
          <CardContent className="py-16 px-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-3">{title}</h1>
            <p className="text-muted-foreground mb-6">
              This course is coming soon. We're working hard to bring you the best content.
            </p>
            <Link to="/courses">
              <Button>Browse Other Courses</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
