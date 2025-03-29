
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Brain, 
  Zap, 
  Focus, 
  Clock, 
  Target, 
  ArrowRight, 
  Sparkles,
  CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/50">
      {/* Decorative blobs */}
      <div className="fixed -z-10 top-0 right-0 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-3xl"></div>
      <div className="fixed -z-10 bottom-0 left-0 w-[30vw] h-[30vw] bg-accent/10 rounded-full blur-3xl"></div>
      
      {/* Header with Navigation */}
      <header className="container mx-auto pt-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white"
            >
              <CheckSquare className="h-6 w-6" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl font-bold"
            >
              TaskTamer
            </motion.h1>
          </div>
          
          <nav className="hidden md:flex gap-6">
            <motion.a 
              href="#features" 
              className="text-foreground/80 hover:text-primary transition-colors" 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Features
            </motion.a>
            <motion.a 
              href="#how-it-works" 
              className="text-foreground/80 hover:text-primary transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              How It Works
            </motion.a>
            <motion.a 
              href="#testimonials" 
              className="text-foreground/80 hover:text-primary transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              Testimonials
            </motion.a>
          </nav>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/dashboard">
              <Button size="lg" className="ripple-button bg-gradient-to-r from-primary to-accent hover:opacity-90 hover:scale-105 transition-all duration-300">
                Go to App
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          <motion.div 
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="main-heading tracking-tight leading-tight">
              Transform <br />
              Procrastination <br />
              into <span className="text-accent">Progress</span>
            </h1>
            
            <p className="subheading max-w-lg">
              TaskTamer helps people with ADHD, procrastinators, and busy individuals break down overwhelming tasks into manageable steps.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto ripple-button bg-gradient-to-r from-primary to-accent hover:opacity-90 hover:scale-105 transition-all duration-300">
                  Start Organizing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
            
            <motion.div 
              className="flex items-center gap-4 pt-4 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>No credit card required</span>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl overflow-hidden p-4 relative z-10">
              <img 
                src="/placeholder.svg" 
                alt="TaskTamer Dashboard" 
                className="w-full h-auto rounded-xl shadow-inner" 
              />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="main-heading text-3xl md:text-4xl lg:text-5xl mb-4">
            Features Designed for Focus
          </h2>
          <p className="subheading max-w-2xl mx-auto">
            Tools that work with your brain, not against it
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: <Brain className="h-10 w-10 text-primary" />,
              title: "AI Task Breakdown",
              description: "Our AI analyzes complex tasks and breaks them into simple, actionable steps."
            },
            {
              icon: <Zap className="h-10 w-10 text-accent" />,
              title: "Quick Capture",
              description: "Instantly capture tasks before they slip from your mind."
            },
            {
              icon: <Focus className="h-10 w-10 text-primary" />,
              title: "Distraction-Free Mode",
              description: "Focus on one task at a time to maintain momentum and concentration."
            },
            {
              icon: <Clock className="h-10 w-10 text-accent" />,
              title: "Time Estimation",
              description: "Realistic time estimates help you schedule your day more effectively."
            },
            {
              icon: <Target className="h-10 w-10 text-primary" />,
              title: "Priority System",
              description: "Visual cues help you instantly identify what needs attention first."
            },
            {
              icon: <Sparkles className="h-10 w-10 text-accent" />,
              title: "Dopamine Rewards",
              description: "Built-in reward mechanisms to keep your motivation high."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl -z-10"></div>
        
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="main-heading text-3xl md:text-4xl lg:text-5xl mb-4">
            How TaskTamer Works
          </h2>
          <p className="subheading max-w-2xl mx-auto">
            A simple process designed for your busy mind
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-primary/30 -translate-y-1/2 z-0"></div>
          
          {[
            {
              step: "1",
              title: "Add Your Task",
              description: "Enter what you need to accomplish, no matter how big or overwhelming it seems."
            },
            {
              step: "2",
              title: "Break It Down",
              description: "Use our AI assistant or manual tools to divide the task into small, manageable steps."
            },
            {
              step: "3",
              title: "Start & Succeed",
              description: "Begin with just one tiny step. Build momentum and watch your progress unfold."
            }
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg relative z-10"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg mb-4">
                {step.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4 py-16 md:py-24">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="main-heading text-3xl md:text-4xl lg:text-5xl mb-4">
            From Overwhelmed to Organized
          </h2>
          <p className="subheading max-w-2xl mx-auto">
            See how TaskTamer has helped others like you
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              quote: "TaskTamer's breakdown approach helped me finally finish my thesis. Breaking it into tiny steps made the impossible feel possible.",
              name: "Jamie K.",
              title: "Graduate Student"
            },
            {
              quote: "As someone with ADHD, I've tried dozens of productivity apps. This is the first one that actually works with my brain instead of against it.",
              name: "Alex M.",
              title: "Software Developer"
            },
            {
              quote: "The visual progress tracking gives me the dopamine hit I need to keep going. I'm more productive than I've ever been.",
              name: "Sam T.",
              title: "Marketing Manager"
            }
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full bg-gradient-to-br from-white to-secondary/50 border-2 border-primary/10 hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="text-5xl text-primary/30 font-serif mb-4">"</div>
                  <p className="flex-grow italic text-foreground/90 mb-6">{testimonial.quote}</p>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div 
          className="bg-gradient-to-br from-primary/90 to-accent/90 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Start Conquering Tasks Today
            </h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-8">
              Break the cycle of procrastination with a system designed for your mind
            </p>
            
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <CheckSquare className="h-5 w-5" />
            </div>
            <span className="font-bold">TaskTamer</span>
          </div>
          
          <div className="flex gap-6 text-muted-foreground text-sm">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TaskTamer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
