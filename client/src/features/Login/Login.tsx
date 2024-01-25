import { Button } from '@components';

export function Login() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='text' />
      <input type='text' />
      <Button
        type='submit'
        className='my-3 text-slate-100 btn btn-block btn-active btn-primary'
      >
        Login
      </Button>
    </form>
  );
}
