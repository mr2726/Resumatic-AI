import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12">
      <section className="mt-8 md:mt-16">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground mb-6">
          Craft Your Perfect Resume with <span className="text-primary">Resumatic AI</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Stop struggling with resume writing. Let our AI instantly create a professional, job-optimized resume tailored to your dream job. Minimal input, maximum impact.
        </p>
        <Link href="/create-resume">
          <Button size="lg" className="font-semibold text-lg">
            Create Your Resume Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      <section className="w-full max-w-4xl">
        <Image 
          src="https://placehold.co/1000x400.png" 
          alt="Resume examples" 
          width={1000} 
          height={400} 
          className="rounded-lg shadow-xl"
          data-ai-hint="resume templates professional" 
        />
      </section>

      <section className="w-full max-w-4xl space-y-8">
        <h2 className="text-3xl font-headline font-bold text-foreground">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center font-headline text-xl">
                <Sparkles className="h-6 w-6 mr-2 text-accent" />
                1. Provide Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Paste the job description and tell us a bit about yourself – your skills, interests, or even a rough draft.</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center font-headline text-xl">
                <Sparkles className="h-6 w-6 mr-2 text-accent" />
                2. AI Magic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Our intelligent AI analyzes the job and your input to generate a perfectly tailored resume in seconds.</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center font-headline text-xl">
                <CheckCircle className="h-6 w-6 mr-2 text-primary" />
                3. Preview & Unlock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Preview your new resume. Happy with it? A small one-time payment unlocks it for download.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full max-w-2xl">
         <h2 className="text-3xl font-headline font-bold text-foreground mb-6">Why Choose Resumatic AI?</h2>
         <ul className="space-y-4 text-left text-lg text-muted-foreground">
            <li className="flex items-start">
                <CheckCircle className="h-6 w-6 mr-3 text-primary__replace_this_with_accent_foreground flex-shrink-0 mt-1" />
                <span><strong className="text-foreground">Instant Results:</strong> Get a high-quality resume in minutes, not hours.</span>
            </li>
            <li className="flex items-start">
                <CheckCircle className="h-6 w-6 mr-3 text-primary_replace_this_with_accent_foreground flex-shrink-0 mt-1" />
                <span><strong className="text-foreground">Job-Optimized:</strong> AI tailors your resume to match specific job descriptions, increasing your chances.</span>
            </li>
            <li className="flex items-start">
                <CheckCircle className="h-6 w-6 mr-3 text-primary_replace_this_with_accent_foreground flex-shrink-0 mt-1" />
                <span><strong className="text-foreground">Effortless Process:</strong> No complicated forms or sign-ups. Just simple text inputs.</span>
            </li>
            <li className="flex items-start">
                <CheckCircle className="h-6 w-6 mr-3 text-primary_replace_this_with_accent_foreground flex-shrink-0 mt-1" />
                <span><strong className="text-foreground">Professional Formatting:</strong> Impress employers with a clean, modern, and professionally designed resume.</span>
            </li>
         </ul>
      </section>

      <section className="py-12">
        <Link href="/create-resume">
          <Button size="lg" variant="default" className="font-semibold text-lg">
            Get Started & Build Your Resume <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
