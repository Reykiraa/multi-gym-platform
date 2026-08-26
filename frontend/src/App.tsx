import React from 'react';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Badge from './components/ui/Badge';
import Input from './components/ui/Input';

function App() {
  return (
    <main className="max-w-md mx-auto shadow-2xl min-h-screen bg-zinc-950 text-white relative overflow-x-hidden p-6 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-yellow-500">Multi-Gym Platform</h1>
        <p className="text-zinc-400 text-sm mt-1">App Shell Initialized</p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b border-zinc-800 pb-2">Component Library Test</h2>
        
        <Card>
          <h3 className="text-md font-medium mb-3">Buttons</h3>
          <div className="flex flex-col gap-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="primary" isLoading>Loading State</Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-md font-medium mb-3">Inputs</h3>
          <div className="flex flex-col gap-3">
            <Input label="Email Address" placeholder="Enter your email" type="email" />
            <Input label="Password" placeholder="Enter your password" type="password" error="Password is required" />
          </div>
        </Card>

        <Card>
          <h3 className="text-md font-medium mb-3">Badges</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="warning">Pending</Badge>
            <Badge variant="success">Active</Badge>
            <Badge variant="danger">Failed</Badge>
            <Badge variant="info">New</Badge>
          </div>
        </Card>
      </section>
    </main>
  );
}

export default App;
