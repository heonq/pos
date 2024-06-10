import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Wrapper, Form, Input, Title, Error, Switcher } from '../components/auth-components';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';

export default function ResetPassword() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || email === '') return;

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  if (user !== null) return <Navigate to="/" />;
  return (
    <Wrapper>
      <Title>비밀번호 재설정</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          type="email"
          value={email}
          placeholder="이메일 주소를 입력해주세요."
          required
        />
        <Input type="submit" value={isLoading ? '메일 발송 중' : '재설정 메일 보내기'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 없어요.
        <Link to="/create-account">회원가입하기 &rarr;</Link>
      </Switcher>
      <Switcher>
        이미 계정이 있어요.
        <Link to="/login">로그인 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
