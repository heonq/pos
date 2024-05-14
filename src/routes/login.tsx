import { Link, useNavigate } from 'react-router-dom';
import { Wrapper, Form, Input, Title, Error, Switcher } from '../components/auth-components';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || password === '' || email === '') return;

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>로그인</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          type="email"
          value={email}
          placeholder="이메일 주소를 입력해주세요."
          required
        />
        <Input
          onChange={onChange}
          name="password"
          type="password"
          value={password}
          placeholder="비밀번호를 입력해주세요."
          required
        />
        <Input type="submit" value={isLoading ? '로그인 중' : '로그인하기'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 없어요.
        <Link to="/create-account">회원가입하기 &rarr;</Link>
      </Switcher>
      <Switcher>
        비밀번호를 잊어버렸어요.
        <Link to="/reset-password"> 비밀번호 재설정하기 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
