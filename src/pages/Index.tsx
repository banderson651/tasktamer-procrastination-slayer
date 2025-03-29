
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Brain, Zap, ArrowRight, CheckSquare, Calendar, List } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
      }
    }
  };

  const staggeredContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Header/Nav */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-full"></div>
          <h1 className="text-2xl font-bold">TaskTamer</h1>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
          <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          <Link to="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </div>
        <Link to="/dashboard" className="md:hidden">
          <Button variant="ghost" size="sm">Dashboard</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Conquer Procrastination
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Break down overwhelming tasks into manageable steps and finally achieve your goals with TaskTamer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="relative overflow-hidden group">
                <span className="relative z-10 flex items-center">
                  Get Started <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 relative w-full max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border shadow-lg">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
            <img 
              src="https://placehold.co/1200x700/16151a/e2e2e4?text=TaskTamer+Dashboard" 
              alt="TaskTamer Dashboard" 
              className="rounded-xl shadow-md w-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to overcome procrastination and manage your tasks effectively.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggeredContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: CheckSquare,
                title: "Task Management",
                description: "Organize your tasks with priorities, deadlines, and categories to stay focused on what matters."
              },
              {
                icon: Brain, 
                title: "AI Assistant",
                description: "Let our AI help break down complex tasks into manageable steps automatically."
              },
              {
                icon: Calendar,
                title: "Smart Scheduling",
                description: "Plan your day effectively with our intelligent scheduling system."
              },
              {
                icon: List,
                title: "Custom Categories",
                description: "Create your own task categories to organize work your way."
              },
              {
                icon: Zap,
                title: "Focus Mode",
                description: "Eliminate distractions and focus on completing one task at a time."
              },
              {
                icon: CheckCircle2,
                title: "Track Progress",
                description: "Visualize your productivity and celebrate your accomplishments."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Use TaskTamer?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Designed specifically to help you overcome procrastination and get things done.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="https://placehold.co/600x500/16151a/e2e2e4?text=Easy+to+Use" 
                alt="Easy to use interface" 
                className="rounded-xl shadow-lg w-full"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl md:text-3xl font-bold">Beat Procrastination For Good</h3>
              <div className="space-y-4">
                {[
                  "Break overwhelming tasks into smaller, manageable steps",
                  "Focus on one thing at a time with clear priorities",
                  "Get smart suggestions from our AI to optimize your workflow",
                  "Track your progress and celebrate small wins",
                  "Build better habits with consistent task management"
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
              <Link to="/dashboard">
                <Button className="mt-4">
                  Start Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              TaskTamer has helped thousands of people overcome procrastination.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggeredContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Alex Johnson",
                role: "Software Developer",
                content: "TaskTamer completely changed how I approach my work. Breaking down complex coding projects into smaller tasks has boosted my productivity by at least 40%."
              },
              {
                name: "Sarah Miller",
                role: "Marketing Manager",
                content: "I used to struggle with prioritizing my team's tasks. Now with TaskTamer, we can clearly see what needs to be done first. The AI suggestions are surprisingly accurate!"
              },
              {
                name: "Michael Chen",
                role: "Graduate Student",
                content: "Writing my thesis seemed impossible until I started using TaskTamer. The way it breaks down large projects into tiny steps made all the difference for my ADHD brain."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className={cn(
                  "bg-card rounded-xl p-6 border shadow-sm",
                  index === 1 ? "md:translate-y-8" : ""
                )}
              >
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="mb-6 text-muted-foreground">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden border shadow-lg"
          >
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-accent/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Conquer Procrastination?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Start breaking down your tasks and achieving your goals today.
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="relative overflow-hidden group">
                  <span className="relative z-10 flex items-center">
                    Get Started Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-primary rounded-full"></div>
              <h2 className="text-xl font-bold">TaskTamer</h2>
            </div>
            <div className="flex gap-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} TaskTamer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
