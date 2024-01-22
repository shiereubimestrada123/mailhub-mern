import { Button, Input } from '@components';

export function Register() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        labelText='First Name'
        inputProps={{ type: 'text', placeholder: 'Enter your first name' }}
      />
      <Input
        labelText='Middle Name'
        inputProps={{ type: 'text', placeholder: 'Enter your middle name' }}
      />
      <Input
        labelText='Last Name'
        inputProps={{ type: 'text', placeholder: 'Enter your last name' }}
      />
      <Input
        labelText='Email'
        inputProps={{ type: 'email', placeholder: 'Enter your email' }}
      />
      <Input
        labelText='Password'
        inputProps={{ type: 'password', placeholder: 'Enter your password' }}
      />
      <Input
        labelText='Confirm Password'
        inputProps={{
          type: 'password',
          placeholder: 'Enter again your password',
        }}
      />
      <Button
        type='submit'
        className='my-3 text-slate-100 btn btn-block btn-active btn-primary'
      >
        Register
      </Button>
    </form>
  );
}
