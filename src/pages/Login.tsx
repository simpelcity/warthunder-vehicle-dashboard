import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Container, Form, Button } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from;
  const returnTo =
    typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')
      ? from
      : '/';

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setError('invalid credentials');
        return;
      }

      navigate(returnTo, { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'something went wrong');
    }
  };

  return (
    <Container className="px-0 py-4 p-md-4">
      <Form method="post" onSubmit={handleLogin} className="">
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-1 border-0 shadow-sm"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-1 border-0 shadow-sm"
          />
        </Form.Group>

        {error && <p className="text-danger">{error}</p>}

        <Form.Group className="mb-3">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form.Group>
      </Form>
    </Container>
  )
}
