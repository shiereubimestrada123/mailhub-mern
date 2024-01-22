import { Button, Input } from '@components';

export function Login() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        labelText='Email'
        inputProps={{ type: 'text', placeholder: 'Enter your email' }}
      />
      <Input
        labelText='Password'
        inputProps={{ type: 'text', placeholder: 'Enter your password' }}
      />
      <Button
        type='submit'
        className='my-3 text-slate-100 btn btn-block btn-active btn-primary'
      >
        Login
      </Button>
    </form>
  );
}
